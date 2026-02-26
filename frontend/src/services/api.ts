import axios from "axios";
import type { IRegisterData,ILoginData, IAuthResponse } from "../types/auth.types";
import { API_ROUTES } from "../constants/RouteConstants";

export const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    withCredentials: true
});

export const authService = {
    register: async (userData: IRegisterData): Promise<IAuthResponse> => {
        const response = await api.post<IAuthResponse>(API_ROUTES.USER_REGISTER, userData);
        return response.data;
    },

    login:async(userData:ILoginData):Promise<IAuthResponse>=>{
        const response = await api.post<IAuthResponse>(API_ROUTES.USER_LOGIN,userData)
        return response.data
    }
};


