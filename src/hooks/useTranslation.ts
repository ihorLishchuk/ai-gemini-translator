import { useState } from 'react';
import { translateText } from '../helpers';
import {useHistorySlice} from "../store/useHistoryStore";

interface UseTranslationReturn {
  translatedText: string;
  isTranslating: boolean;
  error: string;
  setError: (error: string) => void;
  handleTranslate: (inputText: string, sourceLanguage: string, targetLanguage: string) => Promise<void>;
  setTranslatedText: (text: string) => void;
}

export const useTranslation = (): UseTranslationReturn => {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const { push } = useHistorySlice(({push}) => ({ push }));

  const handleTranslate = async (
    inputText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<void> => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      const translation = await translateText(inputText, sourceLanguage, targetLanguage);
      setTranslatedText(translation);
      await push({
        sourceText: inputText,
        translatedText: translation,
        fromLang: sourceLanguage,
        toLang: targetLanguage,
      });
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translatedText,
    isTranslating,
    error,
    setError,
    handleTranslate,
    setTranslatedText,
  };
};
