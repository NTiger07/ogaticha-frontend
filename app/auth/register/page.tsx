'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const [localError, setLocalError] = useState('');
    const router = useRouter();
    const { isLoading } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match!');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters!');
            return;
        }

        // Store data in sessionStorage and navigate to profile page
        sessionStorage.setItem('register_basic', JSON.stringify(formData));
        router.push('/auth/register/profile');
    };

    return (
        <div className="min-h-screen bg-[#f8f8f5] flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#4a148c] relative overflow-hidden items-center justify-center p-12">
                {/* Decorative Blobs */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-[#f9f506]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#f9f506]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f9f506]/5 rounded-full blur-2xl" />
                
                <div className="relative z-10 text-center text-white max-w-md">
                    <div className="w-24 h-24 bg-[#f9f506] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <span className="material-symbols-outlined text-5xl text-[#4a148c]">school</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6">Join OgaTicha Today</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Create your account and unlock accessible learning for everyone.
                    </p>
                    
                    {/* Progress Steps */}
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#f9f506] text-[#4a148c] flex items-center justify-center font-bold text-sm">1</div>
                            <span className="text-sm text-white/70">Basic Info</span>
                        </div>
                        <div className="w-12 h-0.5 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm">2</div>
                            <span className="text-sm text-white/70">Profile</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 bg-[#f9f506] rounded-full flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-4xl text-[#181811]">school</span>
                        </div>
                    </div>

                    {/* Progress Bar - Mobile */}
                    <div className="lg:hidden mb-8">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#4a148c] text-white flex items-center justify-center font-bold text-sm">1</div>
                                <span className="text-sm text-[#4a148c] font-medium">Basic Info</span>
                            </div>
                            <div className="w-8 h-0.5 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
                                <span className="text-sm text-gray-500">Profile</span>
                            </div>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-[#4a148c] rounded-full"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-[#181811] mb-3">
                        Create Account
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Step 1 of 2 - Let's get started
                    </p>

                    {/* Error Message */}
                    {localError && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                            <p className="text-sm text-red-600 text-center font-medium">{localError}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name Input */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#4a148c] hover:bg-[#3a0f6d] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span>Please wait...</span>
                                </>
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="font-bold text-[#4a148c] hover:text-[#f9f506] transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <Link
                        href="/"
                        className="mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-[#181811] transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
