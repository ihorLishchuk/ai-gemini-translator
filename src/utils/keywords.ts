import { getStopwords, guessLangFromText } from "./stopwords";

export type Keyword = { word: string; count: number };

export function extractKeywords(
    raw: string,
    opts?: { lang?: string; minLen?: number; max?: number }
): Keyword[] {
    const lang = opts?.lang && opts.lang !== "auto" ? opts.lang : guessLangFromText(raw);
    const stop = getStopwords(lang);
    const minLen = opts?.minLen ?? 3;
    const max = opts?.max ?? 50;

    // нормалізація
    const tokens = raw
        .toLowerCase()
        .replace(/[^\p{L}\p{M}'-]+/gu, " ")
        .split(/\s+/)
        .map(t => t.trim())
        .filter(t => t.length >= minLen && !stop.has(t) && !/^\p{N}+$/u.test(t));

    const freq = new Map<string, number>();
    for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
    //@ts-ignore
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, max)
        .map(([word, count]) => ({ word, count }));
}
