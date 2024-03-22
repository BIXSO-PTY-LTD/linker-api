import { userCtr } from '#controllers';
import {
    I_Context,
    I_Input_Create_User,
    I_Input_Delete_User,
    I_Input_Filters,
    I_Input_Get_User,
    I_Input_Update_User,
} from '#shared/typescript';

export default {
    Query: {
        getUser: (_, args: I_Input_Get_User, { req }: I_Context) => {
            const { populate, ...conditions } = args.user;

            return userCtr.getUser(req, conditions, populate);
        },
        getUsers: (_, args: I_Input_Filters, { req }: I_Context) => userCtr.getUsers(req, args.filters),
    },
    Mutation: {
        createUser: (_, args: { user: I_Input_Create_User }, { req }: I_Context) => userCtr.createUser(req, args.user),
        updateUser: (_, args: { user: I_Input_Update_User }, { req }: I_Context) => userCtr.updateUser(req, args.user),
        deleteUser: (_, args: { user: I_Input_Delete_User }, { req }: I_Context) => userCtr.deleteUser(req, args.user),
    },
};
