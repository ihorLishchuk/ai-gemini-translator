import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from '../hooks/useTranslation';
import { useOcr } from "../helpers";
import { TESS_KNOWN } from "../types";
import { useHistorySlice } from "../store/useHistoryStore";
import { useLanguageSwap } from "../hooks/useLanguageSwap";
import LanguageSelector from "./LanguageSelector";

type QueueItem = {
    id: string;
    file: File;
    previewUrl: string;
    text: string;
    status: "idle" | "ocr" | "done" | "error";
    progress: number; // 0..1
    error?: string;
};

function ImageTranslatePanel() {
    const { init } = useHistorySlice(({init}) => ({ init }));
    const { translatedText, setTranslatedText, handleTranslate } = useTranslation();
    const {
        sourceLanguage,
        targetLanguage,
        setSourceLanguage,
        setTargetLanguage,
        swapLanguages,
    } = useLanguageSwap();

    const { recognize } = useOcr();

    const [inputText, setInputText] = useState("");
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [ocrRunning, setOcrRunning] = useState(false);
    const [trRunning, setTrRunning] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (init) void init(); }, [init]);

    function onFilesSelected(files: FileList) {
        const items: QueueItem[] = Array.from(files).map((f) => ({
            id: crypto.randomUUID(),
            file: f,
            previewUrl: URL.createObjectURL(f),
            text: "",
            status: "idle",
            progress: 0,
        }));
        setQueue((prev) => [...prev, ...items]);
    }

    function removeItem(id: string) {
        setQueue((prev) => {
            const it = prev.find((x) => x.id === id);
            if (it?.previewUrl) URL.revokeObjectURL(it.previewUrl);
            return prev.filter((x) => x.id !== id);
        });
    }

    async function runOcr() {
        if (ocrRunning || queue.length === 0) return;
        setOcrRunning(true);
        const langs = Object.values(TESS_KNOWN);

        for (const it of queue) {
            setQueue((prev) => prev.map((q) => (q.id === it.id ? { ...q, status: "ocr", progress: 0 } : q)));
            try {
                const text = await recognize(it.file, {
                    langs,
                    onProgress: (p) => {
                        setQueue((prev) => prev.map((q) => (q.id === it.id ? { ...q, progress: p.progress } : q)));
                    },
                });
                setQueue((prev) => prev.map((q) => (q.id === it.id ? { ...q, text, status: "done", progress: 1 } : q)));
            } catch (e: any) {
                setQueue((prev) => prev.map((q) => (q.id === it.id ? { ...q, status: "error", error: String(e) } : q)));
            }
        }

        setOcrRunning(false);
    }

    const canTranslateAll = useMemo(
        () => queue.some((q) => q.status === "done" && q.text.trim().length > 0),
        [queue]
    );

    async function translateAll() {
        if (trRunning || !canTranslateAll) return;
        setTrRunning(true);

        for (const it of queue) {
            if (it.status !== "done" || !it.text.trim()) continue;
            try {
                await handleTranslate(it.text, sourceLanguage, targetLanguage);
            } catch (e) {
                console.error("translate failed:", it.file.name, e);
            }
        }

        setTrRunning(false);
    }

    function clearAll() {
        for (const it of queue) {
            if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
        }
        setQueue([]);
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
        disabledSourceLanguage: true
    }

    return (
        <>
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
                    AI Image Translator
                </h1>
            </div>
            <div className="p-4 border rounded-lg shadow-sm bg-white/70 backdrop-blur mb-4">
                <div className="mb-3">
                    <h2 className="text-lg font-semibold">Image translation (OCR → translation)</h2>
                    <p className="text-sm text-gray-500">
                        Upload an image with text, recognize it, edit it if necessary, and translate it. All translations will go into history.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 rounded border disabled:bg-gray-300 disabled:text-white"
                                onClick={() => fileRef.current?.click()}
                                disabled={ocrRunning || trRunning}
                            >
                                Upload image
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length) onFilesSelected(files);
                                    e.currentTarget.value = "";
                                }}
                            />
                            <button
                                className="px-3 py-1 rounded border disabled:bg-gray-300 disabled:text-white"
                                onClick={clearAll}
                                disabled={(ocrRunning || trRunning) || queue.length === 0}
                            >
                                Clear
                            </button>
                        </div>

                        <LanguageSelector {...languageSelectorProps} />

                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 rounded bg-black text-white disabled:bg-gray-300 "
                                onClick={runOcr}
                                disabled={ocrRunning || trRunning || queue.length === 0}
                            >
                                Recognize text {queue.length ? `(${queue.length})` : ""}
                            </button>
                            <button
                                className="px-3 py-1 rounded bg-black text-white disabled:bg-gray-300 "
                                onClick={translateAll}
                                disabled={trRunning || !canTranslateAll}
                            >
                                Translate All
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {queue.length === 0 ? (
                            <div className="text-sm text-gray-500">Files have not been added yet.</div>
                        ) : (
                            <ul className="space-y-3 max-h-[60vh] overflow-auto pr-1">
                                {queue.map((it) => (
                                    <li key={it.id} className="p-3 rounded-xl border bg-white">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium">{it.file.name}</div>
                                            <div className="flex items-center gap-2">
                                                {it.status === "ocr" && (
                                                    <span className="text-xs text-gray-500">
                                                  OCR: {(it.progress * 100).toFixed(0)}%
                                                </span>
                                                )}
                                                <button
                                                    className="text-xs text-red-600 hover:underline"
                                                    onClick={() => removeItem(it.id)}
                                                    disabled={ocrRunning || trRunning}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 gap-3">
                                            <img
                                                src={it.previewUrl}
                                                alt={it.file.name}
                                                className="w-full h-28 object-contain bg-gray-50 border rounded"
                                            />
                                            <textarea
                                                className="w-full h-28 border p-2 rounded"
                                                placeholder="Розпізнаний текст з картинки…"
                                                value={it.text}
                                                onChange={(e) =>
                                                    setQueue((prev) =>
                                                        prev.map((q) => (q.id === it.id ? { ...q, text: e.target.value } : q))
                                                    )
                                                }
                                            />
                                        </div>

                                        {it.status === "error" && (
                                            <div className="text-xs text-red-600 mt-2">{it.error}</div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}


export default ImageTranslatePanel;
