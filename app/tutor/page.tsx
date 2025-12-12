'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { askAI, uploadNote } from '../../lib/api/classroom';
import { useAuthStore } from '@/lib/store/authStore';
import { useChatStore } from '@/lib/store/chatStore';
import type { ChatMessage } from '@/lib/types/api';

interface Message {
    id: string;
    sender: 'user' | 'tutor';
    text: string;
    audioUrl?: string;
    timestamp: Date;
}

export default function TutorPage() {
    const { user, isAuthenticated } = useAuthStore();
    const {
        sessions,
        currentSession,
        messages: storedMessages,
        loadSessions,
        loadSession,
        createNewSession,
        deleteSession,
        updateSessionTitle,
        addMessage: addStoredMessage,
    } = useChatStore();

    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
    const [message, setMessage] = useState('');

    // Format markdown-style text to JSX
    const formatMessage = (text: string) => {
        const lines = text.split('\n');
        const elements: JSX.Element[] = [];
        let currentListItems: string[] = [];
        let key = 0;

        const flushList = () => {
            if (currentListItems.length > 0) {
                elements.push(
                    <ul key={`list-${key++}`} className="list-disc list-inside space-y-1 my-2">
                        {currentListItems.map((item, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                        ))}
                    </ul>
                );
                currentListItems = [];
            }
        };

        const formatInlineMarkdown = (line: string) => {
            return line
                // Bold text **text** or __text__
                .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
                .replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>')
                // Italic text *text* or _text_
                .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
                .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
                // Inline code `code`
                .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
        };

        lines.forEach((line, index) => {
            // Heading 1: # Title
            if (line.match(/^#\s+(.+)/)) {
                flushList();
                const title = line.replace(/^#\s+/, '');
                elements.push(
                    <h1 key={key++} className="text-2xl font-bold mt-4 mb-2">
                        {title}
                    </h1>
                );
            }
            // Heading 2: ## Title
            else if (line.match(/^##\s+(.+)/)) {
                flushList();
                const title = line.replace(/^##\s+/, '');
                elements.push(
                    <h2 key={key++} className="text-xl font-bold mt-3 mb-2">
                        {title}
                    </h2>
                );
            }
            // Heading 3: ### Title
            else if (line.match(/^###\s+(.+)/)) {
                flushList();
                const title = line.replace(/^###\s+/, '');
                elements.push(
                    <h3 key={key++} className="text-lg font-bold mt-3 mb-1">
                        {title}
                    </h3>
                );
            }
            // List item: - item or * item
            else if (line.match(/^[\-\*]\s+(.+)/)) {
                const item = line.replace(/^[\-\*]\s+/, '');
                currentListItems.push(item);
            }
            // Numbered list: 1. item
            else if (line.match(/^\d+\.\s+(.+)/)) {
                flushList();
                const item = line.replace(/^\d+\.\s+/, '');
                if (currentListItems.length === 0) {
                    elements.push(
                        <ol key={`ol-${key++}`} className="list-decimal list-inside space-y-1 my-2">
                            <li dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                        </ol>
                    );
                }
            }
            // Code block: ```code```
            else if (line.match(/^```/)) {
                flushList();
                // Skip code block markers for now (could be enhanced)
            }
            // Regular paragraph
            else if (line.trim() !== '') {
                flushList();
                elements.push(
                    <p
                        key={key++}
                        className="mb-2"
                        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
                    />
                );
            }
            // Empty line
            else {
                flushList();
                if (index > 0 && index < lines.length - 1) {
                    elements.push(<div key={key++} className="h-2" />);
                }
            }
        });

        flushList();
        return elements.length > 0 ? elements : <p>{text}</p>;
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'tutor',
            text: `Hello${isAuthenticated && user ? `, ${user.name}` : ''}! 👋 I'm ready to help. You can type your question, upload notes, or use voice mode to ask me anything!`,
            timestamp: new Date()
        }
    ]);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isVoiceMode, setIsVoiceMode] = useState(true);
    const recognitionRef = useRef<any>(null);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isContinuousMode, setIsContinuousMode] = useState(false);
    const [isWaitingForSpeech, setIsWaitingForSpeech] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const shouldContinueListeningRef = useRef(false);
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Convert stored chat messages to local message format
    useEffect(() => {
        if (storedMessages && storedMessages.length > 0) {
            const convertedMessages: Message[] = storedMessages.map(msg => ({
                id: msg.id,
                sender: msg.type === 'user' ? 'user' : 'tutor',
                text: msg.content,
                timestamp: new Date(msg.timestamp),
            }));
            setMessages(convertedMessages);
        }
    }, [storedMessages]);

    // Create session and load existing sessions on mount
    useEffect(() => {
        const initializeChat = async () => {
            if (user?.id) {
                // Load existing sessions first
                await loadSessions(user.id);

                // Always create a new session when chat starts
                if (!currentSession) {
                    await createNewSession(user.id, 'New Chat');
                }
            }
        };

        initializeChat();
    }, [user?.id]);

    // Speak initial welcome message when component loads
    useEffect(() => {
        if (messages.length > 0 && messages[0].sender === 'tutor') {
            // Delay to ensure page is fully loaded
            const timer = setTimeout(() => {
                speakText(messages[0].text);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Function to speak text using speech synthesis
    const speakText = (text: string) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Remove markdown formatting for speech
        const cleanText = text
            .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold
            .replace(/__(.+?)__/g, '$1')       // Remove bold
            .replace(/\*(.+?)\*/g, '$1')       // Remove italic
            .replace(/_(.+?)_/g, '$1')         // Remove italic
            .replace(/`(.+?)`/g, '$1')         // Remove code
            .replace(/^#{1,6}\s+/gm, '')       // Remove headings
            .replace(/^[\-\*]\s+/gm, '')       // Remove list markers
            .replace(/^\d+\.\s+/gm, '');       // Remove numbered list markers

        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Load and apply saved voice preference
        const savedVoice = localStorage.getItem('selectedVoice');
        if (savedVoice && savedVoice !== 'default') {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.name === savedVoice);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

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
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
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

        // Save to chat store
        addStoredMessage({
            type: 'user',
            content: message.trim(),
        });

        setMessage('');
        setIsProcessing(true);

        try {
            const response = await askAI(userMessage.text, currentSession?.id);

            if (response.success) {
                const tutorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: response.data.answer,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, tutorMessage]);

                // Save to chat store
                addStoredMessage({
                    type: 'ai',
                    content: response.data.answer,
                });

                // Automatically speak the tutor's response
                speakText(response.data.answer);
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: 'Sorry, there was an error processing your request. Please try again.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);

                // Speak error message
                speakText(errorMessage.text);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'tutor',
                text: 'Sorry, something went wrong. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);

            // Speak error message
            speakText(errorMessage.text);
        } finally {
            setIsProcessing(false);
        }
    };

    const startRecording = async () => {
        if (isRecording) return;

        // Check if speech recognition is supported
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const errorMessage: Message = {
                id: Date.now().toString(),
                sender: 'tutor',
                text: 'Sorry, speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }

        setIsRecording(true);
        setIsWaitingForSpeech(false);
        setRecordingTime(0);

        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

        try {
            // Use Web Speech API for speech recognition
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            let finalTranscript = '';
            let hasProcessedResult = false;

            recognition.onresult = async (event: any) => {
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Clear any existing silence timeout
                if (silenceTimeoutRef.current) {
                    clearTimeout(silenceTimeoutRef.current);
                }

                // Set a new timeout to process after 1.5 seconds of silence
                silenceTimeoutRef.current = setTimeout(async () => {
                    if (finalTranscript.trim() && !hasProcessedResult) {
                        hasProcessedResult = true;
                        recognition.stop();

                        if (recordingIntervalRef.current) {
                            clearInterval(recordingIntervalRef.current);
                        }
                        setIsRecording(false);
                        setRecordingTime(0);

                        // Send the transcribed text to AI
                        await handleTranscribedText(finalTranscript.trim());
                    }
                }, 1500);
            };

            recognitionRef.current = recognition;

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);

                if (recordingIntervalRef.current) {
                    clearInterval(recordingIntervalRef.current);
                }
                setIsRecording(false);
                setRecordingTime(0);
                shouldContinueListeningRef.current = false;
                setIsContinuousMode(false);

                let errorText = 'Sorry, there was an error with speech recognition.';
                if (event.error === 'not-allowed') {
                    errorText = 'Please allow microphone access to use voice mode.';
                } else if (event.error === 'no-speech') {
                    errorText = 'No speech detected. Please try again.';
                } else if (event.error === 'audio-capture') {
                    errorText = 'No microphone found. Please check your audio devices.';
                }

                const errorMessage: Message = {
                    id: Date.now().toString(),
                    sender: 'tutor',
                    text: errorText,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
            };

            recognition.onend = () => {
                if (recordingIntervalRef.current) {
                    clearInterval(recordingIntervalRef.current);
                }
                setIsRecording(false);
                setRecordingTime(0);
            };

            recognition.start();
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
                text: 'Sorry, speech recognition is not available. Please try typing your message.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }
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

    const handleTranscribedText = async (transcript: string) => {
        setIsProcessing(true);

        // Add user message with transcription
        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: transcript,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        // Save to chat store
        addStoredMessage({
            type: 'user',
            content: transcript,
        });

        try {
            // Send transcribed text to AI
            const response = await askAI(transcript, currentSession?.id);

            if (response.success) {
                // Add tutor response
                const tutorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: response.data.answer,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, tutorMessage]);

                // Save to chat store
                addStoredMessage({
                    type: 'ai',
                    content: response.data.answer,
                });

                // Auto-speak in voice mode
                if (isVoiceMode) {
                    speakText(response.data.answer);

                    // If continuous mode, wait for speech to finish then start listening again
                    if (isContinuousMode) {
                        // Wait for speech to complete before starting next recording
                        const utterance = speechSynthesisRef.current;
                        if (utterance) {
                            utterance.onend = () => {
                                if (shouldContinueListeningRef.current) {
                                    setIsWaitingForSpeech(true);
                                    setTimeout(() => {
                                        if (shouldContinueListeningRef.current) {
                                            startRecording();
                                        }
                                    }, 1500);
                                }
                            };
                        }
                    }
                }
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: 'Sorry, there was an error processing your message. Please try again.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);

                if (isVoiceMode) {
                    speakText(errorMessage.text);
                }
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'tutor',
                text: 'Sorry, there was an error processing your message. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);

            if (isVoiceMode) {
                speakText(errorMessage.text);
            }
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

                // Automatically speak the transcription
                speakText(response.data.transcription);
            } else {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'tutor',
                    text: 'Sorry, there was an error processing your file. Please try again.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);

                // Speak error message
                speakText(errorMessage.text);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'tutor',
                text: 'Sorry, there was an error uploading your file. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);

            // Speak error message
            speakText(errorMessage.text);
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
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f8f8f5]">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

                <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen flex flex-col transition-all duration-300`}>
                    {/* Header */}
                    <header className="sticky top-0 z-20 bg-[#4A148CA4]/95 backdrop-blur-md px-4 lg:px-8 py-4 lg:py-6 text-white border-b border-white/10">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                                        <span className="material-symbols-outlined">menu</span>
                                    </button>
                                    <span className="material-symbols-outlined text-3xl lg:text-5xl text-[#f9f506]">school</span>
                                    <div>
                                        <h1 className="text-2xl lg:text-4xl font-bold">OgaTicha</h1>
                                        <p className="hidden lg:block text-white/80 mt-1">
                                            {isVoiceMode
                                                ? (isContinuousMode ? '🎤 Continuous Conversation Active' : '🎤 Voice Mode Active')
                                                : 'Get instant help with your studies'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <button
                                        onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
                                        className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all bg-white/20 hover:bg-white/30 text-white"
                                        title="Chat History"
                                    >
                                        <span className="material-symbols-outlined">history</span>
                                        <span className="hidden lg:inline">History</span>
                                    </button>
                                    {isSpeaking && (
                                        <button
                                            onClick={stopSpeaking}
                                            className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all bg-red-500 hover:bg-red-600 text-white"
                                            title="Stop Voice"
                                        >
                                            <span className="material-symbols-outlined">stop_circle</span>
                                            <span className="hidden lg:inline">Stop</span>
                                        </button>
                                    )}
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
                                            {msg.sender === 'tutor' ? 'Oga Ticha' : 'You'}
                                        </p>
                                        <div
                                            className={`rounded-2xl p-4 lg:p-5 shadow-sm ${msg.sender === 'tutor'
                                                ? 'bg-white rounded-tl-none border border-gray-200'
                                                : 'bg-[#4a148c] text-white rounded-tr-none shadow-md max-w-2xl'
                                                }`}
                                        >
                                            <div className={`text-base lg:text-lg ${msg.sender === 'tutor' ? 'text-[#181811]' : ''
                                                }`}>
                                                {msg.sender === 'tutor' ? formatMessage(msg.text) : <p className="whitespace-pre-wrap">{msg.text}</p>}
                                            </div>

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

                {/* Chat History Sidebar */}
                {isChatHistoryOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setIsChatHistoryOpen(false)}
                    />
                )}
                <aside className={`fixed top-0 right-0 h-screen w-80 bg-white border-l-2 border-gray-200 flex flex-col z-50 transition-transform duration-300 ${isChatHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Header */}
                    <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#181811]">Chat History</h2>
                        <button
                            onClick={() => setIsChatHistoryOpen(false)}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <div className="p-4 border-b-2 border-gray-200">
                        <button
                            onClick={async () => {
                                if (user?.id) {
                                    await createNewSession(user.id, 'New Chat');
                                    setIsChatHistoryOpen(false);
                                }
                            }}
                            className="w-full px-4 py-3 bg-[#f9f506] hover:bg-[#e6e205] rounded-xl font-semibold text-[#181811] flex items-center justify-center gap-2 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            New Chat
                        </button>
                    </div>

                    {/* Sessions List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {sessions.length === 0 ? (
                            <div className="text-center text-gray-500 mt-8">
                                <span className="material-symbols-outlined text-4xl mb-2">chat_bubble_outline</span>
                                <p className="text-sm">No chat history yet</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => {
                                        loadSession(session.id);
                                        setIsChatHistoryOpen(false);
                                    }}
                                    className={`group relative p-3 rounded-xl cursor-pointer transition-all ${currentSession?.id === session.id
                                        ? 'bg-[#f9f506]/20 border-2 border-[#f9f506]'
                                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-semibold text-[#181811] text-sm truncate flex-1">
                                            {session.title}
                                        </h3>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newTitle = prompt('Enter new title:', session.title);
                                                    if (newTitle && newTitle.trim() && newTitle !== session.title) {
                                                        updateSessionTitle(session.id, newTitle.trim());
                                                    }
                                                }}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                title="Rename"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Are you sure you want to delete this chat?')) {
                                                        deleteSession(session.id);
                                                    }
                                                }}
                                                className="p-1 hover:bg-red-100 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-sm text-red-600">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">chat</span>
                                            {session.messages?.length || 0} messages
                                        </span>
                                        <span>
                                            {new Date(session.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </ProtectedRoute>
    );
}
