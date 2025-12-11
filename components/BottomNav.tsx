'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a0b] border-t border-gray-200 dark:border-[#33331a] pb-safe pt-2 px-6 h-[88px] z-40">
            <div className="max-w-2xl mx-auto flex justify-between items-start">
                {/* Tutor */}
                <Link href="/tutor" className="flex flex-col items-center gap-1 group w-20 focus:outline-none">
                    <div className={`h-10 w-16 rounded-full flex items-center justify-center transition-colors ${isActive('/tutor')
                            ? 'bg-[#f9f506]'
                            : 'hover:bg-[#f8f8f5] dark:hover:bg-[#2c2c15]'
                        }`}>
                        <span className={`material-symbols-outlined text-3xl transition-colors ${isActive('/tutor')
                                ? 'text-[#181811]'
                                : 'text-[#8c8b5f] dark:text-[#888] group-hover:text-[#181811] dark:group-hover:text-white'
                            }`}>
                            school
                        </span>
                    </div>
                    <span className={`text-xs font-bold ${isActive('/tutor')
                            ? 'text-[#181811] dark:text-[#f9f506]'
                            : 'text-[#8c8b5f] dark:text-[#888] group-hover:text-[#181811] dark:group-hover:text-white'
                        }`}>
                        Tutor
                    </span>
                </Link>

                {/* Classroom */}
                <Link href="/classroom" className="flex flex-col items-center gap-1 group w-20 focus:outline-none">
                    <div className={`h-10 w-16 rounded-full flex items-center justify-center transition-colors ${isActive('/classroom')
                            ? 'bg-[#f9f506] shadow-sm'
                            : 'hover:bg-[#f8f8f5] dark:hover:bg-[#2c2c15]'
                        }`}>
                        <span className={`material-symbols-outlined text-3xl transition-colors ${isActive('/classroom')
                                ? 'text-[#181811]'
                                : 'text-[#8c8b5f] dark:text-[#888] group-hover:text-[#181811] dark:group-hover:text-white'
                            }`}>
                            menu_book
                        </span>
                    </div>
                    <span className={`text-xs font-bold ${isActive('/classroom')
                            ? 'text-[#181811] dark:text-[#f9f506]'
                            : 'text-[#8c8b5f] dark:text-[#888] group-hover:text-[#181811] dark:group-hover:text-white'
                        }`}>
                        Classroom
                    </span>
                </Link>

                {/* Donate */}
                <Link href="/donate" className="flex flex-col items-center gap-1 group w-20 focus:outline-none">
                    <div className={`h-10 w-16 rounded-full flex items-center justify-center transition-colors ${isActive('/donate')
                            ? 'bg-[#f9f506]'
                            : 'hover:bg-[#f8f8f5] dark:hover:bg-[#2c2c15]'
                        }`}>
                        <span className={`material-symbols-outlined text-3xl transition-colors ${isActive('/donate')
                                ? 'text-[#181811]'
                                : 'text-[#8c8b5f] dark:text-[#888] group-hover:text-[#181811] dark:group-hover:text-white'
                            }`}>
                            volunteer_activism
                        </span>
                    </div>
                    <span className={`text-xs font-bold ${isActive('/donate')
                            ? 'text-[#181811] dark:text-[#f9f506]'
                            : 'text-[#8c8b5f] dark:text-[#888] group-hover:text-[#181811] dark:group-hover:text-white'
                        }`}>
                        Donate
                    </span>
                </Link>
            </div>
        </nav>
    );
}
