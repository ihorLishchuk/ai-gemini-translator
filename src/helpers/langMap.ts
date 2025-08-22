import {AppLang, LANGUAGES, TESS_KNOWN} from "../types";

export const TESS_LANG_MAP: Partial<Record<AppLang, string>> = LANGUAGES
    .filter(l => l.code !== "auto")
    .reduce((acc, l) => {
        const code = l.code.toLowerCase();
        let tess = TESS_KNOWN[code];
        if (!tess && code.length === 3) tess = code;
        if (tess) acc[l.code] = tess;
        return acc;
    }, {} as Partial<Record<AppLang, string>>);

export function toTesseractLangs(langs: AppLang[] | AppLang): string {
    const arr = Array.isArray(langs) ? langs : [langs];
    const set = new Set<string>();
    for (const code of arr) {
        if (code === "auto") continue;
        const tess = TESS_LANG_MAP[code];
        if (tess) set.add(tess);
    }
    if (set.size === 0) set.add("eng");
    return Array.from(set).join("+");
}
