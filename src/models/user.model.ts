import mongoose from 'mongoose';

import { validate } from '#shared';
import { generateModel } from 'cyberskill/utils/mongoose';
import { I_User } from 'src/typescript';
import config from '#config';

export const UserModel = generateModel({
    mongoose,
    name: config.DATABASE_COLLECTIONS.USER,
    pagination: true,
    schema: new mongoose.Schema<I_User>({
        email: {
            type: String,
            unique: true,
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
        phone: { unique: true, type: String },
    }),
});
