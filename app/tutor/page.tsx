'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function TutorPage() {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#23220f]">
            <Sidebar />

            <main className="lg:ml-64 min-h-screen flex flex-col pb-20 lg:pb-0">
                {/* Header */}
                <header className="bg-[#4a148c] px-4 lg:px-8 py-4 lg:py-6 text-white border-b border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <span className="material-symbols-outlined text-3xl lg:text-5xl text-[#f9f506]">school</span>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold">AI Tutor</h1>
                                    <p className="hidden lg:block text-white/80 mt-1">Get instant help with your studies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 lg:py-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Date Separator */}
                        <div className="flex justify-center">
                            <span className="bg-gray-200 dark:bg-[#333] px-4 py-1 rounded-full text-sm font-medium">Today</span>
                        </div>

                        {/* Tutor Message */}
                        <div className="flex items-start gap-3 lg:gap-4">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#4a148c] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-white text-xl lg:text-2xl">face_3</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#4a148c] mb-1">Tutor (AI)</p>
                                <div className="bg-white dark:bg-[#2c2c25] rounded-2xl rounded-tl-none p-4 lg:p-5 shadow-sm border border-gray-200 dark:border-transparent">
                                    <p className="text-base lg:text-lg text-[#181811] dark:text-white">Hello! 👋 I&apos;m ready to help.</p>
                                    <p className="text-base lg:text-lg text-[#181811] dark:text-white mt-2">Upload your notes to start or switch to Voice Mode to ask a question.</p>
                                </div>
                            </div>
                        </div>

                        {/* Student Message */}
                        <div className="flex items-start gap-3 lg:gap-4 justify-end">
                            <div className="flex-1 flex flex-col items-end">
                                <p className="text-sm font-bold text-[#4a148c] mb-1">You</p>
                                <div className="bg-[#4a148c] text-white rounded-2xl rounded-tr-none p-4 lg:p-5 shadow-md max-w-2xl">
                                    <p className="text-base lg:text-lg">Here is my math homework for this week.</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f9f506] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#181811] text-xl lg:text-2xl">person</span>
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div className="flex justify-center py-4">
                            <button className="max-w-md w-full flex items-center justify-center gap-3 bg-white dark:bg-[#2c2c25] hover:bg-gray-50 dark:hover:bg-[#3a3a1a] border-2 border-dashed border-gray-300 hover:border-[#4a148c] rounded-xl p-6 lg:p-8 transition-all group">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gray-100 dark:bg-[#3d3d33] flex items-center justify-center group-hover:bg-[#4a148c] group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                                </div>
                                <span className="text-lg lg:text-xl font-bold text-[#181811] dark:text-white group-hover:text-[#4a148c] dark:group-hover:text-[#f9f506]">Upload Notes</span>
                            </button>
                        </div>

                        {/* Tutor Response */}
                        <div className="flex items-start gap-3 lg:gap-4">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#4a148c] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-white text-xl lg:text-2xl">face_3</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#4a148c] mb-1">Tutor (AI)</p>
                                <div className="bg-white dark:bg-[#2c2c25] rounded-2xl rounded-tl-none p-4 lg:p-5 shadow-sm border border-gray-200 dark:border-transparent">
                                    <p className="text-base lg:text-lg text-[#181811] dark:text-white">Got it! Let&apos;s focus on the problems you&apos;re working on. How can I help?</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="sticky bottom-0 bg-white dark:bg-[#1a1a15] border-t-2 border-gray-200 dark:border-[#333] p-4 lg:p-6">
                    <div className="max-w-4xl mx-auto flex gap-2 lg:gap-3">
                        <input
                            className="flex-1 h-12 lg:h-14 px-4 lg:px-5 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] dark:bg-[#2c2c25] dark:border-[#555] dark:text-white text-base lg:text-lg focus:border-[#4a148c] focus:ring-2 focus:ring-[#4a148c]/20 outline-none transition-all placeholder:text-gray-500"
                            placeholder="Type a message..."
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] flex items-center justify-center shadow-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-2xl lg:text-3xl">send</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
