 'use client';

import { useState } from 'react';
import { useStudents } from '../../components/useStudents';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';

export default function LecturerDashboard() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { students, loading } = useStudents();

    return (
        <div className="min-h-screen bg-[#f8f8f5]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

            <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-8 transition-all duration-300`}>
                <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-gray-200 hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <div className="lg:hidden w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-[#181811]">school</span>
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-4xl font-bold text-[#181811]">Lecturer Dashboard</h1>
                                <p className="hidden lg:block text-gray-600 mt-1">Manage your classes and students</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/settings" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-600">settings</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <h2 className="text-xl lg:text-2xl font-bold text-[#181811]">Your Students</h2>
                        <button className="text-sm lg:text-base font-semibold text-[#8c8b5f] hover:text-[#181811] transition-colors">View all</button>
                    </div>

                    {loading ? (
                        <p className="text-gray-600">Loading students...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {students.map((s) => (
                                <article key={s.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                                        <div>
                                            <h3 className="font-bold text-[#181811]">{s.name}</h3>
                                            <p className="text-sm text-gray-600">{s.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <button className="flex-1 h-10 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-full flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                                            <span className="material-symbols-outlined">visibility</span>
                                            View Profile
                                        </button>
                                        <button className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center">
                                            <span className="material-symbols-outlined">email</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <button className="fixed bottom-8 right-6 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bg-[#181811] text-[#f9f506] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-110 transition-all z-30">
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
