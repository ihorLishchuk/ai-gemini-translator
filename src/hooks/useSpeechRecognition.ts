import { useState, useEffect } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  startListening: (onTranscript: (transcript: string) => void) => void;
  error: string;
  setError: (error: string) => void;
}

export const useSpeechRecognition = (sourceLanguage: string): UseSpeechRecognitionReturn => {
  const [recognition, setRecognition] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = sourceLanguage;
      setRecognition(recognitionInstance);
    }
  }, [sourceLanguage]);

  const startListening = (onTranscript: (transcript: string) => void) => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      setIsListening(true);
      setError('');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
    }
  };

  return {
    isListening,
    startListening,
    error,
    setError,
  };
}; 