'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { DisabilityType, PreferredMode } from '@/lib/types/api';

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { setLoading, setError, isLoading, error, clearError } = useAuthStore();
    
    const [formData, setFormData] = useState<RegisterData | null>(null);
    const [profileData, setProfileData] = useState({
        role: 'student',
        disabilityType: 'none' as DisabilityType,
        preferredMode: 'text' as PreferredMode,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('registerData');
            if (stored) {
                try {
                    setFormData(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse registration data", e);
                    router.push('/auth/register');
                }
            } else {
                router.push('/auth/register');
            }
        }
    }, [router]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        clearError();
        setLoading(true);

        const result = await registerUser({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: profileData.role === 'student' ? 'student' : 'lecturer',
            disability_type: profileData.disabilityType,
            preferred_mode: profileData.preferredMode,
        });

        if (result.success) {
            sessionStorage.removeItem('registerData');
            router.push('/auth/login?registered=true');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    if (!formData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f8f5]">
                <div className="animate-spin material-symbols-outlined text-4xl text-[#4a148c]">progress_activity</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f8f5] flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#4a148c] relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-20 right-20 w-64 h-64 bg-[#f9f506]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#f9f506]/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 text-center text-white max-w-md">
                    <div className="w-24 h-24 bg-[#f9f506] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <span className="material-symbols-outlined text-5xl text-[#4a148c]">person</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6">Complete Your Profile</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Tell us a bit about yourself to personalize your learning experience and accessibility settings.
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#f9f506] text-[#4a148c] flex items-center justify-center font-bold text-sm">✓</div>
                            <span className="text-sm text-white/70">Basic Info</span>
                        </div>
                        <div className="w-12 h-0.5 bg-[#f9f506]"></div>
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
                    <h1 className="text-4xl font-bold text-[#181811] mb-3">Customization</h1>
                    <p className="text-gray-600 mb-8 text-lg">Help us tailor OgaTicha to your needs.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                            <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="role" className="block text-sm font-bold text-[#181811] mb-2">Account Type</label>
                            <select
                                id="role"
                                name="role"
                                value={profileData.role}
                                onChange={handleProfileChange}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-[#181811] focus:border-[#4a148c] focus:ring-4 focus:ring-[#4a148c]/10 outline-none transition-all shadow-sm"
                            >
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="disabilityType" className="block text-sm font-bold text-[#181811] mb-2">Accessibility Profile</label>
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

                        <div>
                            <label htmlFor="preferredMode" className="block text-sm font-bold text-[#181811] mb-2">Preferred Learning Mode</label>
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#4a148c] hover:bg-[#3a0f6d] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span>Finalizing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="material-symbols-outlined">check</span>
                                </>
                            )}
                        </button>

                        <Link href="/auth/register" className="mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-[#181811] transition-colors w-full">
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                            <span className="text-sm font-medium">Back to Basic Info</span>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
