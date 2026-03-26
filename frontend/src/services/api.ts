import axios from "axios";
import type { IRegisterData, ILoginData, IAuthResponse, IUser, IImage } from "../types/auth.types";
import { API_ROUTES } from "../constants/RouteConstants";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
    baseURL: `${BASE_URL}/api/`,
    withCredentials: true
});

export const authService = {
    register: async (userData: IRegisterData): Promise<IAuthResponse> => {
        const response = await api.post<IAuthResponse>(API_ROUTES.USER_REGISTER, userData);
        return response.data;
    },

    login: async (userData: ILoginData): Promise<IAuthResponse> => {
        const response = await api.post<IAuthResponse>(API_ROUTES.USER_LOGIN, userData)
        return response.data
    },
    logout: async (): Promise<IAuthResponse> => {
        const response = await api.post<IAuthResponse>(API_ROUTES.USER_LOGOUT);
        return response.data;
    },
    getMe: async (): Promise<{ user: IUser }> => {
        const response = await api.get<{ user: IUser }>(API_ROUTES.USER_ME);
        return response.data;
    },
    verifyEmail: async (data: { identifier: string | number }): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(API_ROUTES.USER_VERIFY_EMAIL, data);
        return response.data;
    },
    resetPassword: async (data: { identifier: string | number; password: string }): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(API_ROUTES.USER_RESET_PASSWORD, data);
        return response.data;
    }
};

export const imageService = {
    upload: async (formData: FormData): Promise<IImage[]> => {
        const response = await api.post<IImage[]>(API_ROUTES.IMAGES_UPLOAD, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getImages: async (): Promise<IImage[]> => {
        const response = await api.get<IImage[]>(API_ROUTES.IMAGES_BASE);
        return response.data;
    },

    update: async (imageId: string, formData: FormData): Promise<IImage> => {
        const response = await api.patch<IImage>(`${API_ROUTES.IMAGES_BASE}/${imageId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    reorder: async (updates: { imageId: string; order: number }[]): Promise<void> => {
        const response = await api.put(API_ROUTES.IMAGES_REORDER, { updates });
        return response.data;
    },

    delete: async (imageId: string): Promise<void> => {
        const response = await api.delete(`${API_ROUTES.IMAGES_BASE}/${imageId}`);
        return response.data;
    }
};


