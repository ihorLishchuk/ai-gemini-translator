import { useState } from 'react';

export interface UseLanguageSwapReturn {
  sourceLanguage: string;
  targetLanguage: string;
  setSourceLanguage: (language: string) => void;
  setTargetLanguage: (language: string) => void;
  swapLanguages: (inputText: string, translatedText: string, setInputText: (text: string) => void, setTranslatedText: (text: string) => void) => void;
}

export const useLanguageSwap = (): UseLanguageSwapReturn => {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('de');

  const swapLanguages = (
    inputText: string,
    translatedText: string,
    setInputText: (text: string) => void,
    setTranslatedText: (text: string) => void
  ) => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);

    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText('');
    }
  };

  return {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
  };
};
