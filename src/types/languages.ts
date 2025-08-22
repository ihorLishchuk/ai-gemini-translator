export const LANGUAGES = [
    { code: "en",  name: "English" },
    { code: "de",  name: "German" },
    { code: "ukr", name: "Ukrainian" },
    { code: "ru",  name: "Russian" },
    { code: "auto", name: "Detect Language" },
] as const;

export type AppLang = typeof LANGUAGES[number]["code"];

export const TESS_KNOWN: Record<string, string> = {
    en: "eng",
    de: "deu",
    ru: "rus",
    ukr: "ukr",
};
