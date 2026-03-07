'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { DisabilityType, PreferredMode } from '@/lib/types/api';

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterProfilePage() {
    const [formData, setFormData] = useState({
        role: 'student',
        disabilityType: 'none' as DisabilityType,
        preferredMode: 'text' as PreferredMode,
    });

    const [basicData, setBasicData] = useState<RegisterData | null>(null);
    const router = useRouter();
    const { setLoading, setError, isLoading, error, clearError } = useAuthStore();

    useEffect(() => {
        // Retrieve basic data from sessionStorage
        const stored = sessionStorage.getItem('register_basic');
        if (stored) {
            setBasicData(JSON.parse(stored));
        } else {
            // If no basic data, redirect back to first step
            router.push('/auth/register');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!basicData) {
            router.push('/auth/register');
            return;
        }

        setLoading(true);

        // Call API with all data
        const result = await registerUser({
            name: basicData.fullName,
            email: basicData.email,
            password: basicData.password,
            role: formData.role === 'student' ? 'student' : 'lecturer',
            disability_type: formData.disabilityType,
            preferred_mode: formData.preferredMode,
        });

        if (result.success) {
            // Clear session storage and redirect to login
            sessionStorage.removeItem('register_basic');
            router.push('/auth/login?registered=true');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleBack = () => {
        router.push('/auth/register');
    };

    if (!basicData) {
        return null;
    }

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
                        <span className="material-symbols-outlined text-5xl text-[#4a148c]">person</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6">Complete Your Profile</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Tell us a bit about yourself to personalize your learning experience.
                    </p>

                    {/* Progress Steps */}
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#f9f506] text-[#4a148c] flex items-center justify-center font-bold text-sm">✓</div>
                            <span className="text-sm text-white/70">Basic Info</span>
                        </div>
                        <div className="w-12 h-0.5 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#f9f506] text-[#4a148c] flex items-center justify-center font-bold text-sm">2</div>
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
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                                <span className="text-sm text-green-600 font-medium">Basic Info</span>
                            </div>
                            <div className="w-8 h-0.5 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#4a148c] text-white flex items-center justify-center font-bold text-sm">2</div>
                                <span className="text-sm text-[#4a148c] font-medium">Profile</span>
                            </div>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-[#4a148c] rounded-full"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-[#181811] mb-3">
                        Complete Profile
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Step 2 of 2 - Customize your experience
                    </p>

                    {/* User Info Summary */}
                    <div className="mb-6 p-4 bg-[#f8f8f5] rounded-2xl border-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#4a148c]">person</span>
                            </div>
                            <div>
                                <p className="font-bold text-[#181811]">{basicData.fullName}</p>
                                <p className="text-sm text-gray-500">{basicData.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleBack}
                                className="ml-auto text-sm text-[#4a148c] hover:underline"
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                            <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                Accessibility Profile <span className="text-gray-400 font-normal">(Optional)</span>
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
                            <p className="text-xs text-gray-500 mt-1">This helps us customize your experience</p>
                        </div>

                        {/* Preferred Mode */}
                        <div>
                            <label
                                htmlFor="preferredMode"
                                className="block text-sm font-bold text-[#181811] mb-2"
                            >
                                Preferred Learning Mode
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
                                    <span className="material-symbols-outlined">check</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-[#181811] transition-colors w-full"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span className="text-sm font-medium">Back to Basic Info</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
