import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm'
import { authService } from '../services/api';
import type { IRegisterData, ILoginData } from '../types/auth.types';
import axios from 'axios';
import { showToast } from '../utils/toast';
import { useAuth } from '../context/AuthContext';

const Auth: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('register');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, user, loading } = useAuth();

    React.useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleLogin = async (formData: ILoginData) => {
        setIsLoading(true);
        try {
            const response = await authService.login(formData);
            if (response.user) {
                login(response.user);
            }
            showToast('success', response.message || 'Login successful!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error: unknown) {
            let errorMessage = 'Login failed. Please try again.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showToast('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (formData: IRegisterData) => {
        setIsLoading(true);
        try {
            await authService.register(formData);
            showToast('success', 'Registration successful! You can now log in.');
        } catch (error: unknown) {
            let errorMessage = 'Registration failed. Please try again.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showToast('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 transition-all duration-500">
            <div className="w-full max-w-md">
                {/* Mode Switcher */}
                <div className="flex bg-gray-200 p-1 rounded-2xl mb-8 w-max mx-auto shadow-inner">
                    <button
                        onClick={() => setMode('login')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-white shadow-sm text-black' : 'text-gray-500'
                            }`}
                    >
                        Register
                    </button>
                </div>


                {mode === 'register' ? (
                    <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                ) : (
                    <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
};

export default Auth;
