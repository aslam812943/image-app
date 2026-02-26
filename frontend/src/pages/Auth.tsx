import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm'
import { authService } from '../services/api';
import type { IRegisterData, ILoginData } from '../types/auth.types';
import axios from 'axios';

const Auth: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('register');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (formData: ILoginData) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await authService.login(formData);
            setMessage({ type: 'success', text: response.message || 'Login successful!' });
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
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (formData: IRegisterData) => {
        setIsLoading(true);
        setMessage(null);
        try {
            await authService.register(formData);
            setMessage({ type: 'success', text: 'Registration successful! You can now log in.' });
        } catch (error: unknown) {
            let errorMessage = 'Registration failed. Please try again.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setMessage({ type: 'error', text: errorMessage });
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

                {message && (
                    <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold shadow-sm border animate-in fade-in duration-500 ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {message.text}
                    </div>
                )}

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
