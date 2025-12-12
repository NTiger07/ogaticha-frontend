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
            role: formData.role === 'student' ? 'student' : 'teacher',
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
                    Create Account
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Join OgaTicha and start learning
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
                        >
                            <option value="student">Student (default)</option>
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
                            Accessibility Profile (Optional)
                        </label>
                        <select
                            id="disabilityType"
                            name="disabilityType"
                            value={formData.disabilityType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">refresh</span>
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
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <button className="w-full py-3 px-4 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-full font-semibold text-[#181811] transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined">account_circle</span>
                        Sign up with Google
                    </button>
                </div>

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
                    className="mt-4 flex items-center justify-center gap-2 text-gray-600 hover:text-[#181811] transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>
        </div>
    );
}
