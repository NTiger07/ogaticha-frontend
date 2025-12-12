// API Configuration

export const API_CONFIG = {
  // Base URLs
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ogaticha-backend-api.onrender.com",
  LOCAL_URL: "http://localhost:8080",

  // Endpoints
  ENDPOINTS: {
    // General
    HEALTH_CHECK: "/",
    TEST_DB: "/test-db",

    // Authentication
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",

    // User Profile
    UPDATE_PROFILE: "/api/user/update-all",
    UPDATE_SETTINGS: "/api/user/settings",
    UPDATE_USER: (userId: string) => `/api/auth/user/edit/${userId}`,

    // Classroom/AI Tutor
    ASK_AI: "/api/classroom/ask-ai",
    UPLOAD_NOTE: "/api/classroom/upload-note",
    VOICE_COMMAND: "/api/classroom/voice-command",

    // Chat Sessions
    CHAT_SESSIONS: "/api/chat",
    CHAT_SESSION: (sessionId: string) => `/api/chat/sessions/${sessionId}`,

    // Sync/Offline
    DOWNLOAD_PACK: "/api/sync/download-pack",
  },

  // Request configuration
  TIMEOUT: 30000, // 30 seconds

  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_FORMATS: [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/bmp",
  ],
  ACCEPTED_AUDIO_FORMATS: [
    "audio/mp3",
    "audio/wav",
    "audio/m4a",
    "audio/ogg",
    "audio/mpeg",
    "audio/webm",
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ],
};

// Get full API URL
export function getApiUrl(
  endpoint: string | ((param: string) => string),
  param?: string
): string {
  const path =
    typeof endpoint === "function" && param
      ? endpoint(param)
      : (endpoint as string);
  return `${API_CONFIG.BASE_URL}${path}`;
}

// Validate file size
export function validateFileSize(file: File): boolean {
  return file.size <= API_CONFIG.MAX_FILE_SIZE;
}

// Validate file type
export function validateImageFile(file: File): boolean {
  return API_CONFIG.ACCEPTED_IMAGE_FORMATS.includes(file.type);
}

export function validateAudioFile(file: File): boolean {
  // Check if the file type matches exactly or starts with accepted types
  return API_CONFIG.ACCEPTED_AUDIO_FORMATS.some(
    (format) =>
      file.type === format || file.type.startsWith(format.split(";")[0])
  );
}
