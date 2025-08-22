import React, {useEffect} from "react";
import {useHistorySlice} from "../store/useHistoryStore";
import {PlayIcon} from "./icons";
import {speakText} from "../utils/speechSynthesis";

const HistoryPanel: React.FC = () => {
    const { items, loading, init, remove, reset } = useHistorySlice((store) => ({
        ...store
    }));

    useEffect(() => { void init(); }, [init]);

    const handleSpeakText = (text: string, targetLanguage: string) => {
        speakText(text, targetLanguage);
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white/70">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">History Panel</h2>
                <button className="px-3 py-1 rounded border text-red-600" onClick={() => reset()}>
                    Clear History
                </button>
            </div>

            {loading ? (
                <div className="text-sm text-gray-500">Loading…</div>
            ) : items.length === 0 ? (
                <div className="text-sm text-gray-500">No records yet.</div>
            ) : (
                <ul className="space-y-3 max-h-[50vh] overflow-auto">
                    {items.map((r) => (
                        <li key={r.id} className="relative p-3 rounded-xl border bg-white">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div>
                                    {r.fromLang} → {r.toLang} • {new Date(r.createdAt).toLocaleString()}
                                    {r.model ? ` • ${r.model}` : ""}
                                </div>
                                <button className="text-red-600 hover:underline" onClick={() => r.id && remove(r.id)}>
                                    Remove
                                </button>
                            </div>
                            <div className="mt-2">
                                <div className="text-xs font-medium text-gray-500">Source</div>
                                <div className="whitespace-pre-wrap">{r.sourceText}</div>
                            </div>
                            <div className="mt-2">
                                <div className="text-xs font-medium text-gray-500">Target</div>
                                <div className="whitespace-pre-wrap">{r.translatedText}</div>
                            </div>
                            {r.prompt && <div className="mt-2 text-xs text-gray-500">prompt: <code>{r.prompt}</code></div>}
                            <button
                                onClick={() => handleSpeakText(r.translatedText, r.toLang)}
                                className="absolute bottom-4 right-4 p-2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
                            >
                                <PlayIcon className="w-6 h-6" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HistoryPanel;
