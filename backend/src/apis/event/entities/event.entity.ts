import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

/* Event Entity */
@Entity({ name: 'event' })
@ObjectType({ description: 'Event Entity' })
export class EventEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'UUID' })
    id: string;

    @Column()
    @Field(() => String, { description: '제목' })
    title: string;

    @Column({ type: 'text' })
    @Field(() => String, { description: '내용' })
    contents: string;

    @Column()
    @Field(() => Boolean, { description: '이벤트 진행 여부' })
    isEvent: boolean;

    @Column()
    @Field(() => Date, { description: '이벤트 시작 시간' })
    startAt: Date;

    @Column()
    @Field(() => Date, { description: '이벤트 종료 시간' })
    endAt: Date;

    @CreateDateColumn()
    @Field(() => Date, { description: '생성 시간' })
    createAt: Date;

    @UpdateDateColumn()
    @Field(() => Date, { description: '수정 시간' })
    updateAt: Date;

    @ManyToOne(
        () => UserEntity, //
        { cascade: true, onDelete: 'SET NULL' },
    )
    @JoinColumn()
    @Field(() => UserEntity)
    user: UserEntity;
}