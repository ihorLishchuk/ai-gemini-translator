# AI Translator — Gemini-Powered Translation with Voice

A modern, real-time translation app built with **React**, powered by **Google's Gemini AI**. 
Includes both **voice input** (speech-to-text) and **voice output** (text-to-speech), with a sleek UI built using Tailwind CSS.

## Features

- Text translation between multiple languages
- Voice input (speech-to-text)
- Voice output (text-to-speech)
- Language swapping
- Modern, responsive UI with Tailwind CSS
- Integration with Google's Gemini AI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A **Gemini API key** from [Google AI Studio](https://makersuite.google.com/)

## Setup

1. Clone the repository:
```bash
   git clone 
   cd ai-gemini-translator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Environment Variables

- `REACT_APP_GEMINI_API_KEY`: Your Gemini API key from Google AI Studio

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production

## Browser Support

The application uses the following Web APIs:
- Web Speech API for speech recognition
- SpeechSynthesis API for text-to-speech

Make sure your browser supports these APIs for full functionality.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Google Gemini AI
- Web Speech API
