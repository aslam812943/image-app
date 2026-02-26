import React, { useState } from 'react';
import type { IRegisterData } from '../../types/auth.types';

interface RegisterFormProps {
    onSubmit: (data: IRegisterData) => Promise<void>;
    isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        username: '',
        identifier: '', // Email or Phone
        password: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof IRegisterData | 'identifier', string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof IRegisterData | 'identifier']) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof IRegisterData | 'identifier'];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const newErrors: Partial<Record<keyof IRegisterData | 'identifier', string>> = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.identifier) newErrors.identifier = 'Email or Phone is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Determine if identifier is email or phone
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
        const isPhone = /^\d+$/.test(formData.identifier);

        if (!isEmail && !isPhone) {
            setErrors({ identifier: 'Please enter a valid email or phone number' });
            return;
        }

        const payload: IRegisterData = {
            username: formData.username,
            password: formData.password,
            email: isEmail ? formData.identifier : undefined,
            phone: isPhone ? Number(formData.identifier) : undefined,
        };

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md p-10 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 transition-all">
            <div className="text-center space-y-2 mb-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
                <p className="text-gray-400 text-sm font-medium">Join our community in seconds.</p>
            </div>

            {/* Username Field */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">Username</label>
                <input
                    name="username"
                    type="text"
                    placeholder="antigravity_dev"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-4 transition-all outline-none font-medium ${errors.username ? 'border-red-200 focus:ring-red-50' : 'border-gray-100 focus:ring-blue-50 focus:border-blue-200'
                        }`}
                />
                {errors.username && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.username}</p>}
            </div>

            {/* Identifier Field (Email or Phone) */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">Email or Phone Number</label>
                <input
                    name="identifier"
                    type="text"
                    placeholder="hello@world.com or 10-digit number"
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
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.97] disabled:bg-gray-300 disabled:shadow-none translate-y-0 hover:-translate-y-1"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                    </div>
                ) : 'Get Started'}
            </button>

            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-300 font-bold tracking-widest">Or</span></div>
            </div>

            <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                Have an account? <span className="text-indigo-600 cursor-pointer hover:underline">Log In</span>
            </p>
        </form>
    );
};

export default RegisterForm;
