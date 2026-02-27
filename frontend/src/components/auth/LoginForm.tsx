import React, { useState } from "react";
import type { ILoginData } from "../../types/auth.types";

interface LoginFormProps {
    onSubmit: (data: ILoginData) => Promise<void>;
    onForgotPassword: () => void;
    isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onForgotPassword, isLoading }) => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ILoginData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof ILoginData]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof ILoginData];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Partial<Record<keyof ILoginData, string>> = {};
        if (!formData.identifier) newErrors.identifier = 'Email or Phone is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md p-10 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 transition-all">
            <div className="text-center space-y-2 mb-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
                <p className="text-gray-400 text-sm font-medium">Please enter your details to sign in.</p>
            </div>

            {/* Identifier Field */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">Email or Phone</label>
                <input
                    name="identifier"
                    type="text"
                    placeholder="Enter your email or phone"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-4 transition-all outline-none font-medium ${errors.identifier ? 'border-red-200 focus:ring-red-50' : 'border-gray-100 focus:ring-blue-50 focus:border-blue-200'
                        }`}
                />
                {errors.identifier && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.identifier}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-4 transition-all outline-none font-medium ${errors.password ? 'border-red-200 focus:ring-red-50' : 'border-gray-100 focus:ring-blue-50 focus:border-blue-200'
                        }`}
                />
                {errors.password && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.password}</p>}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-[11px] text-indigo-600 font-bold hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.97] disabled:bg-gray-300 disabled:shadow-none translate-y-0 hover:-translate-y-1"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing In...</span>
                    </div>
                ) : 'Log In'}
            </button>




        </form>
    );
};

export default LoginForm;
