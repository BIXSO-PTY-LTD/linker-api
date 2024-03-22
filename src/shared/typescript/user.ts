import { I_GenericDocument, T_PopulateOptions } from 'cyberskill/typescript';

export interface I_User extends I_GenericDocument {
    email: string;
    fullName: string;
    password: string;
    phone?: string;
}

export interface I_Input_Get_User {
    user: {
        id: string;
        populate?: T_PopulateOptions;
    };
}

export interface I_Input_Create_User {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}

export interface I_Input_Update_User {
    id: string;
    fullName: string;
    phone: string;
}

export interface I_Input_Delete_User {
    id: string;
}
