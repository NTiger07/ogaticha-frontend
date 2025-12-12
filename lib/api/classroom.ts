// Classroom/AI Tutor API Functions

import {
  API_CONFIG,
  getApiUrl,
  validateImageFile,
  validateAudioFile,
  validateFileSize,
} from "./config";
import {
  AskAIRequest,
  AskAIResponse,
  UploadNoteResponse,
  VoiceCommandResponse,
  APIError,
  APIResponse,
} from "../types/api";

/**
 * Ask AI a text question
 */
export async function askAI(
  question: string,
  userId?: string
): Promise<APIResponse<AskAIResponse>> {
  try {
    const requestData: AskAIRequest = {
      question,
      ...(userId && { user_id: userId }),
    };

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ASK_AI), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to get AI response",
      };
    }

    return {
      success: true,
      data: responseData as AskAIResponse,
    };
  } catch (error) {
    console.error("Ask AI error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Upload an image note for transcription
 */
export async function uploadNote(
  file: File,
  userId?: string
): Promise<APIResponse<UploadNoteResponse>> {
  try {
    // Validate file
    if (!validateFileSize(file)) {
      return {
        success: false,
        error: `File size exceeds maximum limit of ${
          API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
        }MB`,
      };
    }

    if (!validateImageFile(file)) {
      return {
        success: false,
        error:
          "Invalid file type. Please upload a PNG, JPG, JPEG, GIF, or BMP image.",
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    if (userId) {
      formData.append("user_id", userId);
    }

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_NOTE), {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to process note",
      };
    }

    return {
      success: true,
      data: responseData as UploadNoteResponse,
    };
  } catch (error) {
    console.error("Upload note error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Send voice command (audio input/output)
 */
export async function sendVoiceCommand(
  audioFile: File
): Promise<APIResponse<VoiceCommandResponse>> {
  try {
    // Validate file
    if (!validateFileSize(audioFile)) {
      return {
        success: false,
        error: `File size exceeds maximum limit of ${
          API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
        }MB`,
      };
    }

    if (!validateAudioFile(audioFile)) {
      return {
        success: false,
        error:
          "Invalid file type. Please upload an MP3, WAV, M4A, or OGG audio file.",
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", audioFile);

    const response = await fetch(
      getApiUrl(API_CONFIG.ENDPOINTS.VOICE_COMMAND),
      {
        method: "POST",
        body: formData,
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = responseData as APIError;
      return {
        success: false,
        error: errorData.error || "Failed to process voice command",
      };
    }

    return {
      success: true,
      data: responseData as VoiceCommandResponse,
    };
  } catch (error) {
    console.error("Voice command error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Record audio from microphone
 * Returns a promise that resolves with the recorded audio file
 */
export async function recordAudio(
  durationMs: number = 5000
): Promise<File | null> {
  try {
    // Check if browser supports MediaRecorder
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Audio recording not supported in this browser");
    }

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Determine the best supported audio format
    let mimeType = "audio/webm";
    const supportedTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
      "audio/mpeg",
    ];

    for (const type of supportedTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }

    // Create MediaRecorder with supported format
    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    const audioChunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // Create blob with the recorded MIME type
        const audioBlob = new Blob(audioChunks, {
          type: mediaRecorder.mimeType,
        });

        // Determine file extension based on MIME type
        // Use .ogg for webm/ogg to ensure backend compatibility
        let extension = "ogg";
        let fileType = mediaRecorder.mimeType;

        if (mediaRecorder.mimeType.includes("mp4")) {
          extension = "mp4";
        } else if (mediaRecorder.mimeType.includes("ogg")) {
          extension = "ogg";
        } else if (mediaRecorder.mimeType.includes("mpeg")) {
          extension = "mp3";
        } else if (mediaRecorder.mimeType.includes("webm")) {
          // Use .ogg extension for webm files as they're compatible
          extension = "ogg";
          fileType = "audio/ogg";
        }

        const audioFile = new File(
          [audioBlob],
          `recording_${Date.now()}.${extension}`,
          { type: fileType }
        );

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        resolve(audioFile);
      };

      mediaRecorder.onerror = (error) => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        reject(error);
      };

      // Start recording
      mediaRecorder.start();

      // Stop after duration
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, durationMs);
    });
  } catch (error) {
    console.error("Audio recording error:", error);
    return null;
  }
}
