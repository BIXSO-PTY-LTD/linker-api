import { generateModel } from 'cyberskill/utils/mongoose';
import mongoose from 'mongoose';

import { validate } from '#shared';
import { I_Test } from '#typescript';

export const TestModel = generateModel({
    mongoose,
    name: 'Test',
    pagination: true,
    schema: new mongoose.Schema<I_Test>({
        name: {
            type: String,
            validate: [
                {
                    validator: validate.common.isEmptyValidator(),
                    message: 'Vui lòng nhập tên',
                },
                {
                    validator: validate.common.isUniqueValidator(['name']),
                    message: 'Tên bị trùng lặp',
                },
            ],
        },
    }),
});
