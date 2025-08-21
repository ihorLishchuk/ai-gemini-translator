export type TranslationRecord = {
    id?: number;
    sourceText: string;
    translatedText: string;
    fromLang: string;
    toLang: string;
    model?: string;
    prompt?: string;
    createdAt: number;
};
