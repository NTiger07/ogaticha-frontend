'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useChatStore } from '@/lib/store/chatStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function ChatSessionSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuthStore();
    const {
        sessions,
        currentSession,
        isSidebarOpen,
        loadSessions,
        createNewSession,
        deleteSession,
        updateSessionTitle,
        toggleSidebar,
    } = useChatStore();

    const userId = user?.id || '';

    // Load sessions when component mounts
    useEffect(() => {
        if (userId) {
            loadSessions(userId);
        }
    }, [userId, loadSessions]);

    const handleNewChat = async () => {
        if (userId) {
            const session = await createNewSession(userId, 'New Chat');
            if (session) {
                router.push(`/chat/${session.id}`);
            }
        }
    };

    const handleLoadSession = (sessionId: string) => {
        router.push(`/chat/${sessionId}`);
    };

    const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this chat?')) {
            await deleteSession(sessionId);

            // If we deleted the current session, redirect to main chat
            if (currentSession?.id === sessionId) {
                router.push('/chat');
            }
        }
    };

    const handleRenameSession = async (sessionId: string, currentTitle: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newTitle = prompt('Enter new title:', currentTitle);
        if (newTitle && newTitle.trim() && newTitle !== currentTitle) {
            await updateSessionTitle(sessionId, newTitle.trim());
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    return (
        <>
            {/* Toggle Button (Mobile) */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-full bg-[#f9f506] hover:bg-[#e6e205] flex items-center justify-center shadow-lg"
                aria-label="Toggle chat history"
            >
                <span className="material-symbols-outlined">
                    {isSidebarOpen ? 'close' : 'history'}
                </span>
            </button>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed lg:relative top-0 left-0 h-full w-80 bg-white border-r-2 border-gray-200 
                    flex flex-col z-40 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="p-4 border-b-2 border-gray-200">
                    <button
                        onClick={handleNewChat}
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
                                onClick={() => handleLoadSession(session.id)}
                                className={`
                                    group relative p-3 rounded-xl cursor-pointer transition-all
                                    ${currentSession?.id === session.id
                                        ? 'bg-[#f9f506]/20 border-2 border-[#f9f506]'
                                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                    }
                                `}
                            >
                                {/* Session Title */}
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-semibold text-[#181811] text-sm truncate flex-1">
                                        {session.title}
                                    </h3>

                                    {/* Action Buttons */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleRenameSession(session.id, session.title, e)}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                            title="Rename"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteSession(session.id, e)}
                                            className="p-1 hover:bg-red-100 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-sm text-red-600">delete</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Message Count & Date */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">chat</span>
                                        {session.messages?.length || 0} messages
                                    </span>
                                    <span>{formatDate(session.updated_at)}</span>
                                </div>

                                {/* Preview of last message */}
                                {session.messages && session.messages.length > 0 && (
                                    <p className="text-xs text-gray-600 mt-1 truncate">
                                        {session.messages[session.messages.length - 1].content}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t-2 border-gray-200 text-xs text-gray-500 text-center">
                    {sessions.length} chat{sessions.length !== 1 ? 's' : ''}
                </div>
            </div>
        </>
    );
}
