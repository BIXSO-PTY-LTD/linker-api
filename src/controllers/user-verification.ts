import { FilterQuery } from 'mongoose';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

import config from '#config';
import { mongooseCtr } from '#controllers';
import { UserVerificationModel } from '#models';
import { T_SmsOptions, sendAutoSMS, sendAutoEmail } from 'src/libs';
import { E_IDENTITY_TYPE, I_UserVerification } from '#typescript';

interface I_UserVerificationCtr {
    findOne: (filter: FilterQuery<I_UserVerification>) => Promise<I_UserVerification | null>;
    createOrUpdate: (model: Partial<I_UserVerification>) => Promise<boolean>;
    generateTempPassword: () => string;
    sendTempPassword: (identityType: string, identity: string, tempPassword: string) => Promise<string>;
    calculateTimeDifference: (otpResendTime: number, createdAt: Date) => number;
}

export const userVerificationCtr: I_UserVerificationCtr = {
    findOne: async (filter: FilterQuery<I_UserVerification>) => {
        const foundResult = (await mongooseCtr.findOne(UserVerificationModel, filter)) as {
            success: boolean;
            result: I_UserVerification;
        };
        if (!foundResult.success) return null;

        return foundResult.result;
    },
    createOrUpdate: async (model: Partial<I_UserVerification>) => {
        const createOrUpdateRes = await mongooseCtr.update(
            UserVerificationModel,
            { identity: model.identity, identityType: model.identityType },
            model,
            {
                new: true,
                upsert: true,
            },
        );

        return !!createOrUpdateRes.success;
    },
    calculateTimeDifference: (otpResendTime: number, createdAt: Date) => otpResendTime - createdAt.getTime() / 1000,
    generateTempPassword: () => {
        const TEMP_PASSWORD_BASE_ON_ENV = {
            DEVELOPMENT: '12345678',
            STAGING: '12345678',
            PRODUCTION: Math.floor(1000 + Math.random() * 9000).toString(),
        };
        return TEMP_PASSWORD_BASE_ON_ENV[config.getCurrentEnvironment()];
    },
    sendTempPassword: async (identityType: string, identity: string, tempPassword: string) => {
        switch (identityType) {
            case E_IDENTITY_TYPE.PHONE: {
                const phonePayload: T_SmsOptions = {
                    to: identity,
                    body: `Mật khẩu mới của bạn là: ${tempPassword}`,
                };
                const isSendTempPasswordSuccess = await sendAutoSMS(phonePayload);
                if (!isSendTempPasswordSuccess) return 'error';
                return 'success';
            }
            case E_IDENTITY_TYPE.EMAIL: {
                const emailPayload: SendEmailRequest = {
                    Source: 'no-reply@coach-linker.vn',
                    Destination: {
                        ToAddresses: [identity],
                    },
                    ReplyToAddresses: [''],
                    Message: {
                        Body: {
                            Html: {
                                Charset: 'UTF-8',
                                Data: `Mật khẩu mới của bạn là ${tempPassword}!`,
                            },
                        },
                        Subject: {
                            Charset: 'UTF-8',
                            Data: 'Yêu cầu đổi mật khẩu!',
                        },
                    },
                };
                const isSendTempPasswordSuccess = await sendAutoEmail(emailPayload);
                if (!isSendTempPasswordSuccess) return 'error';
                return 'success';
            }
            default: {
                return 'error';
            }
        }
    },
};
