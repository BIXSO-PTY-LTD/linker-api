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
    identify: string;
    password: string;
    rememberMe?: boolean;
}

export interface I_Input_Register {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}
