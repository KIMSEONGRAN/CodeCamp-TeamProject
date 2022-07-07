import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class FileAdminRepository {
    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) {}

    private readonly _selector = [
        'file.id',
        'file.name',
        'file.path',
        'file.url',
        'file.createAt',
    ];

    async findAll(): Promise<FileEntity[]> {
        return await this.fileRepository
            .createQueryBuilder('file')
            .select(this._selector)
            .withDeleted()
            .orderBy('file.createAt')
            .getMany();
    }

    async findOne(
        fileID: string, //
    ): Promise<FileEntity> {
        return await this.fileRepository
            .createQueryBuilder('file')
            .select([...this._selector, 'file.deleteAt'])
            .withDeleted()
            .where('file.id=:id', { id: fileID })
            .getOne();
    }

    async bulkDelete(
        IDs: Array<string>, //
    ): Promise<DeleteResult[]> {
        return await Promise.all(
            IDs.map((id) => {
                return this.fileRepository.delete({ id: id });
            }),
        );
    }
}
