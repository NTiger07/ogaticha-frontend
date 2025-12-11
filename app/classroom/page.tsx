'use client';

import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

export default function ClassroomPage() {
    const lectures = [
        { id: 1, title: 'Intro to Linear Algebra', professor: 'Prof. Adewale', date: 'Oct 12', color: 'red' },
        { id: 2, title: 'Modern European History', professor: 'Dr. Smith', date: 'Oct 10', color: 'blue' },
        { id: 3, title: 'Macroeconomics 101', professor: 'Mrs. Okafor', date: 'Oct 09', color: 'orange' },
        { id: 4, title: 'Quantum Physics Fundamentals', professor: 'Dr. Johnson', date: 'Oct 08', color: 'purple' },
        { id: 5, title: 'Introduction to Python Programming', professor: 'Prof. Chen', date: 'Oct 07', color: 'green' },
        { id: 6, title: 'World Literature Analysis', professor: 'Mrs. Williams', date: 'Oct 06', color: 'pink' },
    ];

    return (
        <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#23220f]">
            <Sidebar />

            <main className="lg:ml-64 min-h-screen pb-20 lg:pb-8">
                <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#1a1a0b]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#33331a] px-4 lg:px-8 py-4 lg:py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <div className="lg:hidden w-10 h-10 bg-[#f9f506] rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl text-[#181811]">school</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold text-[#181811] dark:text-white">Classroom</h1>
                                    <p className="hidden lg:block text-gray-600 dark:text-gray-400 mt-1">Access your lecture notes and study materials</p>
                                </div>
                            </div>
                            <Link href="/settings" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 dark:bg-[#33331a] hover:border-[#f9f506] border-2 border-transparent transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">person</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <h2 className="text-xl lg:text-2xl font-bold text-[#181811] dark:text-white">Recent Lectures</h2>
                        <button className="text-sm lg:text-base font-semibold text-[#8c8b5f] dark:text-[#b0af85] hover:text-[#181811] dark:hover:text-[#f9f506] transition-colors">View all</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                        {lectures.map((lecture) => (
                            <article key={lecture.id} className="bg-white dark:bg-[#23220f] border-2 border-gray-200 dark:border-[#33331a] rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-[#f9f506]/50 transition-all group">
                                <div className="flex items-start gap-4 lg:gap-5">
                                    <div className="shrink-0 w-16 h-20 lg:w-20 lg:h-24 bg-[#f8f8f5] dark:bg-[#2c2c15] rounded-lg flex flex-col items-center justify-center gap-1 border border-gray-200 dark:border-[#33331a] group-hover:scale-105 transition-transform">
                                        <span className={`material-symbols-outlined text-3xl lg:text-4xl text-${lecture.color}-500`}>picture_as_pdf</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">PDF</span>
                                    </div>

                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="mb-3">
                                            <h3 className="text-lg lg:text-xl font-bold leading-tight text-[#181811] dark:text-white mb-1">{lecture.title}</h3>
                                            <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                                                <span className="truncate">{lecture.professor}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                                <span className="whitespace-nowrap">{lecture.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-auto">
                                            <button className="flex-1 h-10 lg:h-12 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] rounded-full flex items-center justify-center gap-2 font-bold text-sm lg:text-base transition-colors">
                                                <span className="material-symbols-outlined text-lg lg:text-xl">auto_awesome</span>
                                                <span className="hidden sm:inline">Summarize</span>
                                            </button>
                                            <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-200 dark:border-[#33331a] flex items-center justify-center text-[#181811] dark:text-white hover:bg-gray-100 dark:hover:bg-[#33331a] transition-colors">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <button className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bg-[#181811] dark:bg-white text-[#f9f506] dark:text-[#181811] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-110 transition-all z-30">
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
