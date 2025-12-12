// Example AI Chat Component - Can be integrated into classroom page
// This demonstrates full API integration with text, voice, and image upload
// Now with chat session persistence

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAskAI, useUploadNote } from '@/hooks/useAPI';
import { useChatStore } from '@/lib/store/chatStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function AIChat() {
    const [question, setQuestion] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(true); // Voice mode is default

    // API hooks
    const { loading: textLoading, error: textError, ask } = useAskAI();
    const { loading: uploadLoading, error: uploadError, upload } = useUploadNote();

    // Store hooks
    const { user } = useAuthStore();
    const {
        messages,
        currentSession,
        isLoading: sessionLoading,
        addMessage,
        createNewSession,
        loadSessions,
    } = useChatStore();

    const userId = user?.id || '';
    const chatId = currentSession?.id || '';

    // Format markdown-style text to JSX
    const formatMessage = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactElement[] = [];
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

    // Initialize: load sessions
    useEffect(() => {
        if (userId) {
            loadSessions(userId);
        }
    }, [userId, loadSessions]);

    // Handle text question
    const handleAskQuestion = async () => {
        if (!question.trim() || !chatId) return;

        // Add user message to store
        addMessage({
            type: 'user',
            content: question,
        });

        const response = await ask(question, chatId);

        if (response) {
            // Add AI response to store
            addMessage({
                type: 'ai',
                content: response.answer,
            });
        }

        setQuestion('');
    };

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !chatId) return;

        // Add user message to store
        addMessage({
            type: 'user',
            content: `📷 Uploaded image: ${file.name}`,
        });

        const response = await upload(file, chatId);

        if (response) {
            // Add AI transcription to store
            addMessage({
                type: 'ai',
                content: response.transcription,
            });
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle voice recording using Web Speech API
    const handleVoiceRecord = async () => {
        // Check if speech recognition is supported
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        setIsRecording(true);

        try {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = async (event: any) => {
                const transcript = event.results[0][0].transcript;
                setIsRecording(false);

                // Add user message with transcribed text to store
                addMessage({
                    type: 'user',
                    content: transcript,
                });

                // Send transcribed text to AI
                const response = await ask(transcript, chatId);

                if (response) {
                    // Add AI response to store
                    addMessage({
                        type: 'ai',
                        content: response.answer,
                    });
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);

                let errorText = 'Failed to record speech.';
                if (event.error === 'not-allowed') {
                    errorText = 'Please allow microphone access.';
                } else if (event.error === 'no-speech') {
                    errorText = 'No speech detected.';
                }
                alert(errorText);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
        } catch (error) {
            setIsRecording(false);
            alert('Speech recognition is not available. Please try typing your message.');
        }
    };

    const isLoading = textLoading || uploadLoading;
    const error = textError || uploadError;

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <div className="inline-block p-6 bg-[#f9f506]/10 rounded-full mb-6">
                            <span className="material-symbols-outlined text-8xl text-[#f9f506]">mic</span>
                        </div>
                        <p className="text-2xl font-bold text-[#181811] mb-2">Voice Mode Active</p>
                        <p className="text-lg text-gray-600">Tap the microphone below to speak</p>
                        <p className="text-sm text-gray-500 mt-4">You can also type or upload images</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={msg.id || idx}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl ${msg.type === 'user'
                                ? 'bg-[#f9f506] text-[#181811]'
                                : 'bg-white text-[#181811] border-2 border-gray-200'
                                }`}
                        >
                            <div className="whitespace-pre-wrap">
                                {msg.type === 'ai' ? formatMessage(msg.content) : msg.content}
                            </div>
                            <p className="text-xs opacity-60 mt-2">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl border-2 border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                <span>Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mx-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Input Area */}
            <div className="border-t-2 border-gray-200 p-4 bg-white">
                {isVoiceMode ? (
                    /* Voice Mode Interface */
                    <div className="flex flex-col items-center gap-4">
                        {/* Voice Status Indicator */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Voice Mode</span>
                            <button
                                onClick={() => setIsVoiceMode(false)}
                                className="ml-2 text-xs text-blue-600 hover:underline"
                            >
                                Switch to typing
                            </button>
                        </div>

                        {/* Large Tap to Speak Button */}
                        <button
                            onClick={handleVoiceRecord}
                            disabled={isLoading || isRecording}
                            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl disabled:opacity-50 ${isRecording
                                ? 'bg-red-500 animate-pulse scale-110'
                                : 'bg-[#f9f506] hover:bg-[#e6e205] hover:scale-105 active:scale-95'
                                }`}
                            title="Tap to speak"
                        >
                            <span className="material-symbols-outlined text-5xl">
                                {isRecording ? 'stop' : 'mic'}
                            </span>
                            <span className="text-xs font-semibold mt-1">
                                {isRecording ? 'Listening...' : 'Tap to Speak'}
                            </span>
                        </button>

                        {/* Secondary Actions */}
                        <div className="flex gap-3">
                            {/* Image Upload Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-2 transition-colors disabled:opacity-50 text-sm"
                                title="Upload image"
                            >
                                <span className="material-symbols-outlined text-lg">image</span>
                                <span>Upload</span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                    </div>
                ) : (
                    /* Text Mode Interface */
                    <div>
                        {/* Mode Toggle */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-xs text-gray-600">Typing Mode</span>
                            <button
                                onClick={() => setIsVoiceMode(true)}
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">mic</span>
                                Switch to voice
                            </button>
                        </div>

                        <div className="flex items-end gap-2">
                            {/* Text Input */}
                            <div className="flex-1">
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAskQuestion();
                                        }
                                    }}
                                    placeholder="Type your question here..."
                                    rows={2}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-[#f8f8f5] text-[#181811] focus:border-[#f9f506] focus:ring-2 focus:ring-[#f9f506]/20 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {/* Image Upload Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                                    title="Upload image"
                                >
                                    <span className="material-symbols-outlined">image</span>
                                </button>

                                {/* Send Button */}
                                <button
                                    onClick={handleAskQuestion}
                                    disabled={isLoading || !question.trim()}
                                    className="w-12 h-12 rounded-full bg-[#f9f506] hover:bg-[#e6e205] flex items-center justify-center transition-colors disabled:opacity-50"
                                    title="Send message"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>

                        {/* Help Text */}
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Press Enter to send • Shift+Enter for new line
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
