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
    const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('register');
    const [resetStep, setResetStep] = useState<'email' | 'password'>('email');
    const [resetEmail, setResetEmail] = useState('');
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
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
            setMode('login');
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

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) {
            showToast('error', 'Please enter your email or phone number');
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail);
        const isPhone = /^\d+$/.test(resetEmail);

        if (!isEmail && !isPhone) {
            showToast('error', 'Please enter a valid email or phone number');
            return;
        }

        if (isPhone && resetEmail.length !== 10) {
            showToast('error', 'Phone number must be exactly 10 digits');
            return;
        }

        const identifier = isPhone ? Number(resetEmail) : resetEmail;

        setIsLoading(true);
        try {
            await authService.verifyEmail({ identifier });
            setResetStep('password');
            showToast('success', 'Identity verified! Please enter your new password.');
        } catch (error: unknown) {
            let errorMessage = 'Verification failed';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            }
            showToast('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirmPassword) {
            showToast('error', 'Passwords do not match');
            return;
        }
        if (passwords.password.length < 4) {
            showToast('error', 'Password must be at least 4 characters');
            return;
        }
        const isPhone = /^\d+$/.test(resetEmail);
        const identifier = isPhone ? Number(resetEmail) : resetEmail;

        setIsLoading(true);
        try {
            await authService.resetPassword({
                identifier: identifier,
                password: passwords.password
            });
            showToast('success', 'Password reset successful! Please log in.');
            setMode('login');
            setResetStep('email');
            setResetEmail('');
            setPasswords({ password: '', confirmPassword: '' });
        } catch (error: unknown) {
            let errorMessage = 'Password reset failed';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
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

                {mode === 'forgot_password' ? (
                    <div className="flex flex-col gap-6 w-full max-w-md p-10 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 transition-all">
                        <div className="text-center space-y-2 mb-2">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reset Password</h2>
                            <p className="text-gray-400 text-sm font-medium">
                                {resetStep === 'email' ? 'Enter your email to verify your account.' : 'Create a new secure password.'}
                            </p>
                        </div>

                        {resetStep === 'email' ? (
                            <form onSubmit={handleVerifyEmail} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">Email or Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your email or phone"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.97] disabled:bg-gray-300"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Identity'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwords.password}
                                        onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.97] disabled:bg-gray-300"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}

                        <button
                            onClick={() => {
                                setMode('login');
                                setResetStep('email');
                            }}
                            className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : mode === 'register' ? (
                    <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                ) : (
                    <LoginForm
                        onSubmit={handleLogin}
                        isLoading={isLoading}
                        onForgotPassword={() => {
                            setMode('forgot_password');
                            setResetStep('email');
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Auth;
