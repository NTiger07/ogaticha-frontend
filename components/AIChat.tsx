// Example AI Chat Component - Can be integrated into classroom page
// This demonstrates full API integration with text, voice, and image upload

'use client';

import { useState, useRef } from 'react';
import { useAskAI, useUploadNote, useVoiceCommand } from '@/hooks/useAPI';
import { recordAudio } from '@/lib/api';

export default function AIChat() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Array<{
        type: 'user' | 'ai';
        content: string;
        timestamp: Date;
    }>>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);

    // API hooks
    const { loading: textLoading, error: textError, ask } = useAskAI();
    const { loading: uploadLoading, error: uploadError, upload } = useUploadNote();
    const { loading: voiceLoading, error: voiceError, sendCommand } = useVoiceCommand();

    const userId = ''; // Get from auth context/localStorage

    // Handle text question
    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        // Add user message
        setMessages(prev => [...prev, {
            type: 'user',
            content: question,
            timestamp: new Date(),
        }]);

        const response = await ask(question, userId);

        if (response) {
            // Add AI response
            setMessages(prev => [...prev, {
                type: 'ai',
                content: response.answer,
                timestamp: new Date(),
            }]);
        }

        setQuestion('');
    };

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Add user message
        setMessages(prev => [...prev, {
            type: 'user',
            content: `📷 Uploaded image: ${file.name}`,
            timestamp: new Date(),
        }]);

        const response = await upload(file, userId);

        if (response) {
            // Add AI transcription
            setMessages(prev => [...prev, {
                type: 'ai',
                content: response.transcription,
                timestamp: new Date(),
            }]);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle voice recording
    const handleVoiceRecord = async () => {
        setIsRecording(true);

        // Record 5 seconds of audio
        const audioFile = await recordAudio(5000);
        setIsRecording(false);

        if (!audioFile) {
            alert('Failed to record audio. Please check microphone permissions.');
            return;
        }

        // Add user message
        setMessages(prev => [...prev, {
            type: 'user',
            content: '🎤 Voice message',
            timestamp: new Date(),
        }]);

        const response = await sendCommand(audioFile);

        if (response) {
            // Add what user said
            setMessages(prev => [...prev, {
                type: 'user',
                content: `You said: "${response.user_said}"`,
                timestamp: new Date(),
            }]);

            // Add AI response
            setMessages(prev => [...prev, {
                type: 'ai',
                content: response.ai_text,
                timestamp: new Date(),
            }]);

            // Play audio response
            const audio = new Audio(response.ai_audio_url);
            audio.play().catch(err => console.error('Audio playback error:', err));
        }
    };

    const isLoading = textLoading || uploadLoading || voiceLoading;
    const error = textError || uploadError || voiceError;

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <span className="material-symbols-outlined text-6xl mb-4">chat</span>
                        <p className="text-xl font-semibold">Ask me anything!</p>
                        <p className="text-sm mt-2">Type a question, upload an image, or use voice</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl ${msg.type === 'user'
                                    ? 'bg-[#f9f506] text-[#181811]'
                                    : 'bg-white text-[#181811] border-2 border-gray-200
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs opacity-60 mt-2">
                                {msg.timestamp.toLocaleTimeString()}
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
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {/* Voice Record Button */}
                        <button
                            onClick={handleVoiceRecord}
                            disabled={isLoading || isRecording}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${isRecording
                                    ? 'bg-red-500 animate-pulse'
                                    : 'bg-gray-200 hover:bg-gray-300
                                }`}
                            title="Record voice message"
                        >
                            <span className="material-symbols-outlined">
                                {isRecording ? 'stop' : 'mic'}
                            </span>
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
        </div>
    );
}
