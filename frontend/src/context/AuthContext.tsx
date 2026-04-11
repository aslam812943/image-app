import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/api';
import type { IUser } from '../types/auth.types';
import { showToast } from '../utils/toast';

interface AuthContextType {
    user: IUser | null;
    loading: boolean;
    login: (user: IUser) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authService.getMe();
                setUser(response.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData: IUser) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch {
            showToast('error', 'Login failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
