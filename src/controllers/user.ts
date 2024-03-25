import bcrypt from 'bcrypt';
import { RESPONSE_STATUS } from 'cyberskill/constants';
import { MongooseController } from 'cyberskill/controllers';
import { I_Input_Filters, T_FilterQuery, T_PopulateOptions } from 'cyberskill/typescript';
import { throwResponse } from 'cyberskill/utils';

import { UserModel } from '#models';
import { I_Input_Create_User, I_Input_Delete_User, I_Input_Update_User, I_Request, I_User } from '#shared/typescript';

const mongooseCtr = new MongooseController<I_User>(UserModel);

export const userCtr = {
    getUser: async (_, args: T_FilterQuery<I_User>, populate?: T_PopulateOptions) => {
        return mongooseCtr.findOne(args, {}, {}, populate);
    },
    getUsers: async (_, args: I_Input_Filters) => {
        const { query = {}, ...options } = args;

        return mongooseCtr.findAll(args, query, options);
    },
    createUser: async (req: I_Request, args: I_Input_Create_User) => {
        const { email, password, ...rest } = args;

        const userFound = await userCtr.getUser(req, {
            email,
        });

        if (userFound.success) {
            throwResponse({
                message: 'Người dùng đã tồn tại.',
                status: RESPONSE_STATUS.BAD_REQUEST,
            });
        }

        const userCreated = await mongooseCtr.createOne({
            email,
            password: bcrypt.hashSync(password, 10),
            ...rest,
        });

        if (!userCreated.success) {
            throwResponse({
                message: userCreated.message,
            });
        }

        return userCreated;
    },
    updateUser: async (req: I_Request, args: I_Input_Update_User) => {
        const { id, ...rest } = args;

        const userFound = await userCtr.getUser(req, { id });

        if (!userFound.success) {
            throwResponse({
                message: 'Người dùng không tồn tại.',
            });
        }

        return mongooseCtr.updateOne(
            { id },
            {
                ...rest,
            },
        );
    },
    deleteUser: async (req: I_Request, args: I_Input_Delete_User) => {
        const { id } = args;
        const userFound = await userCtr.getUser(req, { id });

        if (!userFound.success) {
            throwResponse({
                message: 'Người dùng không tồn tại.',
                status: RESPONSE_STATUS.NOT_FOUND,
            });
        }

        return mongooseCtr.deleteOne({ id });
    },
};
