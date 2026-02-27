export const AUTH_MESSAGES = {
    EMAIL_OR_PHONE_REQUIRED: 'Email or phone number is required',
    EMAIL_EXISTS: 'User with this email already exists',
    PHONE_EXISTS: 'User with this phone number already exists',
    USERNAME_TAKEN: 'Username is already taken',
    PASSWORD_REQUIRED: 'Password is required',
    REGISTER_SUCCESS: 'User registered successfully',
    REGISTER_FAILED: 'Registration failed',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGIN_FAILED: 'Login failed',
    INVALID_CREDENTIALS: 'Invalid email/phone',
    INVALID_PASSWORD: 'Invalid password',
    EMAIL_NOT_FOUND: 'Email not found',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
    PASSWORD_RESET_FAILED: 'Password reset failed',
} as const;

export const IMAGE_MESSAGES = {
    UPLOAD_SUCCESS: 'Images uploaded successfully',
    UPLOAD_FAILED: 'Failed to upload images',
    FETCH_SUCCESS: 'Images fetched successfully',
    FETCH_FAILED: 'Failed to fetch images',
    UPDATE_SUCCESS: 'Image updated successfully',
    UPDATE_FAILED: 'Failed to update image',
    DELETE_SUCCESS: 'Image deleted successfully',
    DELETE_FAILED: 'Failed to delete image',
    REORDER_SUCCESS: 'Images reordered successfully',
    REORDER_FAILED: 'Failed to reorder images',
    NOT_FOUND: 'Image not found',
    NO_FILES: 'No files uploaded',
    UPDATE_DATA_REQUIRED: 'Update data required',
    INVALID_ID: 'Invalid image ID',
} as const;

export const COMMON_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized',
    UNAUTHORIZED_NO_TOKEN: 'Unauthorized: No token provided',
    UNAUTHORIZED_INVALID_TOKEN: 'Unauthorized: Invalid token',
    SERVER_ERROR: 'Internal server error',
    LOGOUT_SUCCESS: 'Logged out successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
    VERIFICATION_FAILED: 'Verification failed',
} as const;
