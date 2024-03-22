import { T_QueryOptions } from 'cyberskill/typescript';
import { Request as RequestExpress } from 'express';
import { Session } from 'express-session';

import { I_User } from './user';

export interface I_Request extends RequestExpress {
    session: Session & {
        user: I_User | null;
    };
}

export interface I_Context {
    req: I_Request;
    SECRET: string;
}

export interface I_Input_Filters extends T_QueryOptions {
    query: JSON;
}
