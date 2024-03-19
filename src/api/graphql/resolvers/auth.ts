import { authCtr } from '#controllers';
import { I_Context, I_Input_CheckAuth, I_Input_Login, I_Input_Register } from '#shared/typescript';

export default {
    Query: {
        checkAuth: (_, args: I_Input_CheckAuth, { req }: I_Context) => authCtr.checkAuth(req, args),
    },
    Mutation: {
        register: (_, args: { user: I_Input_Register }, { req }: I_Context) => authCtr.register(req, args.user),
        login: (_, args: { user: I_Input_Login }, { SECRET, req }: I_Context) => authCtr.login(req, args.user, SECRET),
        logout: (_, __, { req }: I_Context) => authCtr.logout(req),
import { T_HandleChangePasswordArgs, T_HandleRequestTempPasswordArgs } from '#typescript';

export default {
    Mutation: {
        requestPasswordReset: (_, args: T_HandleRequestTempPasswordArgs) => authCtr.handleRequestTempPassword(args),
        changePassword: (_, args: T_HandleChangePasswordArgs) => authCtr.handleChangePassword(args),
    },
};
