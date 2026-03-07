'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { loginUser } from '@/lib/api/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const { setUser, setLoading, setError, isLoading, error, clearError } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setLoading(true);

        const result = await loginUser({ email, password });

        if (result.success) {
            setUser(result.data.user);
            router.push('/classroom');
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
                <div className="absolute top-20 left-20 w-64 h-64 bg-[#f9f506]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#f9f506]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f9f506]/5 rounded-full blur-2xl" />

                <div className="relative z-10 text-center text-white max-w-md">
                    <div className="w-24 h-24 bg-[#f9f506] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <span className="material-symbols-outlined text-5xl text-[#4a148c]">school</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6">Welcome Back to OgaTicha</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Continue your accessible learning journey. Sign in to access your classroom, AI tutor, and personalized accessibility settings.
                    </p>

                    {/* Feature Highlights */}
                    <div className="mt-12 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <span className="material-symbols-outlined text-2xl text-[#f9f506]">menu_book</span>
                            <p className="text-xs mt-2 text-white/70">Classroom</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <span className="material-symbols-outlined text-2xl text-[#f9f506]">record_voice_over</span>
                            <p className="text-xs mt-2 text-white/70">AI Tutor</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <span className="material-symbols-outlined text-2xl text-[#f9f506]">settings_accessibility</span>
                            <p className="text-xs mt-2 text-white/70">Accessibility</p>
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
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Sign in to continue your learning journey
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                            <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm font-semibold text-[#4a148c] hover:text-[#f9f506] transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#4a148c] hover:bg-[#3a0f6d] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
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
                        Continue with Google
                    </button>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            href="/auth/register"
                            className="font-bold text-[#4a148c] hover:text-[#f9f506] transition-colors"
                        >
                            Sign Up
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
