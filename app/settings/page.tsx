'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useVoiceMode } from '../../hooks/useVoiceMode';
import { useAuthStore } from '@/lib/store/authStore';
import { updateUserProfile, updateUserSettings } from '@/lib/api/auth';

export default function SettingsPage() {
    const router = useRouter();
    const { user, isAuthenticated, updateUser, logout, token } = useAuthStore();
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        disability_type: '',
        preferred_mode: ''
    });

    // Load user data into form and settings
    useEffect(() => {
        if (isAuthenticated && user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
                disability_type: user.disability_type || '',
                preferred_mode: user.preferred_mode || ''
            });

            // Load settings from user object
            if (user.settings) {
                setSettings({
                    darkMode: user.settings.dark_mode ?? false,
                    notifications: user.settings.notifications ?? true,
                    voiceMode: user.settings.voice_mode ?? true,
                    fontSize: user.settings.font_size ?? 'medium',
                    highContrast: user.settings.high_contrast ?? false,
                    offlineMode: user.settings.offline_mode ?? false,
                    autoDownload: user.settings.auto_download ?? true,
                });

                if (user.settings.selected_voice) {
                    setSelectedVoice(user.settings.selected_voice);
                }
            }
        }
    }, [user, isAuthenticated]);

    // Download progress state
    const [downloads, setDownloads] = useState<Array<{
        id: string;
        name: string;
        progress: number;
        status: 'downloading' | 'completed' | 'paused';
    }>>([]);

    // Audio voice settings
    const [selectedVoice, setSelectedVoice] = useState('default');
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Lecturers management
    const [lecturers, setLecturers] = useState<Array<{
        id: string;
        name: string;
        subject: string;
        enabled: boolean;
    }>>([
        { id: '1', name: 'Dr. Adebayo', subject: 'Mathematics', enabled: true },
        { id: '2', name: 'Prof. Okonkwo', subject: 'Physics', enabled: true },
    ]);

    // Companions management
    const [companions, setCompanions] = useState<Array<{
        id: string;
        name: string;
        personality: string;
        enabled: boolean;
    }>>([
        { id: '1', name: 'Oga', personality: 'Friendly & Encouraging', enabled: true },
        { id: '2', name: 'Ticha', personality: 'Professional & Focused', enabled: false },
    ]);

    const [settings, setSettings] = useState<{
        darkMode: boolean;
        notifications: boolean;
        voiceMode: boolean;
        fontSize: string;
        highContrast: boolean;
        offlineMode: boolean;
        autoDownload: boolean;
    }>(() => {
        const initial: {
            darkMode: boolean;
            notifications: boolean;
            voiceMode: boolean;
            fontSize: string;
            highContrast: boolean;
            offlineMode: boolean;
            autoDownload: boolean;
        } = {
            darkMode: false,
            notifications: true,
            voiceMode: true, // enabled by default
            fontSize: 'medium',
            highContrast: false,
            offlineMode: false,
            autoDownload: true,
        };
        try {
            const stored = localStorage.getItem('settings');
            if (stored) {
                const parsed = JSON.parse(stored);
                Object.assign(initial, parsed);
            } else {
                // Fallback for theme
                const t = localStorage.getItem('theme');
                if (t === 'dark') initial.darkMode = true;
                else if (t === 'light') initial.darkMode = false;
                else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) initial.darkMode = true;
            }
        } catch {
            // ignore
        }

        // Apply initial settings
        if (typeof window !== 'undefined') {
            try {
                if (initial.darkMode) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');

                if (initial.highContrast) document.documentElement.classList.add('high-contrast');
                else document.documentElement.classList.remove('high-contrast');

                document.body.className = `font-${initial.fontSize}`;
            } catch {
                // ignore
            }
        }

        return initial;
    });

    const { announce } = useVoiceMode(settings.voiceMode);

    // Load available voices for speech synthesis
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            // Filter to only include en-US and en-GB voices
            const englishVoices = voices.filter(voice =>
                voice.lang.toLowerCase().startsWith('en-us') ||
                voice.lang.toLowerCase().startsWith('en-gb')
            );
            setAvailableVoices(englishVoices);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        // Load saved voice preference
        const savedVoice = localStorage.getItem('selectedVoice');
        if (savedVoice) setSelectedVoice(savedVoice);
    }, []);

    const handleVoiceChange = (voiceName: string) => {
        setSelectedVoice(voiceName);
        localStorage.setItem('selectedVoice', voiceName);

        // Update Zustand store
        updateUser({ settings: { ...user?.settings, selected_voice: voiceName } });

        // Sync to backend
        if (token && user?.id) {
            updateUserSettings({ user_id: user.id, selected_voice: voiceName }, token).catch(err => {
                console.error('Failed to sync voice setting to backend:', err);
            });
        }

        announce(`Voice changed to ${voiceName}`);
    };

    const toggleLecturer = (id: string) => {
        setLecturers(prev => {
            const updated = prev.map(l =>
                l.id === id ? { ...l, enabled: !l.enabled } : l
            );

            // Sync to backend
            if (token) {
                updateUserSettings({
                    lecturers: updated.map(l => ({ id: l.id, enabled: l.enabled }))
                }, token).catch(err => {
                    console.error('Failed to sync lecturers to backend:', err);
                });
            }

            return updated;
        });

        const lecturer = lecturers.find(l => l.id === id);
        announce(`${lecturer?.name} ${lecturer?.enabled ? 'disabled' : 'enabled'}`);
    };

    const toggleCompanion = (id: string) => {
        setCompanions(prev => {
            const updated = prev.map(c =>
                c.id === id ? { ...c, enabled: !c.enabled } : c
            );

            // Sync to backend
            if (token) {
                updateUserSettings({
                    companions: updated.map(c => ({ id: c.id, enabled: c.enabled }))
                }, token).catch(err => {
                    console.error('Failed to sync companions to backend:', err);
                });
            }

            return updated;
        });

        const companion = companions.find(c => c.id === id);
        announce(`${companion?.name} ${companion?.enabled ? 'disabled' : 'enabled'}`);
    };

    const clearDownload = (id: string) => {
        setDownloads(prev => prev.filter(d => d.id !== id));
        announce('Download removed');
    };

    const pauseDownload = (id: string) => {
        setDownloads(prev => prev.map(d =>
            d.id === id ? { ...d, status: d.status === 'paused' ? 'downloading' : 'paused' } : d
        ));
    };
    const handleLogout = () => {
        logout();
        announce('Logged out successfully');
        router.push('/auth/login');
    };

    const handleEditProfile = () => {
        setEditName(user?.name || '');
        setIsEditProfileOpen(true);
    };

    const handleSaveProfile = async () => {
        if (!editName.trim() || editName === user?.name) {
            console.log('Validation failed:', {
                hasName: !!editName.trim(),
                isSame: editName === user?.name,
                hasToken: !!token
            });
            setIsEditProfileOpen(false);
            return;
        }

        setIsSaving(true);

        try {
            if (!token) {
                announce('Authentication required');
                setIsSaving(false);
                return;
            }

            const response = await updateUserSettings({ user_id: user?.id, name: editName.trim() }, token);


            if (response.success && response.data) {
                console.log('Update successful, data:', response.data);
                // Update the Zustand store with the new data
                updateUser(response.data.user);
                announce('Profile updated successfully');
                setIsEditProfileOpen(false);
            } else {
                console.log('Update failed:', 'error' in response ? response.error : 'Unknown error');
                announce('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            announce('An error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Apply settings to DOM when they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Apply dark mode
                if (settings.darkMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }

                // Apply high contrast
                if (settings.highContrast) {
                    document.documentElement.classList.add('high-contrast');
                } else {
                    document.documentElement.classList.remove('high-contrast');
                }

                // Apply font size
                document.body.className = `font-${settings.fontSize}`;
            } catch {
                // ignore
            }
        }
    }, [settings.darkMode, settings.highContrast, settings.fontSize]);

    const handleToggle = (setting: keyof typeof settings) => {
        const newVal = !settings[setting];
        const newSettings = { ...settings, [setting]: newVal };
        setSettings(newSettings);

        // Persist to localStorage
        try {
            localStorage.setItem('settings', JSON.stringify(newSettings));
        } catch {
            // ignore
        }

        // Convert to snake_case for API
        const apiSettings = {
            dark_mode: newSettings.darkMode,
            notifications: newSettings.notifications,
            voice_mode: newSettings.voiceMode,
            font_size: newSettings.fontSize,
            high_contrast: newSettings.highContrast,
            offline_mode: newSettings.offlineMode,
            auto_download: newSettings.autoDownload,
        };

        // Update Zustand store
        updateUser({ settings: apiSettings });

        // Sync to backend
        if (user?.id && token) {
            const payload = { user_id: user.id, ...apiSettings };

            updateUserSettings(payload, token)
                .then(response => {
                    console.log('Settings sync response:', response);
                    if (response.success) {
                        console.log('Settings synced successfully');
                    } else {
                        console.error('Settings sync failed:', 'error' in response ? response.error : 'Unknown error');
                    }
                })
                .catch(err => {
                    console.error('Failed to sync settings to backend:', err);
                });
        } else {
            console.warn('Cannot sync settings: missing user.id or token');
        }

        // Also update theme in localStorage for backward compatibility
        if (setting === 'darkMode') {
            try {
                localStorage.setItem('theme', newVal ? 'dark' : 'light');
                announce(newVal ? 'Dark mode enabled' : 'Dark mode disabled');
            } catch {
                // ignore
            }
        } else if (setting === 'highContrast') {
            announce(newVal ? 'High contrast mode enabled' : 'High contrast mode disabled');
        } else if (setting === 'notifications') {
            announce(newVal ? 'Notifications enabled' : 'Notifications disabled');
        } else if (setting === 'voiceMode') {
            if (newVal) {
                const utterance = new SpeechSynthesisUtterance('Voice mode enabled');
                window.speechSynthesis.speak(utterance);
            } else {
                announce('Voice mode disabled');
            }
        } else if (setting === 'offlineMode') {
            announce(newVal ? 'Offline mode enabled' : 'Offline mode disabled');
        } else if (setting === 'autoDownload') {
            announce(newVal ? 'Auto download enabled' : 'Auto download disabled');
        }
    };


    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8f8f5]">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

                <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-8 transition-all duration-300`}>
                    <header className="bg-[#4a148c] px-4 lg:px-8 py-6 lg:py-8">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined">menu</span>
                                </button>
                                <Link href="/" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors lg:hidden">
                                    <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
                                </Link>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-white">Settings</h1>
                                    <p className="hidden lg:block text-white/80 mt-1">Customize your OgaTicha experience</p>
                                </div>
                            </div>

                        </div>
                    </header>

                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Profile Section */}
                            <section className="lg:col-span-2">
                                <h2 className="text-xl lg:text-2xl font-bold text-[#181811] mb-4 lg:mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">person</span>
                                    Profile
                                </h2>
                                <div className="bg-white rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-4 lg:gap-6 border border-gray-200">
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-[#f9f506] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl lg:text-5xl text-[#181811]">person</span>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-xl lg:text-2xl text-[#181811]">
                                            {isAuthenticated && user ? user.name : 'Guest User'}
                                        </h3>
                                        <p className="text-sm lg:text-base text-gray-600 mt-1">
                                            {isAuthenticated && user ? user.email : 'guest@ogaticha.com'}
                                        </p>
                                        {isAuthenticated && user && user.disability_type && (
                                            <p className="text-xs lg:text-sm text-gray-500 mt-1">
                                                Disability: {user.disability_type}
                                            </p>
                                        )}
                                        {isAuthenticated && user && user.preferred_mode && (
                                            <p className="text-xs lg:text-sm text-gray-500">
                                                Preferred Mode: {user.preferred_mode}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleEditProfile}
                                        className="px-6 py-2.5 lg:px-8 lg:py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-full transition-colors text-base lg:text-lg"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </section>

                            {/* Audio Voice Settings */}
                            <section className="lg:col-span-2">
                                <h2 className="text-xl lg:text-2xl font-bold text-[#181811] mb-4 lg:mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">record_voice_over</span>
                                    Audio Voice
                                </h2>
                                <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200">
                                    <div className="flex items-center gap-3 lg:gap-4 mb-4">
                                        <span className="material-symbols-outlined text-gray-600 text-2xl lg:text-3xl">voice_selection</span>
                                        <h3 className="font-bold text-base lg:text-lg text-[#181811]">Select Voice Output</h3>
                                    </div>
                                    <select
                                        value={selectedVoice}
                                        onChange={(e) => handleVoiceChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#f9f506] focus:outline-none text-[#181811] bg-gray-50"
                                    >
                                        <option value="default">Default Voice</option>
                                        {availableVoices.map((voice, idx) => (
                                            <option key={idx} value={voice.name}>
                                                {voice.name} ({voice.lang})
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => {
                                            const utterance = new SpeechSynthesisUtterance('This is a test of the selected voice');
                                            const voice = availableVoices.find(v => v.name === selectedVoice);
                                            if (voice) utterance.voice = voice;
                                            window.speechSynthesis.speak(utterance);
                                        }}
                                        className="mt-4 w-full px-6 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">play_arrow</span>
                                        Test Voice
                                    </button>
                                </div>
                            </section>

                            {/* Offline Downloads Section */}
                            <section className="lg:col-span-2">
                                <h2 className="text-xl lg:text-2xl font-bold text-[#181811] mb-4 lg:mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">download</span>
                                    Offline Downloads
                                </h2>

                                {/* Download Settings */}
                                <div className="space-y-3 lg:space-y-4 mb-6">
                                    {[
                                        { key: 'offlineMode', icon: 'offline_pin', title: 'Offline Mode', desc: 'Enable offline content access' },
                                        { key: 'autoDownload', icon: 'cloud_download', title: 'Auto Download', desc: 'Automatically download new content' }
                                    ].map((item) => (
                                        <div key={item.key} className="bg-white rounded-xl p-4 lg:p-6 flex items-center justify-between border border-gray-200">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                <span className="material-symbols-outlined text-gray-600 text-2xl lg:text-3xl">{item.icon}</span>
                                                <div>
                                                    <h3 className="font-bold text-base lg:text-lg text-[#181811]">{item.title}</h3>
                                                    <p className="text-sm lg:text-base text-gray-600">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleToggle(item.key as keyof typeof settings)}
                                                aria-label={`Toggle ${item.title}`}
                                                className={`w-14 h-8 lg:w-16 lg:h-9 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? 'bg-[#f9f506]' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-6 h-6 lg:w-7 lg:h-7 bg-white rounded-full shadow-md transform transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-7 lg:translate-x-8' : 'translate-x-1'}`}></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Active Downloads */}
                                <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200">
                                    <h3 className="font-bold text-lg lg:text-xl text-[#181811] mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#f9f506]">download_for_offline</span>
                                        Active Downloads
                                    </h3>
                                    {downloads.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <span className="material-symbols-outlined text-5xl mb-2 opacity-50">cloud_off</span>
                                            <p>No active downloads</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {downloads.map((download) => (
                                                <div key={download.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-[#181811]">{download.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => pauseDownload(download.id)}
                                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                                                                aria-label={download.status === 'paused' ? 'Resume' : 'Pause'}
                                                            >
                                                                <span className="material-symbols-outlined text-gray-600">
                                                                    {download.status === 'paused' ? 'play_arrow' : 'pause'}
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={() => clearDownload(download.id)}
                                                                className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center"
                                                                aria-label="Remove"
                                                            >
                                                                <span className="material-symbols-outlined text-red-500">close</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-[#f9f506] h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${download.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[50px] text-right">
                                                            {download.progress}%
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 capitalize">{download.status}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Manage Lecturers */}
                            <section className="lg:col-span-2">
                                <h2 className="text-xl lg:text-2xl font-bold text-[#181811] mb-4 lg:mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">school</span>
                                    Manage Lecturers
                                </h2>
                                <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200">
                                    <div className="space-y-4">
                                        {lecturers.map((lecturer) => (
                                            <div key={lecturer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#f9f506] transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-[#4a148c] rounded-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-2xl">person</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-base lg:text-lg text-[#181811]">{lecturer.name}</h3>
                                                        <p className="text-sm text-gray-600">{lecturer.subject}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleLecturer(lecturer.id)}
                                                    aria-label={`Toggle ${lecturer.name}`}
                                                    className={`w-14 h-8 lg:w-16 lg:h-9 rounded-full transition-colors ${lecturer.enabled ? 'bg-[#f9f506]' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-6 h-6 lg:w-7 lg:h-7 bg-white rounded-full shadow-md transform transition-transform ${lecturer.enabled ? 'translate-x-7 lg:translate-x-8' : 'translate-x-1'}`}></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-6 w-full px-6 py-3 bg-[#4a148c] hover:bg-[#6a1b9a] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">add</span>
                                        Add New Lecturer
                                    </button>
                                </div>
                            </section>

                            {/* Manage Companions*/}
                            <section className="lg:col-span-2">
                                <h2 className="text-xl lg:text-2xl font-bold text-[#181811] mb-4 lg:mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">psychology</span>
                                    Manage Companions
                                </h2>
                                <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200">
                                    <div className="space-y-4">
                                        {companions.map((companion) => (
                                            <div key={companion.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#f9f506] transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-[#f9f506] rounded-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[#181811] text-2xl">smart_toy</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-base lg:text-lg text-[#181811]">{companion.name}</h3>
                                                        <p className="text-sm text-gray-600">{companion.personality}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleCompanion(companion.id)}
                                                    aria-label={`Toggle ${companion.name}`}
                                                    className={`w-14 h-8 lg:w-16 lg:h-9 rounded-full transition-colors ${companion.enabled ? 'bg-[#f9f506]' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-6 h-6 lg:w-7 lg:h-7 bg-white rounded-full shadow-md transform transition-transform ${companion.enabled ? 'translate-x-7 lg:translate-x-8' : 'translate-x-1'}`}></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-6 w-full px-6 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">add</span>
                                        Add New Companion
                                    </button>
                                </div>
                            </section>

                            {/* Account Actions */}
                            <section className="lg:col-span-2">
                                <h2 className="text-xl lg:text-2xl font-bold text-[#181811] mb-4 lg:mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#f9f506] text-2xl lg:text-3xl">manage_accounts</span>
                                    Account
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white hover:bg-red-50 rounded-xl p-6 transition-all text-left border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                <span className="material-symbols-outlined text-red-500 text-2xl lg:text-3xl">logout</span>
                                                <h3 className="font-bold text-base lg:text-lg text-red-500">Log Out</h3>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </section>

                            {/* App Info */}
                            <section className="lg:col-span-2 pt-4 border-t border-gray-200">
                                <div className="text-center text-sm lg:text-base text-gray-600 space-y-2">
                                    <p className="font-semibold">OgaTicha v1.0.0</p>
                                    <p>© 2025 OgaTicha. All rights reserved.</p>
                                    <div className="flex justify-center gap-4 lg:gap-6 mt-3">
                                        <Link href="#" className="hover:text-[#f9f506] transition-colors">Privacy Policy</Link>
                                        <span>•</span>
                                        <Link href="#" className="hover:text-[#f9f506] transition-colors">Terms of Service</Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div >
                </main >

                {/* Edit Profile Dialog */}
                {isEditProfileOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-[#181811]">Edit Profile</h3>
                                <button
                                    onClick={() => setIsEditProfileOpen(false)}
                                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined text-gray-600">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#f9f506] focus:outline-none text-[#181811] bg-gray-50"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setIsEditProfileOpen(false)}
                                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#181811] font-bold rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={!editName.trim() || isSaving}
                                        className="flex-1 px-6 py-3 bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSaving && (
                                            <span className="inline-block w-4 h-4 border-2 border-[#181811] border-t-transparent rounded-full animate-spin"></span>
                                        )}
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </ProtectedRoute>
    );
}
