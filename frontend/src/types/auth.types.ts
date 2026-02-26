export interface IRegisterData {
    username: string;
    email?: string;
    phone?: number;
    password: string;
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
