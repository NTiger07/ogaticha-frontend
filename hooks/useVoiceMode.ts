import { useEffect, useState, useRef } from 'react';

interface VoiceModeOptions {
  text: string;
  rate?: number;
  pitch?: number;
}

interface SpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  continuous?: boolean;
  language?: string;
}

export function useVoiceMode(enabled: boolean) {
  const recognitionRef = useRef<any>(null);

  // Check if speech recognition is supported
  const isSpeechRecognitionSupported = () => {
    if (typeof window === 'undefined') return false;
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // Speak text using Web Speech API
  const speak = (options: VoiceModeOptions) => {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(options.text);
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Voice mode error:', error);
    }
  };

  // Announce UI updates for accessibility
  const announce = (text: string) => {
    if (!enabled) return;

    speak({
      text,
      rate: 1,
      pitch: 1,
    });
  };

  // Start speech recognition
  const startListening = (options: SpeechRecognitionOptions) => {
    if (!enabled || !isSpeechRecognitionSupported()) {
      options.onError?.('Speech recognition is not supported in this browser');
      return;
    }

    try {
      // Stop any existing recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Create new recognition instance
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = false;
      recognition.lang = options.language ?? 'en-US';

      recognition.onstart = () => {
        options.onStart?.();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        options.onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        options.onError?.(event.error);
      };

      recognition.onend = () => {
        options.onEnd?.();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      options.onError?.('Failed to start speech recognition');
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return { 
    speak, 
    announce, 
    startListening, 
    stopListening,
    isSpeechRecognitionSupported: isSpeechRecognitionSupported()
  };
}
