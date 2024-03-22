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
    },
};
