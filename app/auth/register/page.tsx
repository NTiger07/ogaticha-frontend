'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { DisabilityType, PreferredMode } from '@/lib/types/api';

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ProfileData {
    role: string;
    disabilityType: DisabilityType;
    preferredMode: PreferredMode;
}

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<RegisterData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [profileData, setProfileData] = useState<ProfileData>({
        role: 'student',
        disabilityType: 'none',
        preferredMode: 'text',
    });

    const [localError, setLocalError] = useState('');
    const router = useRouter();
    const { setLoading, setError, isLoading, error, clearError } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handleStep1Submit = (e: React.FormEvent) => {
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

        // Move to step 2
        setStep(2);
    };

    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        setLoading(true);

        // Call API with all data
        const result = await registerUser({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: profileData.role === 'student' ? 'student' : 'lecturer',
            disability_type: profileData.disabilityType,
            preferred_mode: profileData.preferredMode,
        });

        if (result.success) {
            // Redirect to login after successful registration
            router.push('/auth/login?registered=true');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleBack = () => {
        setStep(1);
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
                        <span className="material-symbols-outlined text-5xl text-[#4a148c]">
                            {step === 1 ? 'school' : 'person'}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6">
                        {step === 1 ? 'Join OgaTicha Today' : 'Complete Your Profile'}
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        {step === 1
                            ? 'Create your account and unlock accessible learning for everyone.'
                            : 'Tell us a bit about yourself to personalize your learning experience.'
                        }
                    </p>

                    {/* Progress Steps */}
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#f9f506] text-[#4a148c]' : 'bg-white/20 text-white'} flex items-center justify-center font-bold text-sm`}>
                                {step > 1 ? '✓' : '1'}
                            </div>
                            <span className="text-sm text-white/70">Basic Info</span>
                        </div>
                        <div className="w-12 h-0.5 bg-white/20"></div>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#f9f506] text-[#4a148c]' : 'bg-white/20 text-white'} flex items-center justify-center font-bold text-sm`}>
                                2
                            </div>
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
                                <div className={`w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#4a148c] text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-bold text-sm`}>
                                    {step > 1 ? '✓' : '1'}
                                </div>
                                <span className={`text-sm font-medium ${step >= 1 ? 'text-[#4a148c]' : 'text-gray-500'}`}>Basic Info</span>
                            </div>
                            <div className="w-8 h-0.5 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#4a148c] text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-bold text-sm`}>
                                    2
                                </div>
                                <span className={`text-sm font-medium ${step >= 2 ? 'text-[#4a148c]' : 'text-gray-500'}`}>Profile</span>
                            </div>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${step >= 2 ? 'w-full' : 'w-1/2'} bg-[#4a148c] rounded-full transition-all duration-300`}></div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-[#181811] mb-3">
                        {step === 1 ? 'Create Account' : 'Complete Profile'}
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Step {step} of 2 - {step === 1 ? "Let's get started" : "Customize your experience"}
                    </p>

                    {/* User Info Summary - Step 2 */}
                    {step === 2 && (
                        <div className="mb-6 p-4 bg-[#f8f8f5] rounded-2xl border-2 border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#4a148c]">person</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[#181811]">{formData.fullName}</p>
                                    <p className="text-sm text-gray-500">{formData.email}</p>
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
                    )}

                    {/* Error Message */}
                    {(localError || error) && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                            <p className="text-sm text-red-600 text-center font-medium">{localError || error}</p>
                        </div>
                    )}

                    {/* Step 1 Form */}
                    {step === 1 && (
                        <form onSubmit={handleStep1Submit} className="space-y-5">
                            {/* Full Name Input */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-bold text-[#181811] mb-2">
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
                                <label htmlFor="email" className="block text-sm font-bold text-[#181811] mb-2">
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
                                <label htmlFor="password" className="block text-sm font-bold text-[#181811] mb-2">
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
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-[#181811] mb-2">
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
                                className="w-full py-4 bg-[#4a148c] hover:bg-[#3a0f6d] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
                            >
                                <span>Continue</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </form>
                    )}

                    {/* Step 2 Form */}
                    {step === 2 && (
                        <form onSubmit={handleStep2Submit} className="space-y-5">
                            {/* Account Type */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-bold text-[#181811] mb-2">
                                    Account Type
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={profileData.role}
                                    onChange={handleProfileChange}
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                                >
                                    <option value="student">Student</option>
                                    <option value="lecturer">Lecturer</option>
                                    <option value="companion">Companion</option>
                                </select>
                            </div>

                            {/* Disability Type */}
                            <div>
                                <label htmlFor="disabilityType" className="block text-sm font-bold text-[#181811] mb-2">
                                    Accessibility Profile <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <select
                                    id="disabilityType"
                                    name="disabilityType"
                                    value={profileData.disabilityType}
                                    onChange={handleProfileChange}
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                                >
                                    <option value="none">None</option>
                                    <option value="visual">Visual Impairment</option>
                                    <option value="hearing">Hearing Impairment</option>
                                </select>
                            </div>

                            {/* Preferred Mode */}
                            <div>
                                <label htmlFor="preferredMode" className="block text-sm font-bold text-[#181811] mb-2">
                                    Preferred Learning Mode
                                </label>
                                <select
                                    id="preferredMode"
                                    name="preferredMode"
                                    value={profileData.preferredMode}
                                    onChange={handleProfileChange}
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

                            {/* Back Button */}
                            <button
                                type="button"
                                onClick={handleBack}
                                className="mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-[#181811] transition-colors w-full"
                            >
                                <span className="material-symbols-outlined text-xl">arrow_back</span>
                                <span className="text-sm font-medium">Back to Basic Info</span>
                            </button>
                        </form>
                    )}

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-bold text-[#4a148c] hover:text-[#f9f506] transition-colors">
                            Sign In
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-[#181811] transition-colors">
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
