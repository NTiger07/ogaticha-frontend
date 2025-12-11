'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic
        console.log('Login:', { email, password });
    };

    return (
        <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#23220f] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-[#1a1a0b] rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-[#33331a]">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#f9f506] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-[#181811]">school</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-[#181811] dark:text-white mb-2">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                    Sign in to continue learning
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-[#181811] dark:text-white mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-[#33331a] bg-[#f8f8f5] dark:bg-[#2c2c15] text-[#181811] dark:text-white focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-bold text-[#181811] dark:text-white mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-[#33331a] bg-[#f8f8f5] dark:bg-[#2c2c15] text-[#181811] dark:text-white focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                        className="w-full py-4 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <span>Sign In</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-[#33331a]"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-[#33331a]"></div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <button className="w-full py-3 px-4 bg-white dark:bg-[#2c2c15] hover:bg-gray-50 dark:hover:bg-[#3a3a1a] border-2 border-gray-300 dark:border-[#33331a] rounded-full font-semibold text-[#181811] dark:text-white transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined">account_circle</span>
                        Continue with Google
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
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
                    className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#181811] dark:hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>
        </div>
    );
}
