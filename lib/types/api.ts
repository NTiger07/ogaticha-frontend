// API Type Definitions for OgaTicha Backend

export type DisabilityType = "visual" | "hearing" | "none";
export type PreferredMode = "text" | "audio" | "visual";
export type UserRole = "student" | "lecturer";

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

// ========== Course/Lecture Types ==========

export interface CourseMaterial {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  extracted_text?: string;
  extraction_status?: "pending" | "processing" | "completed" | "failed";
  extraction_error?: string;
  word_count?: number;
  pages?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lecturer_id: string;
  lecturer_name?: string;
  student_emails: string[];
  materials: CourseMaterial[];
  created_at: string;
  updated_at: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  lecturer_id: string;
  student_emails?: string[];
}

export interface CreateCourseResponse {
  status: "success";
  course: Course;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  student_emails?: string[];
}

export interface UpdateCourseResponse {
  status: "success";
  course: Course;
}

export interface GetCoursesResponse {
  status: "success";
  courses: Course[];
}

export interface GetCourseResponse {
  status: "success";
  course: Course;
}

export interface AddStudentsToCourseRequest {
  student_emails: string[];
}

export interface AddStudentsToCourseResponse {
  status: "success";
  course: Course;
}

export interface UploadMaterialRequest {
  file: File;
  course_id: string;
}

export interface UploadMaterialResponse {
  status: "success";
  material: CourseMaterial;
}

export interface ProcessMaterialTextRequest {
  material_id: string;
  course_id: string;
  extracted_text: string;
  file_name: string;
  file_type: string;
  word_count?: number;
  pages?: number;
}

export interface ProcessMaterialTextResponse {
  status: "success";
  message: string;
  material_id: string;
}

export interface DeleteCourseResponse {
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
