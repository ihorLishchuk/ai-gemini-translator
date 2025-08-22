import React, { useEffect, useMemo, useState } from "react";
import { extractKeywords, type Keyword } from "../utils/keywords";
import { useTranslation } from "../hooks/useTranslation";
import { useHistorySlice } from "../store/useHistoryStore";
import { useLanguageSwap } from "../hooks/useLanguageSwap";
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
    const [inputText, setInputText] = useState("");
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

    useEffect(() => {
        if (init) void init();
    }, [init]);

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
            setErr(
                "The text of the article could not be retrieved. The site may be blocking access. Please insert another link or text manually."
            );
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
        const list = keywords.filter((k) => selected[k.word]).map((k) => k.word);
        if (!list.length || running) return;
        setRunning(true);
        setProgress({ done: 0, total: list.length });

        for (const word of list) {
            try {
                await handleTranslate(word, sourceLanguage, targetLanguage);
            } catch (e) {
                console.error("Translate failed:", word, e);
            } finally {
                setProgress((p) => ({ ...p, done: p.done + 1 }));
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
        setTranslatedText,
    };

    return (
        <>
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">AI Link Vocab</h1>
            </div>
            <div className="p-4 border rounded-lg mb-4 shadow-sm bg-white/80 backdrop-blur">
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-semibold">AI dictionary from the link</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Enter the URL of the article, we will extract the keywords and add their translation to
                        the story.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <input
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-gray-800/20"
                            placeholder="https://example.com/article"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={loading || running}
                        />
                        <LanguageSelector {...languageSelectorProps} />
                        <button
                            className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg bg-black text-white text-sm sm:text-base active:scale-[0.99] disabled:opacity-60"
                            onClick={handleFetch}
                            disabled={!url.trim() || loading || running}
                        >
                            Read the article
                        </button>
                        {err && <div className="text-sm text-red-600">{err}</div>}
                        {article && (
                            <div className="text-xs text-gray-500 max-h-28 overflow-auto border rounded-lg p-2 whitespace-pre-wrap">
                                {article.slice(0, 2000)}
                                {article.length > 2000 ? " …" : ""}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="text-sm font-medium">Key words ({keywords.length})</div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg border text-sm sm:text-base disabled:opacity-60"
                                    onClick={() => toggleAll(true)}
                                    disabled={loading || running}
                                >
                                    All
                                </button>
                                <button
                                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg border text-sm sm:text-base disabled:opacity-60"
                                    onClick={() => toggleAll(false)}
                                    disabled={loading || running}
                                >
                                    None
                                </button>
                            </div>
                        </div>

                        <div className="border rounded-lg p-2 max-h-60 overflow-auto">
                            {keywords.length === 0 ? (
                                <div className="text-sm text-gray-500">Not yet. Read the article.</div>
                            ) : (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    {keywords.map((k) => (
                                        <li key={k.word} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!selected[k.word]}
                                                onChange={(e) =>
                                                    setSelected((s) => ({ ...s, [k.word]: e.target.checked }))
                                                }
                                                disabled={running}
                                            />
                                            <span className="truncate" title={`${k.word} (${k.count})`}>
                                                {k.word}
                                              </span>
                                            <span className="text-xs text-gray-400">×{k.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg bg-black text-white text-sm sm:text-base active:scale-[0.99] disabled:opacity-60"
                            onClick={translateSelected}
                            disabled={!anySelected || running}
                        >
                            Translate selected{" "}
                            {anySelected && `(${Object.values(selected).filter(Boolean).length})`}
                        </button>

                        {running && (
                            <div className="space-y-1">
                                <div className="text-xs sm:text-sm text-gray-600">
                                    Progress: {progress.done} / {progress.total}
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded">
                                    <div
                                        className="h-2 bg-gray-800 rounded transition-all"
                                        style={{
                                            width:
                                                progress.total > 0
                                                    ? `${Math.round((progress.done / progress.total) * 100)}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default LinkVocabPanel;
