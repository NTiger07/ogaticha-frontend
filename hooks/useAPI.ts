// React Hooks for API Calls

import { useState, useCallback } from "react";
import {
  registerUser,
  askAI,
  uploadNote,
  sendVoiceCommand,
  downloadOfflinePack,
} from "../lib/api";
import type {
  RegisterRequest,
  AskAIResponse,
  UploadNoteResponse,
  VoiceCommandResponse,
  DownloadOfflinePackResponse,
} from "../lib/types/api";

export type SubjectType =
  | "general"
  | "physics"
  | "biology"
  | "chemistry"
  | "mathematics"
  | "english";

// Generic hook state interface
interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const [state, setState] = useState<UseAPIState<{ message: string }>>({
    data: null,
    loading: false,
    error: null,
  });

  const register = useCallback(async (data: RegisterRequest) => {
    setState({ data: null, loading: true, error: null });

    const result = await registerUser(data);

    if (result.success) {
      setState({ data: result.data, loading: false, error: null });
      return true;
    } else {
      setState({ data: null, loading: false, error: result.error });
      return false;
    }
  }, []);

  return { ...state, register };
}

/**
 * Hook for asking AI questions
 */
export function useAskAI() {
  const [state, setState] = useState<UseAPIState<AskAIResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const ask = useCallback(async (question: string, userId?: string) => {
    setState({ data: null, loading: true, error: null });

    const result = await askAI(question, userId);

    if (result.success) {
      setState({ data: result.data, loading: false, error: null });
      return result.data;
    } else {
      setState({ data: null, loading: false, error: result.error });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, ask, reset };
}

/**
 * Hook for uploading notes
 */
export function useUploadNote() {
  const [state, setState] = useState<UseAPIState<UploadNoteResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const upload = useCallback(async (file: File, userId?: string) => {
    setState({ data: null, loading: true, error: null });

    const result = await uploadNote(file, userId);

    if (result.success) {
      setState({ data: result.data, loading: false, error: null });
      return result.data;
    } else {
      setState({ data: null, loading: false, error: result.error });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, upload, reset };
}

/**
 * Hook for voice commands
 */
export function useVoiceCommand() {
  const [state, setState] = useState<UseAPIState<VoiceCommandResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const sendCommand = useCallback(async (audioFile: File) => {
    setState({ data: null, loading: true, error: null });

    const result = await sendVoiceCommand(audioFile);

    if (result.success) {
      setState({ data: result.data, loading: false, error: null });
      return result.data;
    } else {
      setState({ data: null, loading: false, error: result.error });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, sendCommand, reset };
}

/**
 * Hook for downloading offline packs
 */
export function useOfflinePack() {
  const [state, setState] = useState<UseAPIState<DownloadOfflinePackResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const download = useCallback(async (subject: SubjectType = "general") => {
    setState({ data: null, loading: true, error: null });

    const result = await downloadOfflinePack(subject);

    if (result.success) {
      setState({ data: result.data, loading: false, error: null });
      return result.data;
    } else {
      setState({ data: null, loading: false, error: result.error });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, download, reset };
}
