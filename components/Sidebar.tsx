'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isDesktopOpen?: boolean;
    onToggleDesktop?: () => void;
}

export default function Sidebar({ isOpen = false, onClose, isDesktopOpen = true, onToggleDesktop }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { path: '/classroom', icon: 'menu_book', label: 'Classroom' },
        { path: '/tutor', icon: 'school', label: 'AI Tutor' },
        { path: '/donate', icon: 'volunteer_activism', label: 'Donate' },
        { path: '/settings', icon: 'settings', label: 'Settings' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-[#1a1a0b] border-r border-gray-200 dark:border-[#33331a] flex-col z-50 transition-all duration-300 hidden lg:flex ${isDesktopOpen ? 'w-64' : 'w-16'}`}>
                {/* Logo */}
                <div className="relative">
                    <Link href="/" className={`flex items-center gap-3 p-6 border-b border-gray-200 dark:border-[#33331a] ${isDesktopOpen ? '' : 'justify-center'}`}>
                        <div className="w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-[#181811]">school</span>
                        </div>
                        {isDesktopOpen && <h1 className="text-2xl font-bold text-[#181811] dark:text-white">OgaTicha</h1>}
                    </Link>
                    <button
                        onClick={onToggleDesktop}
                        className={`absolute top-8 ${isDesktopOpen ? 'right-4' : 'right-0 top-18'} w-8 h-8 rounded-full bg-gray-100 dark:bg-[#33331a] hover:bg-gray-200 dark:hover:bg-[#44441a] flex items-center justify-center transition-colors`}
                        title={isDesktopOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <span className="material-symbols-outlined text-lg text-gray-600 dark:text-gray-400">
                            {isDesktopOpen ? 'chevron_left' : 'chevron_right'}
                        </span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center ${isDesktopOpen ? 'gap-4 px-4 py-3' : 'justify-center px-2 py-3'} rounded-xl transition-all ${isActive(item.path)
                                     ? 'bg-[#f9f506] text-[#181811] shadow-md'
                                     : 'text-gray-600 dark:text-gray-400 hover:bg-[#f8f8f5] dark:hover:bg-[#2c2c15] hover:text-[#181811] dark:hover:text-white'
                                 }`}
                            title={isDesktopOpen ? '' : item.label}
                        >
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            {isDesktopOpen && <span className="font-semibold text-lg">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Profile Section */}
                {isDesktopOpen && (
                    <div className="p-4 border-t border-gray-200 dark:border-[#33331a]">
                        <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f8f8f5] dark:hover:bg-[#2c2c15] transition-all">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-[#33331a] rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">person</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-[#181811] dark:text-white">Guest User</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sign in</p>
                            </div>
                        </Link>
                    </div>
                )}
            </aside>

            {/* Mobile Sidebar Backdrop */}
            {isOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#1a1a0b] border-r border-gray-200 dark:border-[#33331a] flex-col z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
                {/* Logo */}
                <div className="relative">
                    <Link href="/" className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-[#33331a]">
                        <div className="w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-[#181811]">school</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#181811] dark:text-white">OgaTicha</h1>
                    </Link>
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#181811] dark:hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-[#f9f506] text-[#181811] shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-[#f8f8f5] dark:hover:bg-[#2c2c15] hover:text-[#181811] dark:hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            <span className="font-semibold text-lg">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Profile Section */}
                <div className="p-4 border-t border-gray-200 dark:border-[#33331a]">
                    <Link href="/auth/login" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f8f8f5] dark:hover:bg-[#2c2c15] transition-all">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-[#33331a] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">person</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-[#181811] dark:text-white">Guest User</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sign in</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a0b] border-t border-gray-200 dark:border-[#33331a] z-50 safe-area-inset-bottom">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.slice(0, 3).map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="flex flex-col items-center gap-1 py-2 px-4 min-w-[70px]"
                        >
                            <div className={`flex items-center justify-center transition-colors ${isActive(item.path) ? 'text-[#f9f506]' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            </div>
                            <span className={`text-xs font-semibold ${isActive(item.path)
                                    ? 'text-[#181811] dark:text-[#f9f506]'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}
