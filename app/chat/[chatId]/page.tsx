'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatWithSessions from '@/components/ChatWithSessions';
import { useChatStore } from '@/lib/store/chatStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function ChatSessionPage() {
    const params = useParams();
    const router = useRouter();
    const chatId = params?.chatId as string;
    const { user } = useAuthStore();
    const { loadSession, currentSession, isLoading, error } = useChatStore();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeChat = async () => {
            if (!chatId || !user?.id) {
                setIsInitializing(false);
                return;
            }

            setIsInitializing(true);
            await loadSession(chatId);
            setIsInitializing(false);
        };

        initializeChat();
    }, [chatId, user?.id, loadSession]);

    // Handle errors or invalid session
    useEffect(() => {
        if (!isInitializing && !isLoading && !currentSession && chatId) {
            // Session not found or failed to load, redirect to main chat
            router.push('/chat');
        }
    }, [isInitializing, isLoading, currentSession, chatId, router]);

    if (isInitializing || isLoading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center h-screen bg-[#f8f8f5]">
                    <div className="text-center">
                        <div className="inline-block w-16 h-16 border-4 border-[#f9f506] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl font-semibold text-[#181811]">Loading chat session...</p>
                        <p className="text-sm text-gray-600 mt-2">Please wait while we fetch your conversation</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center h-screen bg-[#f8f8f5]">
                    <div className="text-center max-w-md p-8 bg-white rounded-2xl border-2 border-red-200">
                        <span className="material-symbols-outlined text-6xl text-red-600 mb-4">error</span>
                        <h2 className="text-2xl font-bold text-[#181811] mb-2">Failed to Load Chat</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/chat')}
                            className="px-6 py-3 bg-[#f9f506] hover:bg-[#e6e205] rounded-xl font-semibold text-[#181811] transition-colors"
                        >
                            Return to Chats
                        </button>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <ChatWithSessions />
        </ProtectedRoute>
    );
}
