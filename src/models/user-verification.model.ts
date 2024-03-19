import mongoose from 'mongoose';

import { generateModel } from 'cyberskill/utils/mongoose';
import { E_IDENTITY_TYPE, I_UserVerification } from 'src/typescript';
import config from '#config';

export const UserVerificationModel = generateModel({
    mongoose,
    name: config.DATABASE_COLLECTIONS.USER_VERIFICATION,
    schema: new mongoose.Schema<I_UserVerification>({
        identity: {
            type: String,
            required: true,
            maxlength: 255,
        },
        identityType: {
            type: String,
            enum: Object.values(E_IDENTITY_TYPE),
            required: true,
        },
        userId: {
            type: String,
            ref: 'User',
            required: true,
        },
        hitCount: {
            type: Number,
            required: true,
            default: 0,
        },
        isTempBlocked: {
            type: Boolean,
            required: true,
            default: false,
        },
        tempBlockTime: Date,
    }),
});
