import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'ukr', name: 'Ukrainian' },
  { code: 'ru', name: 'Russian' },
];

export const translateText = async (
  inputText: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  const from = LANGUAGES.find(lang => lang.code === sourceLanguage)?.name;
  const to = LANGUAGES.find(lang => lang.code === targetLanguage)?.name;
  try {
    const prompt = `
      Translate this text from
      ${from} to ${to}. 
      Provide only the translation, no explanations or additional text:"${inputText}".
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed. Please try again.');
  }
};
