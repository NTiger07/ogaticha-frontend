// API Type Definitions for OgaTicha Backend

export type DisabilityType = "visual" | "hearing" | "none";
export type PreferredMode = "text" | "audio" | "visual";
export type UserRole = "student" | "teacher";

// ========== Authentication Types ==========

export interface RegisterRequest {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
  disability_type?: DisabilityType;
  preferred_mode?: PreferredMode;
}

export interface RegisterResponse {
  message: string;
  status: "success";
}

export interface AuthErrorResponse {
  error: string;
}

// ========== Classroom/AI Tutor Types ==========

export interface AskAIRequest {
  question: string;
  user_id?: string;
}

export interface AskAIResponse {
  status: "success";
  answer: string;
  adapted_for: DisabilityType;
}

export interface UploadNoteRequest {
  file: File;
  user_id?: string;
}

export interface UploadNoteResponse {
  status: "success";
  transcription: string;
  adapted_for: DisabilityType;
}

export interface VoiceCommandRequest {
  file: File;
}

export interface VoiceCommandResponse {
  status: "success";
  user_said: string;
  ai_text: string;
  ai_audio_url: string;
}

// ========== Sync/Offline Types ==========

export interface Definition {
  term: string;
  definition: string;
}

export interface Note {
  title: string;
  content: string;
  type: string;
}

export interface OfflinePackMetadata {
  subject: string;
  version: string;
  description: string;
}

export interface DownloadOfflinePackResponse {
  metadata: OfflinePackMetadata;
  definitions: Definition[];
  notes: Note[];
}

// ========== Chat Session Types ==========

export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface CreateSessionRequest {
  user_id: string;
  title?: string;
}

export interface CreateSessionResponse {
  status: "success";
  session: ChatSession;
}

export interface GetSessionsResponse {
  status: "success";
  sessions: ChatSession[];
}

export interface GetSessionResponse {
  status: "success";
  session: ChatSession;
}

export interface UpdateSessionRequest {
  session_id: string;
  messages?: ChatMessage[];
  title?: string;
}

export interface UpdateSessionResponse {
  status: "success";
  session: ChatSession;
}

export interface DeleteSessionResponse {
  status: "success";
  message: string;
}

// ========== General Error Type ==========

export interface APIError {
  error: string;
}

// ========== API Response Wrapper ==========

export type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
