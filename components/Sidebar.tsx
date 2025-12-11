'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
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
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#1a1a0b] border-r border-gray-200 dark:border-[#33331a] flex-col z-50">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-[#33331a]">
                    <div className="w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-[#181811]">school</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#181811] dark:text-white">OgaTicha</h1>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
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
