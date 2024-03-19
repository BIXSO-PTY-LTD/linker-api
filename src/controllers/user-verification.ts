import { FilterQuery } from 'mongoose';
import config from '#config';

import { E_IDENTITY_TYPE, I_UserVerification } from '#typescript';
import { mongooseCtr } from '#controllers';
import { UserVerificationModel } from '#models';

interface I_UserVerificationCtr {
    findOne: (filter: FilterQuery<I_UserVerification>) => Promise<I_UserVerification | null>;
    createOrUpdate: (model: Partial<I_UserVerification>) => Promise<boolean>;
    generateTempPassword: () => string;
    sendTempPassword(identityType: string, identity: string, tempPassword: string): string;
    calculateTimeDifference(otpResendTime: number, createdAt: Date): number;
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
    sendTempPassword: (identityType: string, identity: string, tempPassword: string) => {
        switch (identityType) {
            case E_IDENTITY_TYPE.PHONE: {
                const phonePayload = {};
                // TODO: Implement send phone service here
                return 'success';
            }
            case E_IDENTITY_TYPE.EMAIL: {
                const emailPayload = {
                    to: identity,
                    subject: 'Temp password for password reset',
                    text: `Your temp password is ${tempPassword}`,
                    from: '', // TODO: Implement email sender service here
                };
                // TODO: Implement send email service here
                return 'success';
            }
            default: {
                return 'error';
            }
        }
    },
};
