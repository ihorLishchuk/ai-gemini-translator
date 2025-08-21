export const speakText = (text: string, targetLanguage: string): void => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLanguage;
  window.speechSynthesis.speak(utterance);
}; 