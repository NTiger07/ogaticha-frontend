 'use client';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function CompanionDashboard() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const linked = [
        { id: 1, name: 'Samuel K.', relation: 'Son', grade: 'Grade 8' },
        { id: 2, name: 'Lily A.', relation: 'Daughter', grade: 'Grade 5' },
    ];

    return (
        <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#23220f]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

            <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-8 transition-all duration-300`}>
                <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#1a1a0b]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#33331a] px-4 lg:px-8 py-4 lg:py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-gray-200 dark:bg-[#33331a] hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <div className="lg:hidden w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-[#181811]">school</span>
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-4xl font-bold text-[#181811] dark:text-white">Companion Dashboard</h1>
                                <p className="hidden lg:block text-gray-600 dark:text-gray-400 mt-1">Manage linked students and support</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/settings" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 dark:bg-[#33331a] hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">settings</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <h2 className="text-xl lg:text-2xl font-bold text-[#181811] dark:text-white">Linked Students</h2>
                        <button className="text-sm lg:text-base font-semibold text-[#8c8b5f] dark:text-[#b0af85] hover:text-[#181811] dark:hover:text-[#f9f506] transition-colors">Manage links</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {linked.map((s) => (
                            <article key={s.id} className="bg-white dark:bg-[#23220f] border-2 border-gray-200 dark:border-[#33331a] rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-[#181811] dark:text-white">{s.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{s.relation} • {s.grade}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-2 bg-[#f9f506] rounded-full font-semibold">View</button>
                                        <button className="px-3 py-2 border rounded-full">Message</button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-[#181811] dark:text-white mb-3">Support & Donations</h3>
                        <div className="p-4 border rounded-lg bg-white dark:bg-[#23220f]">Quick links to support learning and donate</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
