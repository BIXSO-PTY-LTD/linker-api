import { E_IDENTITY_TYPE } from '#typescript';

export type T_HandleRequestTempPasswordArgs = { identityType: E_IDENTITY_TYPE; identity: string };
export type T_HandleChangePasswordArgs = {
    identity: string;
    identityType: E_IDENTITY_TYPE;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

export type T_HandleRequestTempPasswordReturn = { message: string; success: boolean };
export type T_HandleChangePasswordReturn = { message: string; success: boolean };
