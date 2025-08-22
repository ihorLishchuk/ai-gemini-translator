import React, {useEffect, useState} from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguageSwap } from '../hooks/useLanguageSwap';
import { speakText } from '../utils/speechSynthesis';
import { useHistorySlice } from "../store/useHistoryStore";
import { MicrophoneIcon, StopIcon, SpinnerIcon, PlayIcon } from './icons';
import LanguageSelector from './LanguageSelector';

const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');

  const { init } = useHistorySlice(({init}) => ({ init }));

  useEffect(() => {
    void init();
  }, [init]);

  const {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
  } = useLanguageSwap();

  const {
    translatedText,
    isTranslating,
    error: translationError,
    handleTranslate,
    setTranslatedText,
  } = useTranslation();

  const {
    isListening,
    startListening: startSpeechRecognition,
    error: speechError,
  } = useSpeechRecognition(sourceLanguage);

  const error = translationError || speechError;

  const handleStartListening = () => {
    startSpeechRecognition(setInputText);
  };

  const handleSpeakText = (text: string) => {
    speakText(text, targetLanguage);
  };

  const languageSelectorProps = {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
    inputText,
    translatedText,
    setInputText,
    setTranslatedText
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">AI Translator</h1>
      </div>

      <LanguageSelector {...languageSelectorProps} />

      <div className="relative mb-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate or click the microphone to speak..."
          className="w-full p-4 border border-gray-300 rounded-lg min-h-[150px] text-base resize-y"
        />
        <button
          onClick={handleStartListening}
          disabled={isListening}
          className={`absolute bottom-4 right-4 p-3 bg-blue-500 border-none rounded-full cursor-pointer text-white flex items-center justify-center transition-all shadow-md hover:bg-blue-600 hover:scale-105 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none ${
            isListening ? 'bg-red-500 animate-pulse hover:bg-red-600' : ''
          }`}
          title={isListening ? 'Listening... Click to stop' : 'Click to speak'}
        >
          {isListening ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
      </div>

      <button
        onClick={() => handleTranslate(inputText, sourceLanguage, targetLanguage)}
        disabled={isTranslating || !inputText.trim()}
        className="w-full mb-4 bg-blue-500 text-white p-3 border-none rounded-lg text-base cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isTranslating ? (
          <>
            <SpinnerIcon className="animate-spin w-5 h-5" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </button>

      {translatedText && (
        <div className="relative bg-gray-50 p-4 rounded-lg min-h-[150px] mt-4 mb-4">
          <p className="whitespace-pre-wrap m-0">{translatedText}</p>
          <button
            onClick={() => handleSpeakText(translatedText)}
            className="absolute bottom-4 right-4 p-2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <PlayIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
    </>
  );
};

export default Translator;
