import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Translator from "./components/Translator";
import HistoryPanel from "./components/HistoryPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import BatchTranslatePanel from "./components/BatchTranslatePanel";
import LinkVocabPanel from "./components/LinkVocabPanel";
import ImageTranslatePanel from "./components/ImageTranslatePanel";

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <nav className="max-w-4xl mx-auto p-6 flex gap-4 text-sm">
                    <Link to="/translate" className="hover:underline">Translate</Link>
                    <Link to="/batch" className="hover:underline">Batch</Link>
                    <Link to="/vocab" className="hover:underline">Link Vocab</Link>
                    <Link to="/image-translate" className="hover:underline">Image Translate</Link>
                </nav>

                <div className="max-w-4xl mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<Navigate to="/translate" replace />} />

                        <Route path="/translate" element={<Translator />} />
                        <Route path="/batch" element={<BatchTranslatePanel />} />
                        <Route path="/vocab" element={<LinkVocabPanel />} />
                        <Route path="/image-translate" element={<ImageTranslatePanel />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <HistoryPanel />
                </div>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

function NotFound() {
    return (
        <div className="text-center text-gray-600 mb-4">
            <h1 className="text-2xl font-semibold mb-2">404 — Not found</h1>
            <p>
                Try <Link to="/translate" className="underline">Translate</Link> or use the navigation above.
            </p>
        </div>
    );
}

export default App;
