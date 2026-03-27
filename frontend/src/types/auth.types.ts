export interface IUser {
    userId: string;
    username: string;
    email?: string;
    phone?: number;
    createdAt?: string;
}

export interface IImage {
    imageId: string;
    userId: string;
    title: string;
    imageUrl: string;
    order: number;
    createdAt: string;
    updatedAt?: string;
}

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
    user?: IUser;
}

export interface IVerifyEmailRequest {
    email: string;
}

export interface IResetPasswordRequest {
    email: string;
    password: string;
}

export interface IResetPasswordResponse {
    message: string;
}
