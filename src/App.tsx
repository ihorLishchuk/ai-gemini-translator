import React from 'react';
import Translator from './components/Translator';
import HistoryPanel from './components/HistoryPanel';
import ErrorBoundary from './components/ErrorBoundary';
import BatchTranslatePanel from "./components/BatchTranslatePanel";
import LinkVocabPanel from "./components/LinkVocabPanel";

function App() {
  return (
    <ErrorBoundary>
        <div className="max-w-4xl mx-auto p-6">
            <Translator />
            <BatchTranslatePanel />
            <LinkVocabPanel />
            <HistoryPanel />
        </div>
    </ErrorBoundary>
  );
}

export default App;
