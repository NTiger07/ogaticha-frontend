'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isDesktopOpen?: boolean;
    onToggleDesktop?: () => void;
}

export default function Sidebar({ isOpen = false, onClose, isDesktopOpen = true, onToggleDesktop }: SidebarProps) {
    const pathname = usePathname();
    const [isOnline, setIsOnline] = useState(true);
    const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { path: '/classroom', icon: 'menu_book', label: 'Classroom' },
        { path: '/tutor', icon: 'school', label: 'AI Tutor' },
        { path: '/settings', icon: 'settings', label: 'Settings' },
    ];

    const donateItem = { path: '/donate', icon: 'volunteer_activism', label: 'Donate' };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex-col z-50 transition-all duration-300 hidden lg:flex ${isDesktopOpen ? 'w-64' : 'w-16'}`}>
                {/* Logo */}
                <div className="relative">
                    <Link href="/" className={`flex items-center gap-3 p-6 border-b border-gray-200 ${isDesktopOpen ? '' : 'justify-center'}`}>
                        <div className="w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-[#181811]">school</span>
                        </div>
                        {isDesktopOpen && <h1 className="text-2xl font-bold text-[#181811]">OgaTicha</h1>}
                    </Link>
                    <button
                        onClick={onToggleDesktop}
                        className={`absolute top-8 ${isDesktopOpen ? 'right-4' : 'right-0 top-18'} w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors`}
                        title={isDesktopOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <span className="material-symbols-outlined text-lg text-gray-600">
                            {isDesktopOpen ? 'chevron_left' : 'chevron_right'}
                        </span>
                    </button>
                </div>

                {/* Offline Indicator */}
                {isDesktopOpen && !isOnline && (
                    <div className="px-6 py-2 bg-red-100 border-b border-gray-200">
                        <p className="text-sm text-red-600 font-semibold">Offline Mode</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-2 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center ${isDesktopOpen ? 'gap-4 px-4 py-3' : 'justify-center px-2 py-3'} rounded-xl transition-all ${isActive(item.path)
                                ? 'bg-[#f9f506] text-[#181811] shadow-md'
                                : 'text-gray-600 hover:bg-[#f8f8f5] hover:text-[#181811]'
                                }`}
                            title={isDesktopOpen ? '' : item.label}
                        >
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            {isDesktopOpen && <span className="font-semibold text-lg">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section: Donate + Profile */}
                <div className="border-t border-gray-200">
                    {/* Donate Link */}
                    <div className="p-2">
                        <Link
                            href={donateItem.path}
                            className={`flex items-center ${isDesktopOpen ? 'gap-3 px-3 py-2' : 'justify-center px-2 py-2'} rounded-lg transition-all ${isActive(donateItem.path)
                                ? 'bg-[#f9f506] text-[#181811] shadow-sm'
                                : 'text-gray-600 hover:bg-[#f8f8f5] hover:text-[#181811]'
                                }`}
                            title={isDesktopOpen ? '' : donateItem.label}
                        >
                            <span className="material-symbols-outlined text-lg">{donateItem.icon}</span>
                            {isDesktopOpen && <span className="font-medium text-sm">{donateItem.label}</span>}
                        </Link>
                    </div>

                    {/* Profile Section */}
                    {isDesktopOpen && (
                        <div className="p-4">
                            {!_hasHydrated ? (
                                // Loading state while hydrating
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8f8f5]">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-600">person</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-400">Loading...</p>
                                    </div>
                                </div>
                            ) : isAuthenticated && user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8f8f5]">
                                        <div className="w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#181811]">person</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-[#181811] truncate">
                                                {user.name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f8f8f5] transition-all">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-600">person</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-[#181811]">Guest User</p>
                                        <p className="text-xs text-gray-500">Sign in</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar Backdrop */}
            {isOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
                {/* Logo */}
                <div className="relative">
                    <Link href="/" className="flex items-center gap-3 p-6 border-b border-gray-200">
                        <div className="w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-[#181811]">school</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#181811]">OgaTicha</h1>
                    </Link>
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#181811]">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Offline Indicator */}
                {!isOnline && (
                    <div className="px-6 py-2 bg-red-100 border-b border-gray-200">
                        <p className="text-sm text-red-600 font-semibold">Offline Mode</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                ? 'bg-[#f9f506] text-[#181811] shadow-md'
                                : 'text-gray-600 hover:bg-[#f8f8f5] hover:text-[#181811]'
                                }`}
                        >
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            <span className="font-semibold text-lg">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section: Donate + Profile */}
                <div className="border-t border-gray-200">
                    {/* Donate Link */}
                    <div className="p-3">
                        <Link
                            href={donateItem.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive(donateItem.path)
                                ? 'bg-[#f9f506] text-[#181811] shadow-sm'
                                : 'text-gray-600 hover:bg-[#f8f8f5] hover:text-[#181811]'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{donateItem.icon}</span>
                            <span className="font-medium text-sm">{donateItem.label}</span>
                        </Link>
                    </div>

                    {/* Profile Section */}
                    <div className="p-4">
                        {!_hasHydrated ? (
                            // Loading state while hydrating
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8f8f5]">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-600">person</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-400">Loading...</p>
                                </div>
                            </div>
                        ) : isAuthenticated && user ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8f8f5]">
                                    <div className="w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#181811]">person</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-[#181811] truncate">
                                            {user.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        onClose?.();
                                    }}
                                    className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link href="/auth/login" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f8f8f5] transition-all">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-600">person</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-[#181811]">Guest User</p>
                                    <p className="text-xs text-gray-500">Sign in</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
