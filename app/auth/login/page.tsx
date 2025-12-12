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
        <div className="min-h-screen bg-[#f8f8f5] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#f9f506] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-[#181811]">school</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-[#181811] mb-2">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Sign in to continue learning
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                        className="w-full py-4 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <button className="w-full py-3 px-4 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-full font-semibold text-[#181811] transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined">account_circle</span>
                        Continue with Google
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-gray-600">
                    Don&apos;t have an account?{' '}
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
                    className="mt-4 flex items-center justify-center gap-2 text-gray-600 hover:text-[#181811] transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>
        </div>
    );
}
