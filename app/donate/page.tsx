'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DonatePage() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    // Custom Alert System
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;
        type: 'error' | 'success' | 'warning' | 'info';
    }>({ show: false, message: '', type: 'info' });

    const showAlert = (message: string, type: 'error' | 'success' | 'warning' | 'info' = 'info') => {
        setAlert({ show: true, message, type });
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setAlert({ show: false, message: '', type: 'info' });
        }, 5000);
    };

    const closeAlert = () => {
        setAlert({ show: false, message: '', type: 'info' });
    };

    // ...existing code...
    const goals = [
        {
            id: 1,
            title: 'Braille Keyboards & Tactile Hardware',
            description: 'Fund accessible hardware devices for students with visual impairments.',
            category: 'Hardware',
            raised: 1250,
            goal: 5000,
            donors: 45,
            pendingApplications: 3,
            imageGradient: 'from-purple-900 to-purple-700'
        },
        {
            id: 2,
            title: 'Screen Readers & Speech Software',
            description: 'Support software licenses for students needing assistive technology.',
            category: 'Software',
            raised: 890,
            goal: 3000,
            donors: 28,
            pendingApplications: 5,
            imageGradient: 'from-blue-900 to-blue-700'
        },
        {
            id: 3,
            title: 'Accessible Tablets & Learning Devices',
            description: 'Provide tactile learning tablets and accessible devices for classrooms.',
            category: 'Classroom',
            raised: 2100,
            goal: 8000,
            donors: 67,
            pendingApplications: 8,
            imageGradient: 'from-green-900 to-green-700'
        },
        {
            id: 4,
            title: 'Speech-to-Text & Dyslexia Tools',
            description: 'Fund assistive learning tools for students with learning differences.',
            category: 'Software',
            raised: 650,
            goal: 2500,
            donors: 22,
            pendingApplications: 4,
            imageGradient: 'from-pink-900 to-pink-700'
        },
    ];

    // Voice search handler
    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            showAlert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.', 'error');
            return;
        }

        setIsRecording(true);

        try {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                setIsRecording(false);
                showAlert(`Search updated: "${transcript}"`, 'success');
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);

                // Only show alerts for critical errors, not for no-speech or aborted
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    showAlert('Please allow microphone access in your browser settings.', 'error');
                } else if (event.error === 'network') {
                    showAlert('Network error. Please check your internet connection.', 'error');
                } else if (event.error === 'audio-capture') {
                    showAlert('No microphone found. Please connect a microphone and try again.', 'error');
                }
                // Silent handling for no-speech, aborted, and other non-critical errors
                // These are normal user interactions and don't need alerts
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
        } catch (error) {
            setIsRecording(false);
            console.error('Speech recognition initialization error:', error);
            showAlert('Speech recognition is not available. Please try typing instead.', 'warning');
        }
    };

    // Filter donation programs based on search query
    const filteredGoals = goals.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculatePercentage = (raised: number, goal: number) => Math.round((raised / goal) * 100);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#2e004f]">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

                <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-8 transition-all duration-300`}>
                    {/* Custom Alert System */}
                    {alert.show && (
                        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slideDown">
                            <div className={`rounded-xl shadow-2xl p-4 flex items-start gap-3 ${alert.type === 'error' ? 'bg-red-50 border-2 border-red-500' :
                                    alert.type === 'success' ? 'bg-green-50 border-2 border-green-500' :
                                        alert.type === 'warning' ? 'bg-yellow-50 border-2 border-yellow-500' :
                                            'bg-blue-50 border-2 border-blue-500'
                                }`}>
                                {/* Icon */}
                                <span className={`material-symbols-outlined text-2xl ${alert.type === 'error' ? 'text-red-600' :
                                        alert.type === 'success' ? 'text-green-600' :
                                            alert.type === 'warning' ? 'text-yellow-600' :
                                                'text-blue-600'
                                    }`}>
                                    {alert.type === 'error' ? 'error' :
                                        alert.type === 'success' ? 'check_circle' :
                                            alert.type === 'warning' ? 'warning' :
                                                'info'}
                                </span>

                                {/* Message */}
                                <p className={`flex-1 font-medium ${alert.type === 'error' ? 'text-red-800' :
                                        alert.type === 'success' ? 'text-green-800' :
                                            alert.type === 'warning' ? 'text-yellow-800' :
                                                'text-blue-800'
                                    }`}>
                                    {alert.message}
                                </p>

                                {/* Close Button */}
                                <button
                                    onClick={closeAlert}
                                    className={`flex-shrink-0 rounded-lg p-1 transition-colors ${alert.type === 'error' ? 'hover:bg-red-100 text-red-600' :
                                            alert.type === 'success' ? 'hover:bg-green-100 text-green-600' :
                                                alert.type === 'warning' ? 'hover:bg-yellow-100 text-yellow-600' :
                                                    'hover:bg-blue-100 text-blue-600'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            </div>
                        </div>
                    )}

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

                    {/* Search Section */}
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20">
                            <div className="flex items-center gap-3">
                                {/* Search Icon */}
                                

                                {/* Search Input */}
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search donation programs by name, category, or description..."
                                        className="w-full px-4 py-3 lg:py-4 rounded-xl bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f9f506] text-base lg:text-lg"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            title="Clear search"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    )}
                                </div>

                                {/* Voice Search Button */}
                                <button
                                    onClick={handleVoiceSearch}
                                    disabled={isRecording}
                                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isRecording
                                        ? 'bg-red-500 animate-pulse'
                                        : 'bg-[#f9f506] hover:bg-[#e6e205]'
                                        }`}
                                    title="Voice search"
                                >
                                    <span className="material-symbols-outlined text-2xl text-black">
                                        {isRecording ? 'stop' : 'mic'}
                                    </span>
                                </button>
                            </div>

                            {/* Search Results Info */}
                            {searchQuery && (
                                <div className="mt-4 text-white/80 text-sm lg:text-base">
                                    Found {filteredGoals.length} {filteredGoals.length === 1 ? 'program' : 'programs'} matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                        {/* No Results Message */}
                        {searchQuery && filteredGoals.length === 0 && (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-white/50 text-6xl mb-4">search_off</span>
                                <h3 className="text-2xl font-bold text-white mb-2">No programs found</h3>
                                <p className="text-white/70 mb-4">Try adjusting your search or clear the filter</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="px-6 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-black font-bold rounded-full transition-colors"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Always show Apply for Donation card first */}
                            {!searchQuery && (
                                <article key="apply-for-donation" className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                                    <div className="relative h-48 lg:h-56 bg-gray-200 flex items-center justify-center">
                                        <div className="text-center p-6">
                                            <span className="material-symbols-outlined text-[#4a148c] text-6xl lg:text-7xl">campaign</span>
                                            <h3 className="mt-4 text-2xl lg:text-3xl font-bold text-black">Apply for Donation</h3>
                                            <p className="mt-2 text-gray-600">Have a student need? Submit a donation request and we will review it.</p>
                                        </div>
                                    </div>
                                    <div className="p-6 lg:p-8">
                                        <Link href="/donate/apply" className="w-full inline-flex mt-2 bg-[#f9f506] hover:bg-[#e6e205] text-black text-lg lg:text-xl font-bold py-3 lg:py-4 rounded-full shadow-sm hover:shadow-md transition-all items-center justify-center gap-2">
                                            <span>Apply for Donation</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </Link>
                                    </div>
                                </article>
                            )}

                            {/* Render filtered donation programs */}
                            {filteredGoals.map((goal) => {
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
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-500 text-sm lg:text-base font-medium">${goal.raised.toLocaleString()} raised of ${goal.goal.toLocaleString()}</span>
                                                        <span className="text-gray-400 text-xs lg:text-sm">{goal.donors} donors • {goal.pendingApplications} pending applications</span>
                                                    </div>
                                                    <span className="text-[#4a148c] font-bold text-lg lg:text-xl">{percentage}%</span>
                                                </div>
                                                <div className="w-full">
                                                    <progress value={percentage} max={100} className="w-full h-3 lg:h-4 rounded-full overflow-hidden" />
                                                </div>
                                            </div>

                                            <button className="w-full mt-2 bg-[#f9f506] hover:bg-[#e6e205] text-black text-lg lg:text-xl font-bold py-3 lg:py-4 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group">
                                                <span>Donate Amount</span>
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
        </ProtectedRoute>
    );
}
