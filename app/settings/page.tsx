'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

export default function SettingsPage() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        voiceMode: false,
        fontSize: 'medium',
        highContrast: false,
    });

    const handleToggle = (setting: keyof typeof settings) => {
        setSettings({ ...settings, [setting]: !settings[setting] });
    };

    const handleFontSizeChange = (size: string) => {
        setSettings({ ...settings, fontSize: size });
    };

    return (
        <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#23220f]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

            <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-20 lg:pb-8 transition-all duration-300`}>
                <header className="bg-[#4a148c] px-4 lg:px-8 py-6 lg:py-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <Link href="/" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors lg:hidden">
                                <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
                            </Link>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">Settings</h1>
                                <p className="hidden lg:block text-white/80 mt-1">Customize your OgaTicha experience</p>
                            </div>
                        </div>
                        
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Profile Section */}
                        <section className="lg:col-span-2">
                            <h2 className="text-xl lg:text-2xl font-bold text-[#181811] dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">person</span>
                                Profile
                            </h2>
                            <div className="bg-white dark:bg-[#1a1a0b] rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 lg:gap-6 border border-gray-200 dark:border-[#33331a]">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-[#f9f506] rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl lg:text-5xl text-[#181811]">person</span>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-xl lg:text-2xl text-[#181811] dark:text-white">Guest User</h3>
                                    <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">guest@ogaticha.com</p>
                                </div>
                                <button className="px-6 py-2.5 lg:px-8 lg:py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-colors text-base lg:text-lg">
                                    Edit Profile
                                </button>
                            </div>
                        </section>

                        {/* Appearance Section */}
                        <section>
                            <h2 className="text-xl lg:text-2xl font-bold text-[#181811] dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">palette</span>
                                Appearance
                            </h2>
                            <div className="space-y-3 lg:space-y-4">
                                {[
                                    { key: 'darkMode', icon: 'dark_mode', title: 'Dark Mode', desc: 'Enable dark theme' },
                                    { key: 'highContrast', icon: 'contrast', title: 'High Contrast', desc: 'Increase color contrast' }
                                ].map((item) => (
                                    <div key={item.key} className="bg-white dark:bg-[#1a1a0b] rounded-xl p-4 lg:p-6 flex items-center justify-between border border-gray-200 dark:border-[#33331a]">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-2xl lg:text-3xl">{item.icon}</span>
                                            <div>
                                                <h3 className="font-bold text-base lg:text-lg text-[#181811] dark:text-white">{item.title}</h3>
                                                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(item.key as keyof typeof settings)}
                                            className={`w-14 h-8 lg:w-16 lg:h-9 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? 'bg-[#f9f506]' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-6 h-6 lg:w-7 lg:h-7 bg-white rounded-full shadow-md transform transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-7 lg:translate-x-8' : 'translate-x-1'}`}></div>
                                        </button>
                                    </div>
                                ))}

                                <div className="bg-white dark:bg-[#1a1a0b] rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-[#33331a]">
                                    <div className="flex items-center gap-3 lg:gap-4 mb-4">
                                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-2xl lg:text-3xl">text_fields</span>
                                        <h3 className="font-bold text-base lg:text-lg text-[#181811] dark:text-white">Font Size</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 lg:gap-3">
                                        {['small', 'medium', 'large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => handleFontSizeChange(size)}
                                                className={`py-2.5 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all ${settings.fontSize === size ? 'bg-[#f9f506] text-[#181811]' : 'bg-gray-100 dark:bg-[#2c2c15] text-gray-600 dark:text-gray-400'}`}
                                            >
                                                {size.charAt(0).toUpperCase() + size.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Accessibility Section */}
                        <section>
                            <h2 className="text-xl lg:text-2xl font-bold text-[#181811] dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">accessibility</span>
                                Accessibility
                            </h2>
                            <div className="space-y-3 lg:space-y-4">
                                {[
                                    { key: 'voiceMode', icon: 'mic', title: 'Voice Mode', desc: 'Enable voice interactions' },
                                    { key: 'notifications', icon: 'notifications', title: 'Notifications', desc: 'Enable push notifications' }
                                ].map((item) => (
                                    <div key={item.key} className="bg-white dark:bg-[#1a1a0b] rounded-xl p-4 lg:p-6 flex items-center justify-between border border-gray-200 dark:border-[#33331a]">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-2xl lg:text-3xl">{item.icon}</span>
                                            <div>
                                                <h3 className="font-bold text-base lg:text-lg text-[#181811] dark:text-white">{item.title}</h3>
                                                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(item.key as keyof typeof settings)}
                                            className={`w-14 h-8 lg:w-16 lg:h-9 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? 'bg-[#f9f506]' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-6 h-6 lg:w-7 lg:h-7 bg-white rounded-full shadow-md transform transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-7 lg:translate-x-8' : 'translate-x-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Account Actions */}
                        <section className="lg:col-span-2">
                            <h2 className="text-xl lg:text-2xl font-bold text-[#181811] dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">manage_accounts</span>
                                Account
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                <Link href="/auth/login" className="bg-white dark:bg-[#1a1a0b] hover:bg-[#f9f506]/10 dark:hover:bg-[#f9f506]/10 rounded-xl p-6 transition-all border border-gray-200 dark:border-[#33331a]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-2xl lg:text-3xl">login</span>
                                            <h3 className="font-bold text-base lg:text-lg text-[#181811] dark:text-white">Sign In</h3>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400">arrow_forward</span>
                                    </div>
                                </Link>

                                <button className="bg-white dark:bg-[#1a1a0b] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl p-6 transition-all text-left border border-gray-200 dark:border-[#33331a]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <span className="material-symbols-outlined text-red-500 text-2xl lg:text-3xl">logout</span>
                                            <h3 className="font-bold text-base lg:text-lg text-red-500">Log Out</h3>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* App Info */}
                        <section className="lg:col-span-2 pt-4 border-t border-gray-200 dark:border-[#33331a]">
                            <div className="text-center text-sm lg:text-base text-gray-600 dark:text-gray-400 space-y-2">
                                <p className="font-semibold">OgaTicha v1.0.0</p>
                                <p>© 2025 OgaTicha. All rights reserved.</p>
                                <div className="flex justify-center gap-4 lg:gap-6 mt-3">
                                    <Link href="#" className="hover:text-[#f9f506] transition-colors">Privacy Policy</Link>
                                    <span>•</span>
                                    <Link href="#" className="hover:text-[#f9f506] transition-colors">Terms of Service</Link>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
