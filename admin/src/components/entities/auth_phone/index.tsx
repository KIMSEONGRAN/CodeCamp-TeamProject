import { EntityFactory } from '../entity_factory';
import { DummyPhoneColumn, IPhoneColumn } from './interface';

// prettier-ignore
export const PhoneIndex = EntityFactory.getEntity<IPhoneColumn>({
    name: '핸드폰 인증',
    dummyData: DummyPhoneColumn,
    baseURL: '/admin/entity/authPhone',
    beURL: '/admin/phone',

    list: {
        column: [
            'id', 'user', 'phone', 'token', 
            'isAuth', 'createAt', 'updateAt',
        ],
        option: {
            user: 'email',
        },
    },
    show: {
        column: [
            'id', 'user', 'phone', 'token', 
            'isAuth', 'createAt', 'updateAt',
        ],
        option: {
            user: 'email',
        },
    },
});
