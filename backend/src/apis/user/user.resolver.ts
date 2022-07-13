import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { IPayload } from 'src/commons/interfaces/Payload.interface';
import { MESSAGES } from 'src/commons/message/Message.enum';
import { ResultMessage } from 'src/commons/message/ResultMessage.dto';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
import { GqlJwtAccessGuard } from 'src/commons/auth/gql-auth.guard';

import { UserOutput } from './dto/user.output';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserRepository } from './entities/user.repository';

import { UserService } from './user.service';
import { CreateUserOutput } from './dto/createUser.output';
import { PaymentEntity } from '../payment/entities/payment.entity';

/* 유저 API */
@Resolver()
export class UserResolver {
    constructor(
        private readonly userRepository: UserRepository, //
        private readonly userService: UserService, //
    ) {}

    private logger = new Logger('User');

    ///////////////////////////////////////////////////////////////////
    // Util //

    ///////////////////////////////////////////////////////////////////
    // 조회 //

    /**
     * GET /api/user
     * - Bearer JWT
     */
    @UseGuards(GqlJwtAccessGuard)
    @Query(
        () => UserOutput, //
        { description: '회원 단일 조회, Bearer JWT', nullable: true },
    )
    fetchLoginUser(
        @CurrentUser() payload: IPayload, //
    ): Promise<UserOutput> {
        this.logger.log(`${payload.nickName} - fetchLoginUser`);

        return this.userRepository.findOneByID(payload.id);
    }

    @UseGuards(GqlJwtAccessGuard)
    @Query(
        () => [PaymentEntity], //
        { description: '회원 결제 목록' },
    )
    fetchPaymentsInUser(
        @CurrentUser() payload: IPayload, //
    ): Promise<PaymentEntity[]> {
        this.logger.log(`${payload.nickName} - fetchPaymentsInUser`);

        return this.userRepository.findPayments(payload.id);
    }

    ///////////////////////////////////////////////////////////////////
    // 생성 //

    /**
     * POST /api/signup
     */
    @Mutation(
        () => CreateUserOutput, //
        { description: '회원가입' },
    )
    createUser(
        @Args('createUserInput') input: CreateUserInput, //
    ): Promise<CreateUserOutput> {
        this.logger.log(`${input.nickName} - createUser`);

        return this.userService.createUser(input);
    }

    ///////////////////////////////////////////////////////////////////
    // 수정 //

    /**
     * PATCH /api/user/pwd
     */
    @UseGuards(GqlJwtAccessGuard)
    @Mutation(
        () => ResultMessage, //
        { description: '비밀번호 변경, Bearer JWT' },
    )
    async updateUserPwd(
        @CurrentUser() payload: IPayload, //
        @Args('pwd') pwd: string,
    ): Promise<ResultMessage> {
        this.logger.log(`${payload.nickName} - updateUserPwd`);

        // 비밀번호 변경 + 로그아웃
        const result = await this.userService.updatePwd(payload.id, pwd);
        return new ResultMessage({
            isSuccess: result,
            contents: result
                ? MESSAGES.USER_UPDATE_PWD_SUCCESSED
                : MESSAGES.USER_UPDATE_PWD_FAILED,
        });
    }

    /**
     * PATCH /api/user
     * - Bearer JWT
     */
    @UseGuards(GqlJwtAccessGuard)
    @Mutation(
        () => ResultMessage, //
        { description: '회원 정보 수정, Bearer JWT' },
    )
    async updateLoginUser(
        @CurrentUser() payload: IPayload,
        @Args('updateInput') updateInput: UpdateUserInput,
    ): Promise<ResultMessage> {
        this.logger.log(`${payload.nickName} - updateLoginUser`);

        const result = await this.userService.updateLoginUser(
            payload.id,
            updateInput,
        );
        return new ResultMessage({
            isSuccess: result,
            contents: result
                ? MESSAGES.USER_UPDATE_INFO_SUCCESSED
                : MESSAGES.USER_UPDATE_INFO_FAILED,
        });
    }

    ///////////////////////////////////////////////////////////////////
    // 삭제 //

    /**
     * DELETE /api/user
     * - Bearer JWT
     */
    @UseGuards(GqlJwtAccessGuard)
    @Mutation(
        () => ResultMessage, //
        { description: '회원 탈퇴 ( Soft ), Bearer JWT' },
    )
    async deleteLoginUser(
        @CurrentUser() payload: IPayload, //
    ): Promise<ResultMessage> {
        this.logger.log(`${payload.nickName} - deleteLoginUser`);

        const result = await this.userService.softDelete(payload.id);
        return new ResultMessage({
            isSuccess: result,
            contents: result
                ? MESSAGES.USER_SOFT_DELETE_SUCCESSED
                : MESSAGES.USER_SOFT_DELETE_FAILED,
        });
    }
}
