import React from "react";
import { LANGUAGES } from "../helpers";
import { SwapIcon } from "./icons";
import { UseTranslationReturn } from "../hooks/useTranslation";
import { UseLanguageSwapReturn } from "../hooks/useLanguageSwap";

type Props = Partial<UseTranslationReturn> & Partial<UseLanguageSwapReturn> & any;

const LanguageSelector: React.FC<Props> = ({
   sourceLanguage,
   targetLanguage,
   setSourceLanguage,
   setTargetLanguage,
   swapLanguages,
   inputText,
   translatedText,
   setInputText,
   setTranslatedText,
}) => {
    const handleSwapLanguages = () => {
        swapLanguages(inputText, translatedText, setInputText, setTranslatedText);
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
            <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 pr-8 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-gray-800/20"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>

            <button
                onClick={handleSwapLanguages}
                className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-400 active:scale-[0.99] transition h-12 sm:h-10 sm:w-10"
                title="Swap languages"
            >
                <SwapIcon className="w-5 h-5" />
                <span className="sm:hidden ml-2 text-sm">Swap</span>
            </button>

            <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 pr-8 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-gray-800/20"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
