import { I_GenericDocument } from 'cyberskill';

export enum E_IDENTITY_TYPE {
    EMAIL = 'email',
    PHONE = 'phone',
}

export interface I_UserVerification extends I_GenericDocument {
    identity: string;
    identityType: E_IDENTITY_TYPE;
    userId: string;
    tempPassword: string;
    expiresAt: Date;
    hitCount: number;
    isTempBlocked: boolean;
    tempBlockTime?: Date;
}
