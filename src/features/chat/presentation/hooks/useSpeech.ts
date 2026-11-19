import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';

const LANG = 'es-ES';

/**
 * Texto -> voz con el motor nativo del teléfono (expo-speech).
 * Funciona en Expo Go y no consume tokens de la IA.
 */
export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const stopSpeaking = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      language: LANG,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev) Speech.stop();
      return !prev;
    });
    setIsSpeaking(false);
  }, []);

  // Detener la voz si se sale de la pantalla
  useEffect(() => () => { Speech.stop(); }, []);

  return { isSpeaking, voiceEnabled, speak, stopSpeaking, toggleVoice };
};
