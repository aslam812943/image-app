export interface IPasswordResetService {
    verifyIdentity(identifier: string | number): Promise<boolean>;
    resetPassword(identifier: string | number, password: string): Promise<boolean>;
}
