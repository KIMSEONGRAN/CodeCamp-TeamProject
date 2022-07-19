import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { BookmarkEntity } from './bookmark.entity';
import { CreateBookmarkDto } from '../dto/createBookmark.dto';
import { DeleteBookmarkDto } from '../dto/deleteBookmark.dto';

@Injectable()
export class BookmarkRepository {
    constructor(
        @InjectRepository(BookmarkEntity)
        private readonly bookmarkRepository: Repository<BookmarkEntity>, //
    ) {}

    /** 전체 조회(삭제 데이터X) */
    async findAll(): Promise<BookmarkEntity[]> {
        return await this.bookmarkRepository.find({
            relations: ['user', 'novelIndex'],
        });
    }

    /** 단일 조회(삭제 데이터O) */
    async findOne(
        userID: string,
        novelIndexID: string, //
        page: number,
    ): Promise<BookmarkEntity> {
        return await this.bookmarkRepository.findOne({
            withDeleted: true,
            where: { novelIndex: novelIndexID, page, user: userID },
        });
    }

    /** 유효ID 체크 */
    async checkValid(
        dto: DeleteBookmarkDto, //
    ): Promise<BookmarkEntity> {
        return await this.bookmarkRepository
            .createQueryBuilder('bm')
            .select(['bm.id', 'bm.userID'])
            .where('bm.id=:id', { id: dto.bookmarkID })
            .andWhere('bm.userID=:userID', { userID: dto.userID })
            .getOne();
    }

    /** 중복체크 */
    async duplicateCheck(
        userID: string,
        dto: CreateBookmarkDto, //
    ): Promise<BookmarkEntity> {
        return await this.bookmarkRepository
            .createQueryBuilder('bm')
            .select([
                'bm.id',
                'bm.userID',
                'bm.novelIndexID',
                'bm.isBoolean',
                'bm.page',
            ])
            .where('bm.userID=:userID', { userID: userID })
            .andWhere('bm.novelIndexID=:novelIndexID', {
                novelIndexID: dto.novelIndexID,
            })
            .andWhere('bm.page=:page', {
                page: dto.page,
            })
            .getOne();
    }

    ///////////////////////////////////////////////////////////////////
    // 생성 //

    async save(
        bookmark: Partial<BookmarkEntity>, //
    ): Promise<BookmarkEntity> {
        return await this.bookmarkRepository.save(bookmark);
    }

    ///////////////////////////////////////////////////////////////////
    // 제거 //

    async delete(
        bookmarkID: string, //
    ): Promise<DeleteResult> {
        return await this.bookmarkRepository.delete({
            id: bookmarkID,
        });
    }

    async softdelete(
        bookmarkID: string, //
    ): Promise<DeleteResult> {
        return await this.bookmarkRepository.softDelete(bookmarkID);
    }

    ///////////////////////////////////////////////////////////////////
    // 삭제 취소 //

    async restore(
        bookmarkID: string, //
    ): Promise<UpdateResult> {
        return await this.bookmarkRepository.restore(bookmarkID);
    }
}
