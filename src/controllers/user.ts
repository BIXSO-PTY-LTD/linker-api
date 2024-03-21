import bcrypt from 'bcryptjs';
import { RESPONSE_STATUS } from 'cyberskill/constants';
import { MongooseController } from 'cyberskill/controllers';
import { T_FilterQuery, T_PopulateOptions } from 'cyberskill/typescript';
import { throwResponse } from 'cyberskill/utils';

import { userModel } from '#models';
import {
    I_Input_Create_User,
    I_Input_Delete_User,
    I_Input_Filters,
    I_Input_Update_User,
    I_Request,
    I_User,
} from '#shared/typescript';

const mongooseCtr = new MongooseController<I_User>(userModel);

export const userCtr = {
    getUser: async (_, args: T_FilterQuery<I_User>, populate?: T_PopulateOptions) => {
        return mongooseCtr.findOne(args, null, {}, populate);
interface I_UserCtr {
    getUser: (args: T_UserArgs, populate?: string | object) => Promise<I_User | null>;
    updateOne: (args: T_UserArgs, update: T_UserArgs) => Promise<boolean>;
}

export const userCtr: I_UserCtr = {
    getUser: async (args, populate) => {
        const getUserRes = (await mongooseCtr.findOne(UserModel, args, null, {}, populate)) as {
            success: boolean;
            result: I_User;
        };

        if (!getUserRes.success)
            throw new GraphQLError('Failed to get user', {
                extensions: {
                    code: 500,
                },
            });

        return getUserRes.result;
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
                message: userCreated?.message,
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
