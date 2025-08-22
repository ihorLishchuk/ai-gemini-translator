import React from "react";
import { LANGUAGES } from "../helpers";
import { SwapIcon } from "./icons";
import { UseTranslationReturn } from "../hooks/useTranslation";
import { UseLanguageSwapReturn } from "../hooks/useLanguageSwap";

const LanguageSelector: React.FC<Partial<UseTranslationReturn> & Partial<UseLanguageSwapReturn> & any> =  ({
     sourceLanguage,
     targetLanguage,
     setSourceLanguage,
     setTargetLanguage,
     swapLanguages,
     inputText,
     translatedText,
     setInputText,
     setTranslatedText
}) => {
    const handleSwapLanguages = () => {
        swapLanguages(inputText, translatedText, setInputText, setTranslatedText);
    };

    return (
        <div className="flex gap-4 mb-4 items-center">
            <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="flex-1 p-2 pr-8 border border-gray-300 rounded-lg text-base"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>

            <button
                onClick={handleSwapLanguages}
                className="p-2 bg-transparent border border-gray-300 rounded-lg cursor-pointer text-gray-500 flex items-center justify-center transition-all hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400 w-10 h-10"
                title="Swap languages"
            >
                <SwapIcon className="w-5 h-5" />
            </button>

            <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="flex-1 p-2 pr-8 border border-gray-300 rounded-lg text-base"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelector;
