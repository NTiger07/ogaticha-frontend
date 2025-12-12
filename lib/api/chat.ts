import { API_CONFIG, getApiUrl } from "./config";
import type {
  ChatSession,
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionsResponse,
  GetSessionResponse,
  UpdateSessionRequest,
  UpdateSessionResponse,
  DeleteSessionResponse,
  ChatMessage,
  APIError,
} from "../types/api";

// Create a new chat session
export async function createChatSession(
  userId: string,
  title?: string
): Promise<ChatSession | null> {
  try {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.CHAT_SESSIONS),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          title: title || "New Chat",
        } as CreateSessionRequest),
      }
    );

    if (!response.ok) {
      const error: APIError = await response.json();
      console.error("Failed to create session:", error);
      // Fallback to local session
      return createLocalSession(userId, title);
    }

    const data: CreateSessionResponse = await response.json();
    return data.session;
  } catch (error) {
    console.error(
      "Error creating chat session (CORS or network issue):",
      error
    );
    // Fallback to local session if backend fails
    return createLocalSession(userId, title);
  }
}

// Helper function to create local session (fallback when backend unavailable)
function createLocalSession(userId: string, title?: string): ChatSession {
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    title: title || "New Chat",
    messages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Get all chat sessions for a user
export async function getChatSessions(
  userId: string
): Promise<ChatSession[] | null> {
  try {
    // TODO: Backend endpoint not yet implemented
    // Return empty array - sessions stored in localStorage via Zustand
    return [];

    /* Uncomment when backend is ready:
    const response = await fetch(
      `${getApiUrl(API_CONFIG.ENDPOINTS.CHAT_SESSIONS)}?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error: APIError = await response.json();
      console.error("Failed to get sessions:", error);
      return null;
    }

    const data: GetSessionsResponse = await response.json();
    return data.sessions;
    */
  } catch (error) {
    console.error("Error getting chat sessions:", error);
    return null;
  }
}

// Get a specific chat session
export async function getChatSession(
  sessionId: string
): Promise<ChatSession | null> {
  try {
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.CHAT_SESSION, sessionId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error: APIError = await response.json();
      console.error("Failed to get session:", error);
      return null;
    }

    const data: GetSessionResponse = await response.json();
    return data.session;
  } catch (error) {
    console.error("Error getting chat session:", error);
    return null;
  }
}

// Update a chat session (add messages or change title)
export async function updateChatSession(
  sessionId: string,
  messages?: ChatMessage[],
  title?: string
): Promise<ChatSession | null> {
  try {
    // TODO: Backend endpoint not yet implemented
    // Updates handled locally via Zustand store
    return null;

    /* Uncomment when backend is ready:
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.CHAT_SESSION, sessionId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          messages,
          title,
        } as UpdateSessionRequest),
      }
    );

    if (!response.ok) {
      const error: APIError = await response.json();
      console.error("Failed to update session:", error);
      return null;
    }

    const data: UpdateSessionResponse = await response.json();
    return data.session;
    */
  } catch (error) {
    console.error("Error updating chat session:", error);
    return null;
  }
}

// Delete a chat session
export async function deleteChatSession(sessionId: string): Promise<boolean> {
  try {
    // TODO: Backend endpoint not yet implemented
    // Deletion handled locally via Zustand store
    return true;

    /* Uncomment when backend is ready:
    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.CHAT_SESSION, sessionId),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error: APIError = await response.json();
      console.error("Failed to delete session:", error);
      return false;
    }

    const data: DeleteSessionResponse = await response.json();
    return data.status === "success";
    */
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return false;
  }
}
