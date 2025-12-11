'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle registration logic
        console.log('Register:', formData);
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
                    Create Account
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                    Join OgaTicha and start learning
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name Input */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-bold text-[#181811] dark:text-white mb-2"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-[#33331a] bg-[#f8f8f5] dark:bg-[#2c2c15] text-[#181811] dark:text-white focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-[#33331a] bg-[#f8f8f5] dark:bg-[#2c2c15] text-[#181811] dark:text-white focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-bold text-[#181811] dark:text-white mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-[#33331a] bg-[#f8f8f5] dark:bg-[#2c2c15] text-[#181811] dark:text-white focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-6"
                    >
                        <span>Create Account</span>
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
                        Sign up with Google
                    </button>
                </div>

                {/* Sign In Link */}
                <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
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
                    className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#181811] dark:hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>
        </div>
    );
}
