'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { sendVoiceCommand, recordAudio, askAI, uploadNote } from '../../lib/api/classroom';

interface Message {
    id: string;
    sender: 'user' | 'tutor';
    text: string;
    audioUrl?: string;
    timestamp: Date;
}

export default function TutorPage() {
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'tutor',
            text: "Hello! 👋 I'm ready to help. You can type your question, upload notes, or use voice mode to ask me anything!",
            timestamp: new Date()
        }
    ]);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isContinuousMode, setIsContinuousMode] = useState(false);
    const [isWaitingForSpeech, setIsWaitingForSpeech] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const shouldContinueListeningRef = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.src = '';
            }
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
            shouldContinueListeningRef.current = false;
        };
    }, [currentAudio]);

    useEffect(() => {
        // Update the ref when continuous mode changes
        shouldContinueListeningRef.current = isContinuousMode && isVoiceMode;
    }, [isContinuousMode, isVoiceMode]);

    const handleSend = async () => {
        if (!message.trim() || isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: message.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsProcessing(true);

        try {
            const response = await askAI(userMessage.text);

            if (response.success) {
                const tutorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: response.data.answer,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, tutorMessage]);
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: `Sorry, I encountered an error: ${response.error}. Please try again.`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'tutor',
                text: 'Sorry, something went wrong. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    const startRecording = async () => {
        if (isRecording) return;

        setIsRecording(true);
        setIsWaitingForSpeech(false);
        setRecordingTime(0);

        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

        try {
            const audioFile = await recordAudio(30000); // 30 seconds max

            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }

            setIsRecording(false);
            setRecordingTime(0);

            if (audioFile) {
                await handleVoiceCommand(audioFile);
            }
        } catch (error) {
            console.error('Recording error:', error);
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
            setIsRecording(false);
            setRecordingTime(0);
            shouldContinueListeningRef.current = false;
            setIsContinuousMode(false);

            const errorMessage: Message = {
                id: Date.now().toString(),
                sender: 'tutor',
                text: 'Sorry, I couldn\'t access your microphone. Please check your permissions.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const stopRecording = () => {
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
        }
        setIsRecording(false);
        setRecordingTime(0);
        shouldContinueListeningRef.current = false;
    };

    const toggleContinuousMode = () => {
        const newMode = !isContinuousMode;
        setIsContinuousMode(newMode);
        shouldContinueListeningRef.current = newMode && isVoiceMode;

        if (newMode && isVoiceMode && !isRecording && !isProcessing) {
            // Start the conversation
            setIsWaitingForSpeech(true);
            setTimeout(() => {
                startRecording();
            }, 1000);
        } else if (!newMode) {
            setIsWaitingForSpeech(false);
        }
    };

    const handleVoiceCommand = async (audioFile: File) => {
        setIsProcessing(true);

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: '🎤 Voice message...',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await sendVoiceCommand(audioFile);

            if (response.success) {
                // Update user message with transcription
                setMessages(prev => prev.map(msg =>
                    msg.id === userMessage.id
                        ? { ...msg, text: response.data.user_said }
                        : msg
                ));

                // Add tutor response with audio
                const tutorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: response.data.ai_text,
                    audioUrl: response.data.ai_audio_url,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, tutorMessage]);

                // Auto-play audio in voice mode
                if (isVoiceMode && response.data.ai_audio_url) {
                    playAudio(response.data.ai_audio_url, true);
                }
            } else {
                setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: `Sorry, I couldn't process your voice message: ${response.error}`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'tutor',
                text: 'Sorry, something went wrong processing your voice message.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    const playAudio = (audioUrl: string, shouldContinueAfter: boolean = false) => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = '';
        }

        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        setIsPlayingAudio(true);

        audio.onended = () => {
            setIsPlayingAudio(false);

            // If continuous mode is active, start listening again
            if (shouldContinueAfter && shouldContinueListeningRef.current) {
                setIsWaitingForSpeech(true);
                setTimeout(() => {
                    if (shouldContinueListeningRef.current) {
                        startRecording();
                    }
                }, 1500); // Wait 1.5 seconds before starting to record again
            }
        };

        audio.onerror = () => {
            setIsPlayingAudio(false);
            console.error('Error playing audio');
        };

        audio.play();
    };

    const stopAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setIsPlayingAudio(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || isProcessing) return;

        setIsProcessing(true);

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: `📄 Uploaded: ${file.name}`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await uploadNote(file);

            if (response.success) {
                const tutorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: response.data.transcription,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, tutorMessage]);
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: `Sorry, I couldn't process your file: ${response.error}`,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'tutor',
                text: 'Sorry, something went wrong uploading your file.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#f8f8f5]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

            <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen flex flex-col transition-all duration-300`}>
                {/* Header */}
                <header className="bg-[#4a148c] px-4 lg:px-8 py-4 lg:py-6 text-white border-b border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 lg:gap-4">
                                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined">menu</span>
                                </button>
                                <span className="material-symbols-outlined text-3xl lg:text-5xl text-[#f9f506]">school</span>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold">AI Tutor</h1>
                                    <p className="hidden lg:block text-white/80 mt-1">
                                        {isVoiceMode
                                            ? (isContinuousMode ? '🎤 Continuous Conversation Active' : '🎤 Voice Mode Active')
                                            : 'Get instant help with your studies'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 lg:gap-3">
                                {isVoiceMode && (
                                    <button
                                        onClick={toggleContinuousMode}
                                        className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base ${isContinuousMode
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/20 hover:bg-white/30 text-white'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-lg lg:text-xl">
                                            {isContinuousMode ? 'motion_photos_on' : 'motion_photos_off'}
                                        </span>
                                        <span className="hidden lg:inline">
                                            {isContinuousMode ? 'Continuous' : 'Manual'}
                                        </span>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setIsVoiceMode(!isVoiceMode);
                                        if (isVoiceMode) {
                                            setIsContinuousMode(false);
                                            shouldContinueListeningRef.current = false;
                                            setIsWaitingForSpeech(false);
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all ${isVoiceMode
                                        ? 'bg-[#f9f506] text-[#4a148c]'
                                        : 'bg-white/20 hover:bg-white/30 text-white'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">
                                        {isVoiceMode ? 'mic' : 'mic_off'}
                                    </span>
                                    <span className="hidden lg:inline">
                                        {isVoiceMode ? 'Voice' : 'Text'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 lg:py-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Date Separator */}
                        <div className="flex justify-center">
                            <span className="bg-gray-200 px-4 py-1 rounded-full text-sm font-medium">Today</span>
                        </div>

                        {/* Messages */}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-3 lg:gap-4 ${msg.sender === 'user' ? 'justify-end' : ''
                                    }`}
                            >
                                {msg.sender === 'tutor' && (
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#4a148c] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-white text-xl lg:text-2xl">face_3</span>
                                    </div>
                                )}

                                <div className={`flex-1 ${msg.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                                    <p className="text-sm font-bold text-[#4a148c] mb-1">
                                        {msg.sender === 'tutor' ? 'Tutor (AI)' : 'You'}
                                    </p>
                                    <div
                                        className={`rounded-2xl p-4 lg:p-5 shadow-sm ${msg.sender === 'tutor'
                                            ? 'bg-white rounded-tl-none border border-gray-200'
                                            : 'bg-[#4a148c] text-white rounded-tr-none shadow-md max-w-2xl'
                                            }`}
                                    >
                                        <p className={`text-base lg:text-lg whitespace-pre-wrap ${msg.sender === 'tutor' ? 'text-[#181811]' : ''
                                            }`}>
                                            {msg.text}
                                        </p>

                                        {/* Audio Player for tutor messages with audio */}
                                        {msg.sender === 'tutor' && msg.audioUrl && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    onClick={() => playAudio(msg.audioUrl!)}
                                                    disabled={isPlayingAudio}
                                                    className="flex items-center gap-2 px-3 py-2 bg-[#4a148c] text-white rounded-lg hover:bg-[#6a1a9c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        {isPlayingAudio ? 'volume_up' : 'play_arrow'}
                                                    </span>
                                                    <span className="text-sm">
                                                        {isPlayingAudio ? 'Playing...' : 'Play Audio'}
                                                    </span>
                                                </button>
                                                {isPlayingAudio && (
                                                    <button
                                                        onClick={stopAudio}
                                                        className="p-2 text-[#4a148c] hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">stop</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {msg.sender === 'user' && (
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f9f506] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[#181811] text-xl lg:text-2xl">person</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Processing Indicator */}
                        {isProcessing && (
                            <div className="flex items-start gap-3 lg:gap-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#4a148c] flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-white text-xl lg:text-2xl">face_3</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-[#4a148c] mb-1">Tutor (AI)</p>
                                    <div className="bg-white rounded-2xl rounded-tl-none p-4 lg:p-5 shadow-sm border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="animate-pulse flex space-x-2">
                                                <div className="w-2 h-2 bg-[#4a148c] rounded-full"></div>
                                                <div className="w-2 h-2 bg-[#4a148c] rounded-full animation-delay-200"></div>
                                                <div className="w-2 h-2 bg-[#4a148c] rounded-full animation-delay-400"></div>
                                            </div>
                                            <span className="text-sm text-gray-500">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-4 lg:p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Recording Indicator */}
                        {isRecording && (
                            <div className="mb-4 flex items-center justify-center gap-3 bg-red-50 border-2 border-red-500 rounded-xl p-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-red-600 font-semibold">
                                    Recording... {formatTime(recordingTime)}
                                </span>
                                <button
                                    onClick={stopRecording}
                                    className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    Stop
                                </button>
                            </div>
                        )}

                        {/* Waiting for Speech Indicator */}
                        {isWaitingForSpeech && !isRecording && (
                            <div className="mb-4 flex items-center justify-center gap-3 bg-blue-50 border-2 border-blue-500 rounded-xl p-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-blue-600 font-semibold">
                                    Waiting for you to speak...
                                </span>
                            </div>
                        )}

                        <div className="flex gap-2 lg:gap-3">
                            {/* File Upload */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isProcessing || isRecording}
                                className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gray-200 hover:bg-gray-300 text-[#181811] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-2xl lg:text-3xl">upload_file</span>
                            </button>

                            {/* Voice Recording */}
                            {isVoiceMode ? (
                                <>
                                    {!isContinuousMode ? (
                                        <button
                                            onClick={startRecording}
                                            disabled={isRecording || isProcessing}
                                            className={`flex-1 h-12 lg:h-14 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all ${isRecording
                                                ? 'bg-red-500 text-white'
                                                : 'bg-[#4a148c] hover:bg-[#6a1a9c] text-white'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <span className="material-symbols-outlined text-2xl lg:text-3xl">
                                                {isRecording ? 'stop' : 'mic'}
                                            </span>
                                            <span>{isRecording ? 'Recording...' : 'Tap to Ask'}</span>
                                        </button>
                                    ) : (
                                        <div className="flex-1 h-12 lg:h-14 rounded-xl bg-green-50 border-2 border-green-500 flex items-center justify-center gap-3">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-green-600 font-semibold text-sm lg:text-base">
                                                {isRecording ? 'Listening...' : isPlayingAudio ? 'AI Speaking...' : 'Preparing...'}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <input
                                        className="flex-1 h-12 lg:h-14 px-4 lg:px-5 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-base lg:text-lg focus:border-[#4a148c] focus:ring-2 focus:ring-[#4a148c]/20 outline-none transition-all placeholder:text-gray-500"
                                        placeholder="Type a message..."
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        disabled={isProcessing}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim() || isProcessing}
                                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-[#f9f506] hover:bg-[#e6e205] text-[#181811] flex items-center justify-center shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined text-2xl lg:text-3xl">send</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
