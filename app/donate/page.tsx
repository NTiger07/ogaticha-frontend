'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function DonatePage() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const goals = [
        { id: 1,  title: 'Help Tola buy a Braille Keyboard', description: 'Donate to Tola for accessible hardware for her computer science classes.', category: 'Hardware', raised: 325, goal: 500, donors: 12, imageGradient: 'from-purple-900 to-purple-700' },
        { id: 2,  title: 'Support Obi with Speech Software', description: 'Obi needs a screen reader license to access digital textbooks.', category: 'Software', raised: 120, goal: 300, donors: 4,  imageGradient: 'from-blue-900 to-blue-700' },
        { id: 3, title: 'Accessible Tablets for Class 4B', description: 'Equip the entire classroom with tactile learning tablets.', category: 'Classroom', raised: 850, goal: 2000, donors: 28,  imageGradient: 'from-green-900 to-green-700' },
        { id: 4, title: 'Speech-to-Text Software for Amina', description: 'Help Amina with dyslexia access better learning tools.', category: 'Software', raised: 200, goal: 400, donors: 8,  imageGradient: 'from-pink-900 to-pink-700' },
    ];

    const calculatePercentage = (raised: number, goal: number) => Math.round((raised / goal) * 100);

    return (
        <div className="min-h-screen bg-[#2e004f]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

            <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-20 lg:pb-8 transition-all duration-300`}>
                <header className="sticky top-0 z-20 bg-[#4a148c] border-b border-white/10 px-4 lg:px-8 py-4 lg:py-6 shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined">menu</span>
                                </button>
                                <span className="material-symbols-outlined text-[#f9f506] text-3xl lg:text-5xl">volunteer_activism</span>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold text-white">Student Goals</h1>
                                    <p className="hidden lg:block text-white/80 mt-1">Directly fund accessibility tools for students</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {goals.map((goal) => {
                            const percentage = calculatePercentage(goal.raised, goal.goal);
                            return (
                                <article key={goal.id} className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                                    <div className="relative h-48 lg:h-56 bg-gray-200">
                                        <div className={`absolute inset-0 bg-linear-to-br ${goal.imageGradient} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-white text-7xl lg:text-8xl opacity-30">
                                                {goal.category === 'Hardware' ? 'keyboard' : goal.category === 'Software' ? 'headphones' : 'tablet'}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-6">
                                            <span className="bg-[#f9f506] text-black font-bold px-3 py-1.5 rounded-full text-xs lg:text-sm uppercase tracking-wider">
                                                {goal.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 lg:p-8 flex flex-col gap-4">
                                        <div>
                                            <h3 className="text-xl lg:text-2xl font-bold text-black mb-2 leading-tight">{goal.title}</h3>
                                            <p className="text-gray-600 text-base lg:text-lg font-medium">{goal.description}</p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-black font-bold text-lg lg:text-xl">
                                                    ${goal.raised} <span className="text-gray-500 font-normal text-sm lg:text-base">raised of ${goal.goal}</span>
                                                </span>
                                                <span className="text-[#4a148c] font-bold text-lg lg:text-xl">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 lg:h-4">
                                                <div className="bg-[#4a148c] h-3 lg:h-4 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                            <p className="text-gray-500 text-xs lg:text-sm">{goal.donors} donors recently</p>
                                        </div>

                                        <button className="w-full mt-2 bg-[#f9f506] hover:bg-[#e6e205] text-black text-lg lg:text-xl font-bold py-3 lg:py-4 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group">
                                            <span>{goal.donateAmount > 0 ? `Donate $${goal.donateAmount}` : 'Donate Amount'}</span>
                                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">volunteer_activism</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
