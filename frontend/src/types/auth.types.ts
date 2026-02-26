export interface IRegisterData {
    username: string;
    email?: string;
    phone?: number;
    password: string;
}

export interface ILoginData {
    identifier: string;
    password: string;
    email?: string;
    phone?: number;
}

export interface IAuthResponse {
    message: string;
    user?: {
        id: string;
        username: string;
        email?: string;
        phone?: number;
        createdAt?: string;
    };
}
