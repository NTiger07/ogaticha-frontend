import { useEffect } from 'react';

interface VoiceModeOptions {
  text: string;
  rate?: number;
  pitch?: number;
}

export function useVoiceMode(enabled: boolean) {
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

  // Listen for voice commands (simplified - can be extended)
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('webkitSpeechRecognition' in window && 'SpeechRecognition' in window)) {
      return;
    }

    // Voice commands feature can be extended here
    // For now, we'll keep it simple with just TTS functionality
  }, [enabled]);

  return { speak, announce };
}
