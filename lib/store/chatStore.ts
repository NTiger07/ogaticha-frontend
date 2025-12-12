import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatMessage, ChatSession } from "../types/api";
import {
  createChatSession,
  getChatSessions,
  getChatSession,
  updateChatSession,
  deleteChatSession,
} from "../api/chat";

interface ChatState {
  // Current session
  currentSession: ChatSession | null;
  messages: ChatMessage[];

  // All sessions
  sessions: ChatSession[];

  // UI state
  isLoading: boolean;
  error: string | null;
  isSidebarOpen: boolean;

  // Actions
  createNewSession: (
    userId: string,
    title?: string
  ) => Promise<ChatSession | null>;
  loadSessions: (userId: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  saveSession: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearCurrentSession: () => void;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      messages: [],
      sessions: [],
      isLoading: false,
      error: null,
      isSidebarOpen: false,

      // Create a new chat session
      createNewSession: async (userId: string, title?: string) => {
        set({ isLoading: true, error: null });
        try {
          const session = await createChatSession(userId, title);
          if (session) {
            set({
              currentSession: session,
              messages: session.messages || [],
              sessions: [session, ...get().sessions],
              isLoading: false,
            });
            return session;
          } else {
            set({
              error: "Failed to create chat session",
              isLoading: false,
            });
            return null;
          }
        } catch (error) {
          set({
            error: "Error creating chat session",
            isLoading: false,
          });
          return null;
        }
      },

      // Load all sessions for a user
      loadSessions: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const sessions = await getChatSessions(userId);
          if (sessions) {
            set({
              sessions: sessions.sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              ),
              isLoading: false,
            });
          } else {
            set({
              error: "Failed to load chat sessions",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Error loading chat sessions",
            isLoading: false,
          });
        }
      },

      // Load a specific session
      loadSession: async (sessionId: string) => {
        set({ isLoading: true, error: null });
        try {
          const session = await getChatSession(sessionId);
          if (session) {
            set({
              currentSession: session,
              messages: session.messages || [],
              isLoading: false,
            });
          } else {
            set({
              error: "Failed to load chat session",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Error loading chat session",
            isLoading: false,
          });
        }
      },

      // Save current session to backend
      saveSession: async () => {
        const { currentSession, messages } = get();
        if (!currentSession) return;

        try {
          const updatedSession = await updateChatSession(
            currentSession.id,
            messages
          );

          if (updatedSession) {
            set((state) => ({
              currentSession: updatedSession,
              sessions: state.sessions.map((s) =>
                s.id === updatedSession.id ? updatedSession : s
              ),
            }));
          }
        } catch (error) {
          console.error("Error saving session:", error);
        }
      },

      // Delete a session
      deleteSession: async (sessionId: string) => {
        set({ isLoading: true, error: null });
        try {
          const success = await deleteChatSession(sessionId);
          if (success) {
            set((state) => ({
              sessions: state.sessions.filter((s) => s.id !== sessionId),
              currentSession:
                state.currentSession?.id === sessionId
                  ? null
                  : state.currentSession,
              messages:
                state.currentSession?.id === sessionId ? [] : state.messages,
              isLoading: false,
            }));
          } else {
            set({
              error: "Failed to delete chat session",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "Error deleting chat session",
            isLoading: false,
          });
        }
      },

      // Add a message to the current session
      addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => {
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          ...message,
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        // Auto-save after adding message (debounced in practice)
        setTimeout(() => {
          get().saveSession();
        }, 1000);
      },

      // Clear current session (start fresh without creating new)
      clearCurrentSession: () => {
        set({
          currentSession: null,
          messages: [],
        });
      },

      // Clear messages in current session
      clearMessages: () => {
        set({ messages: [] });
      },

      // Update session title
      updateSessionTitle: async (sessionId: string, title: string) => {
        try {
          const updatedSession = await updateChatSession(
            sessionId,
            undefined,
            title
          );

          if (updatedSession) {
            set((state) => ({
              currentSession:
                state.currentSession?.id === sessionId
                  ? updatedSession
                  : state.currentSession,
              sessions: state.sessions.map((s) =>
                s.id === updatedSession.id ? updatedSession : s
              ),
            }));
          }
        } catch (error) {
          console.error("Error updating session title:", error);
        }
      },

      // Set error message
      setError: (error: string | null) => {
        set({ error });
      },

      // Toggle sidebar
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSession: state.currentSession,
        messages: state.messages,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
