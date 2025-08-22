import React, { useEffect, useRef, useState } from "react";
import { useHistorySlice } from "../store/useHistoryStore";
import {useTranslation} from "../hooks/useTranslation";
import {useLanguageSwap} from "../hooks/useLanguageSwap";
import LanguageSelector from "./LanguageSelector";

function parsePlainText(text: string): string[] {
    return text
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean);
}

function parseCsv(text: string): string[] {
    return text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => {
            const parts = l.split(/[,;](.*)/s);
            return (parts[0] ?? "").trim();
        })
        .filter(Boolean)
        .filter(s => s.toLowerCase() !== "text");
}

function BatchTranslatePanel() {
    const { init, pushMany } = useHistorySlice(({ init, pushMany }) => ({ init, pushMany }));
    const [inputText, setInputText] = useState('');
    const [listInput, setListInput] = useState("");
    const [queue, setQueue] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [progress, setProgress] = useState({ done: 0, total: 0 });
    const fileRef = useRef<HTMLInputElement>(null);

    const { translatedText, setTranslatedText, handleTranslate } = useTranslation();

    const {
        sourceLanguage,
        targetLanguage,
        setSourceLanguage,
        setTargetLanguage,
        swapLanguages
    } = useLanguageSwap();

    useEffect(() => { void init(); }, [init]);

    function enqueueFromTextarea() {
        const items = parsePlainText(listInput);
        setQueue(prev => [...prev, ...items]);
        setListInput("");
    }

    async function handleFile(file: File) {
        const text = await file.text();
        const ext = file.name.toLowerCase().split(".").pop() || "";
        let items: string[] = [];
        if (ext === "txt") items = parsePlainText(text);
        else if (ext === "csv") items = parseCsv(text);
        else {
            items = parsePlainText(text);
        }
        setQueue(prev => [...prev, ...items]);
    }

    async function runBatch() {
        if (running || queue.length === 0) return;
        setRunning(true);
        setProgress({ done: 0, total: queue.length });

        const results: Array<{
            sourceText: string;
            translatedText: string;
            fromLang: string;
            toLang: string;
        }> = [];

        for (let i = 0; i < queue.length; i++) {
            const sourceText = queue[i];
            try {
                await handleTranslate(sourceText, sourceLanguage, targetLanguage);
            } catch (e) {
                console.error("Translate failed for:", sourceText, e);
            } finally {
                setProgress(p => ({ ...p, done: p.done + 1 }));
            }
        }

        if (results.length > 0) {
            await pushMany(results);
        }

        setQueue([]);
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
        <div className="p-4 border rounded-lg shadow-sm bg-white/70 backdrop-blur mb-4">
            <div className="mb-3">
                <h2 className="text-lg font-semibold">Batch translation</h2>
                <p className="text-sm text-gray-500">Insert one expression per line or upload .txt/.csv</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
          <textarea
              className="w-full min-h-[140px] border p-2 rounded"
              placeholder="Each line is a separate translation"
              value={listInput}
              onChange={e => setListInput(e.target.value)}
          />
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 rounded border"
                            onClick={enqueueFromTextarea}
                            disabled={!listInput.trim()}
                        >
                            Add to queue
                        </button>
                        <button
                            className="px-3 py-1 rounded border"
                            onClick={() => fileRef.current?.click()}
                        >
                            Upload file
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".txt,.csv,text/plain,text/csv"
                            className="hidden"
                            onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (f) await handleFile(f);
                                e.currentTarget.value = "";
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <LanguageSelector {...languageSelectorProps} />
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 rounded bg-black text-white disabled:opacity-60"
                            onClick={runBatch}
                            disabled={running || queue.length === 0}
                        >
                            Translate {queue.length > 0 ? `(${queue.length})` : ""}
                        </button>
                        <button
                            className="px-3 py-1 rounded border"
                            onClick={() => setQueue([])}
                            disabled={running || queue.length === 0}
                        >
                            Clear queue
                        </button>
                    </div>
                    {running && (
                        <div className="text-sm text-gray-600">
                            Progress: {progress.done} / {progress.total}
                        </div>
                    )}
                    {!running && queue.length > 0 && (
                        <div className="text-sm text-gray-600">
                            Queue: {queue.length}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BatchTranslatePanel;
