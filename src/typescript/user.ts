import { I_GenericDocument } from 'cyberskill';

export interface I_User extends I_GenericDocument {
    id: string;
    email: string;
    fullName: string;
    password: string;
    phone: string;
}
