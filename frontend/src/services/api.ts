import axios from "axios";
import type { IRegisterData, ILoginData, IAuthResponse } from "../types/auth.types";
import { API_ROUTES } from "../constants/RouteConstants";

export const BASE_URL = "http://localhost:5000";

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
    getMe: async (): Promise<{ user: any }> => {
        const response = await api.get<{ user: any }>(API_ROUTES.USER_ME);
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
    upload: async (formData: FormData) => {
        const response = await api.post('images/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getImages: async () => {
        const response = await api.get('images');
        return response.data;
    },

    update: async (id: string, formData: FormData) => {
        const response = await api.patch(`images/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    reorder: async (updates: { id: string; order: number }[]) => {
        const response = await api.put('images/reorder', { updates });
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`images/${id}`);
        return response.data;
    }
};


