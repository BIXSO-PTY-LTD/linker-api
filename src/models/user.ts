import { generateModel, validate } from 'cyberskill/utils';
import mongoose from 'mongoose';

import { I_User } from '#shared/typescript/user';

export const userModel = generateModel<I_User>({
    mongoose,
    name: 'User',
    pagination: true,
    schema: new mongoose.Schema({
        email: {
            type: String,
            validate: [
                {
                    validator: validate.common.isEmptyValidator(),
                    message: 'Vui lòng nhập email cho người dùng',
                },
                {
                    validator: validate.common.isUniqueValidator(['email']),
                    message: 'Email bị trùng lặp',
                },
            ],
        },
        fullName: {
            type: String,
        },
        password: {
            type: String,
            validate: [
                {
                    validator: validate.common.isEmptyValidator(),
                    message: 'Vui lòng nhập mật khẩu cho người dùng',
                },
            ],
        },
        phone: {
            type: String,
        },
    }),
});
