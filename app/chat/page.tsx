'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useChatStore } from '@/lib/store/chatStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function ChatPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { createNewSession, sessions, loadSessions } = useChatStore();

    useEffect(() => {
        const initializeChat = async () => {
            if (!user?.id) return;

            // Load existing sessions
            await loadSessions(user.id);

            // Check if there are any sessions
            if (sessions.length > 0) {
                // Redirect to the most recent session
                router.push(`/chat/${sessions[0].id}`);
            } else {
                // Create a new session and redirect to it
                const newSession = await createNewSession(user.id, 'New Chat');
                if (newSession) {
                    router.push(`/chat/${newSession.id}`);
                }
            }
        };

        initializeChat();
    }, [user?.id]);

    return (
        <ProtectedRoute>
            <div className="flex items-center justify-center h-screen bg-[#f8f8f5]">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-[#f9f506] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-xl font-semibold text-[#181811]">Initializing chat...</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
