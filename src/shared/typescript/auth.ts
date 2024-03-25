import { I_GenericDocument } from 'cyberskill/typescript';

export interface I_Input_CheckAuth {
    token: string;
}

export interface I_Input_CheckToken {
    token: string;
}

export interface I_Input_GenerateToken {
    id?: string;
}

export interface I_Input_Login {
    identity: string;
    password: string;
    rememberMe?: boolean;
}

export interface I_Input_Register {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export enum E_IdentityType {
    EMAIL = 'email',
    PHONE = 'phone',
}

export interface I_Input_RequestPasswordReset {
    identityType: E_IdentityType;
    identity: string;
}

export interface I_Input_ChangePassword {
    identity: string;
    identityType: E_IdentityType;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface I_Response_Auth {
    success: boolean;
    message?: string;
    token?: string;
}
