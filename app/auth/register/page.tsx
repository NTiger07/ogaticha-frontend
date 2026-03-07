'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { DisabilityType, PreferredMode } from '@/lib/types/api';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student', // default role
        disabilityType: 'none' as DisabilityType,
        preferredMode: 'text' as PreferredMode,
    });

    const { setLoading, setError, isLoading, error, clearError } = useAuthStore();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);

        // Call API
        const result = await registerUser({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: formData.role === 'student' ? 'student' : 'lecturer',
            disability_type: formData.disabilityType,
            preferred_mode: formData.preferredMode,
        });

        if (result.success) {
            // Redirect to login after successful registration
            router.push('/auth/login?registered=true');
        } else {
            setError(result.error);
        }

        setLoading(false);
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
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                        Create an account and unlock accessible learning for everyone. Join thousands of students and educators.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-black text-[#f9f506]">12K+</p>
                            <p className="text-xs text-white/60 mt-1">Students</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-[#f9f506]">85K+</p>
                            <p className="text-xs text-white/60 mt-1">Materials</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-[#f9f506]">250K+</p>
                            <p className="text-xs text-white/60 mt-1">AI Hours</p>
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

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-[#181811] mb-3">
                        Create Account
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Start your accessible learning journey
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                            <p className="text-sm text-red-600 text-center font-medium">{error}</p>
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

                        {/* Account Type (Role) */}
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Account Type
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                            >
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                                <option value="companion">Companion</option>
                            </select>
                        </div>

                        {/* Disability Type */}
                        <div>
                            <label
                                htmlFor="disabilityType"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Accessibility Profile
                            </label>
                            <select
                                id="disabilityType"
                                name="disabilityType"
                                value={formData.disabilityType}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                            >
                                <option value="none">None</option>
                                <option value="visual">Visual Impairment</option>
                                <option value="hearing">Hearing Impairment</option>
                            </select>
                        </div>

                        {/* Preferred Mode */}
                        <div>
                            <label
                                htmlFor="preferredMode"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Preferred Mode
                            </label>
                            <select
                                id="preferredMode"
                                name="preferredMode"
                                value={formData.preferredMode}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                            >
                                <option value="text">Text</option>
                                <option value="audio">Audio</option>
                                <option value="visual">Visual</option>
                            </select>
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
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-sm text-gray-500 font-medium">or continue with</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Social Login */}
                    <button className="w-full py-4 px-4 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-[#181811] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </button>

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
