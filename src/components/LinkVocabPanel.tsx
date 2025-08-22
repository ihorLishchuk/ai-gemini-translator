import React, { useEffect, useMemo, useState } from "react";
import { extractKeywords, type Keyword } from "../utils/keywords";
import { useTranslation } from "../hooks/useTranslation";
import {useHistorySlice} from "../store/useHistoryStore";
import {useLanguageSwap} from "../hooks/useLanguageSwap";
import LanguageSelector from "./LanguageSelector";

async function fetchArticleText(url: string): Promise<string> {
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    const readerURL = `https://r.jina.ai/${u}`;
    const res = await fetch(readerURL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.text();
}

type Sel = Record<string, boolean>;

function LinkVocabPanel() {
    const [inputText, setInputText] = useState('');
    const [url, setUrl] = useState("");

    const [article, setArticle] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [selected, setSelected] = useState<Sel>({});
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState({ done: 0, total: 0 });

    const { init } = useHistorySlice(({ init }) => ({ init }));
    const { translatedText, setTranslatedText, handleTranslate } = useTranslation();
    const {
        sourceLanguage,
        targetLanguage,
        setTargetLanguage,
        setSourceLanguage,
        swapLanguages,
    } = useLanguageSwap();

    const anySelected = useMemo(() => Object.values(selected).some(Boolean), [selected]);

    useEffect(() => { if (init) void init(); }, [init]);

    async function handleFetch() {
        try {
            setLoading(true);
            setErr(null);
            setArticle("");
            setKeywords([]);
            setSelected({});
            const text = await fetchArticleText(url);
            setArticle(text);
            const kws = extractKeywords(text, { lang: sourceLanguage, max: 60, minLen: 3 });
            setKeywords(kws);
            const sel: Sel = {};
            for (const { word } of kws.slice(0, 30)) sel[word] = true;
            setSelected(sel);
        } catch (e: any) {
            console.error(e);
            setErr("Не вдалося отримати текст статті. Можливо, сайт блокує доступ. Вставте іншу лінку або текст вручну.");
        } finally {
            setLoading(false);
        }
    }

    function toggleAll(v: boolean) {
        const next: Sel = {};
        for (const { word } of keywords) next[word] = v;
        setSelected(next);
    }

    async function translateSelected() {
        const list = keywords.filter(k => selected[k.word]).map(k => k.word);
        if (!list.length || running) return;
        setRunning(true);
        setProgress({ done: 0, total: list.length });

        for (const word of list) {
            try {
                await handleTranslate(word, sourceLanguage, targetLanguage);
            } catch (e) {
                console.error("Translate failed:", word, e);
            } finally {
                setProgress(p => ({ ...p, done: p.done + 1 }));
            }
        }

        setRunning(false);
    }

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
                <h1 className="text-4xl font-bold text-gray-800">AI Link Vocab</h1>
            </div>
            <div className="p-4 border rounded-lg mb-4 shadow-sm bg-white/70 backdrop-blur">
                <div className="mb-3">
                    <h2 className="text-lg font-semibold">AI dictionary from the link</h2>
                    <p className="text-sm text-gray-500">Enter the URL of the article, we will extract the keywords and add their translation to the story.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <input
                            className="border p-2 rounded w-full"
                            placeholder="https://example.com/article"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            disabled={loading || running}
                        />
                        <LanguageSelector {...languageSelectorProps} />
                        <button
                            className="px-3 py-1 rounded bg-black text-white disabled:opacity-60"
                            onClick={handleFetch}
                            disabled={!url.trim() || loading || running}
                        >
                            Read the article
                        </button>
                        {err && <div className="text-sm text-red-600">{err}</div>}
                        {article && (
                            <div className="text-xs text-gray-500 max-h-28 overflow-auto border rounded p-2 whitespace-pre-wrap">
                                {article.slice(0, 2000)}
                                {article.length > 2000 ? " …" : ""}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Key words ({keywords.length})</div>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 rounded border" onClick={() => toggleAll(true)} disabled={loading || running}>All</button>
                                <button className="px-2 py-1 rounded border" onClick={() => toggleAll(false)} disabled={loading || running}>None</button>
                            </div>
                        </div>

                        <div className="border rounded p-2 max-h-60 overflow-auto">
                            {keywords.length === 0 ? (
                                <div className="text-sm text-gray-500">Not yet. Read the article.</div>
                            ) : (
                                <ul className="grid grid-cols-2 gap-2 text-sm">
                                    {keywords.map(k => (
                                        <li key={k.word} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!selected[k.word]}
                                                onChange={e => setSelected(s => ({ ...s, [k.word]: e.target.checked }))}
                                                disabled={running}
                                            />
                                            <span className="truncate" title={`${k.word} (${k.count})`}>{k.word}</span>
                                            <span className="text-xs text-gray-400">×{k.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            className="px-3 py-1 rounded bg-black text-white disabled:opacity-60"
                            onClick={translateSelected}
                            disabled={!anySelected || running}
                        >
                            Translate selected {anySelected && `(${Object.values(selected).filter(Boolean).length})`}
                        </button>

                        {running && (
                            <div className="text-sm text-gray-600">
                                Progress: {progress.done} / {progress.total}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default LinkVocabPanel;
