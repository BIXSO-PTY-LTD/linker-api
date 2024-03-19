import bcrypt from 'bcryptjs';
import { RESPONSE_STATUS } from 'cyberskill/constants';
import { throwResponse } from 'cyberskill/utils';
import jwt from 'jsonwebtoken';
import omit from 'lodash/omit';

import config from '#config';
import {
    I_Input_CheckAuth,
    I_Input_CheckToken,
    I_Input_GenerateToken,
    I_Input_Login,
    I_Input_Register,
    I_Request,
} from '#shared/typescript';
import { userCtr } from './user';

export const authCtr = {
    generateToken: (_, { id }: I_Input_GenerateToken, SECRET: string) => {
        let token = '';

        token = jwt.sign({ iat: Date.now(), userId: id }, SECRET, {
            expiresIn: config.SESSION.MAX_AGE,
        });

        return token;
    },
    checkToken: async (req: I_Request, args: I_Input_CheckToken) => {
        const { token } = args;
        const { userId, exp } = jwt.decode(token);

        const userFound = await userCtr.getUser(req, {
            id: userId,
        });

        if (!userFound.success || Date.now() > new Date(exp).getTime()) {
            throwResponse({
                message: 'Token không hợp lệ hoặc hết hạn.',
                status: RESPONSE_STATUS.UNAUTHORIZED,
            });
        }

        return {
            success: true,
        };
    },
    checkAuth: async (req: I_Request, args?: I_Input_CheckAuth) => {
        if (req?.session?.user) {
            const userFound = await userCtr.getUser(req, {
                id: req.session.user.id,
            });

            if (!userFound.success) {
                throwResponse({
                    message: 'Token không hợp lệ hoặc hết hạn.',
                    status: RESPONSE_STATUS.UNAUTHORIZED,
                });
            }

            return {
                success: true,
            };
        }

        if (args?.token) {
            return authCtr.checkToken(req, { token: args.token });
        }

        return {
            success: false,
        };
    },
    login: async (req: I_Request, args: I_Input_Login, SECRET: string) => {
        const authChecked = await authCtr.checkAuth(req);

        if (authChecked.success) {
            return authChecked;
        }

        const { identify, password, rememberMe } = args;

        const userFound = await userCtr.getUser(req, {
            $or: [{ email: identify }, { phone: identify }],
        });

        if (!userFound.success) {
            throwResponse({
                message: 'Thông tin đăng nhập không đúng.',
                status: RESPONSE_STATUS.BAD_REQUEST,
            });
        }

        const isPasswordMatched = bcrypt.compareSync(password, userFound.result?.password);

        if (!isPasswordMatched) {
            throwResponse({
                message: 'Thông tin đăng nhập không đúng.',
                status: RESPONSE_STATUS.BAD_REQUEST,
            });
        }

        let token = '';

        req.session.user = userFound.result;

        if (rememberMe) {
            token = authCtr.generateToken(req, { id: userFound.result?.id }, SECRET);
        }

        return {
            success: true,
            ...(token && { token }),
        };
    },
    register: async (req: I_Request, args: I_Input_Register) => {
        const userCreated = await userCtr.createUser(req, {
            ...args,
        });

        if (!userCreated.success) {
            throwResponse({
                message: userCreated?.message,
            });
        }

        req.session.user = omit(userCreated.result, 'password');

        return {
            success: true,
        };
    },
    logout: async (req: I_Request) => {
        if (req?.session?.user) {
            req.session.destroy((err) => {
                if (err) {
                    throwResponse({
                        message: 'Đăng xuất thất bại.',
                    });
                }
            });

            return {
                success: true,
            };
        }

        throwResponse({
            message: 'Đăng xuất thất bại.',
        });
import { GraphQLError } from 'graphql';
import { userCtr, userVerificationCtr } from '#controllers';
import {
    E_IDENTITY_TYPE,
    I_User,
    T_HandleChangePasswordArgs,
    T_HandleChangePasswordReturn,
    T_HandleRequestTempPasswordArgs,
    T_HandleRequestTempPasswordReturn,
} from '#typescript';
import { PasswordEncrypt } from 'src/utils/encrypt/password.encrypt';

const TEMP_PASSWORD_RESEND_TIME_IN_SECONDS = 60;
const TEMP_PASSWORD_EXPIRATION_TIME_IN_MS = 3 * 60 * 1000;

interface I_AuthCtr {
    handleGetUserOrThrowNotFoundError: (identityType: E_IDENTITY_TYPE, identity: string) => Promise<I_User | void>;
    handleRequestTempPassword: (args: T_HandleRequestTempPasswordArgs) => Promise<T_HandleRequestTempPasswordReturn>;
    handleChangePassword: (args: T_HandleChangePasswordArgs) => Promise<T_HandleChangePasswordReturn>;
}

export const authCtr: I_AuthCtr = {
    handleGetUserOrThrowNotFoundError: async (identityType: E_IDENTITY_TYPE, identity: string) => {
        const user = await userCtr.getUser({ [identityType]: identity });

        if (!user)
            throw new GraphQLError(`Người dùng với ${identityType} ${identity} không tồn tại`, {
                extensions: {
                    code: 404,
                },
            });

        return user;
    },
    handleRequestTempPassword: async ({ identityType, identity }) => {
        const foundUser = (await authCtr.handleGetUserOrThrowNotFoundError(identityType, identity)) as I_User;

        const foundUserVerification = await userVerificationCtr.findOne({ identity });

        if (foundUserVerification) {
            const userVerificationTimeInSeconds = foundUserVerification.createdAt.getTime() / 1000;

            if (userVerificationTimeInSeconds < TEMP_PASSWORD_RESEND_TIME_IN_SECONDS) {
                const time = userVerificationCtr.calculateTimeDifference(
                    TEMP_PASSWORD_RESEND_TIME_IN_SECONDS,
                    foundUserVerification.createdAt,
                );
                throw new GraphQLError(`Vui lòng thử lại sau ${time} giây`, {
                    extensions: {
                        code: 429,
                    },
                });
            }
        }

        const tempPassword = userVerificationCtr.generateTempPassword();
        const tempHashedPassword = await PasswordEncrypt.hashPassword(tempPassword);

        const expiresAt = new Date(Date.now() + TEMP_PASSWORD_EXPIRATION_TIME_IN_MS);
        await userVerificationCtr.createOrUpdate({
            userId: foundUser.id,
            identity,
            identityType,
            tempPassword,
            expiresAt,
        });

        await userCtr.updateOne({ id: foundUser.id }, { password: tempHashedPassword });

        const sendTempPasswordResult = userVerificationCtr.sendTempPassword(identityType, identity, tempPassword);
        if (sendTempPasswordResult !== 'success')
            throw new GraphQLError('Gửi mật khẩu tạm thất bại', {
                extensions: {
                    code: 500,
                },
            });

        return {
            message: 'Gửi mật khẩu tạm cho người dùng thành công',
            success: true,
        };
    },

    handleChangePassword: async (payload) => {
        if (payload.newPassword !== payload.confirmNewPassword)
            throw new GraphQLError('Mật khẩu mới và xác nhận không khớp', { extensions: { code: 400 } });

        const foundUser = (await authCtr.handleGetUserOrThrowNotFoundError(
            payload.identityType,
            payload.identity,
        )) as I_User;

        const isPasswordMatch = await PasswordEncrypt.comparePassword(payload.oldPassword, foundUser.password);
        if (!isPasswordMatch) throw new GraphQLError('Mật khẩu cũ không đúng', { extensions: { code: 400 } });

        const newHashedPassword = await PasswordEncrypt.hashPassword(payload.newPassword);
        await userCtr.updateOne({ [payload.identityType]: payload.identity }, { password: newHashedPassword });

        // TODO: Send email or phone to notify user about password change
        // TODO: Delete user verification document after password change if needed ( case need otp )

        return {
            message: 'Đổi mật khẩu thành công!',
            success: true,
        };
    },
};
