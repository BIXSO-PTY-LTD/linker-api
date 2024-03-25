import { I_Input_Filters } from 'cyberskill/typescript';

import { userCtr } from '#controllers';
import {
    I_Context,
    I_Input_Create_User,
    I_Input_Delete_User,
    I_Input_Get_User,
    I_Input_Update_User,
} from '#shared/typescript';

export default {
    Query: {
        getUser: (_, args: I_Input_Get_User, { req }: I_Context) => {
            const { populate, ...conditions } = args;

            return userCtr.getUser(req, conditions, populate);
        },
        getUsers: (_, args: I_Input_Filters, { req }: I_Context) => userCtr.getUsers(req, args.filters),
    },
    Mutation: {
        createUser: (_, args: I_Input_Create_User, { req }: I_Context) => userCtr.createUser(req, args),
        updateUser: (_, args: I_Input_Update_User, { req }: I_Context) => userCtr.updateUser(req, args),
        deleteUser: (_, args: I_Input_Delete_User, { req }: I_Context) => userCtr.deleteUser(req, args),
    },
};
