export interface IPasswordResetService {
    verifyIdentity(emailOrPhone: string | number): Promise<boolean>;
    resetPassword(emailOrPhone: string | number, password: string): Promise<boolean>;
}
