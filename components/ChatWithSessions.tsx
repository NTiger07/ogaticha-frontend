'use client';

import AIChat from './AIChat';
import ChatSessionSidebar from './ChatSessionSidebar';

export default function ChatWithSessions() {
    return (
        <div className="flex h-screen bg-[#f8f8f5]">
            {/* Sidebar */}
            <ChatSessionSidebar />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <AIChat />
            </div>
        </div>
    );
}
