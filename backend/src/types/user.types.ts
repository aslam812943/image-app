export interface IUser {
    _id?: string;
    userId?: string;
    username: string;
    email?: string;
    phone?: number;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
