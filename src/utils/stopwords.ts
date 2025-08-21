export const STOPWORDS: Record<string, Set<string>> = {
    en: new Set([
        "the","a","an","and","or","but","if","then","else","when","than","so","to","of","in","on","for","with","as","at","by","from","is","are","was","were","be","been","being","it","this","that","these","those","i","you","he","she","we","they","them","their","our","your","my","me"
    ]),
    de: new Set([
        "der","die","das","und","oder","aber","wenn","dann","sonst","als","zu","von","in","auf","für","mit","an","bei","aus","ist","sind","war","waren","sein","es","dies","diese","dieser","ich","du","er","sie","wir","ihr","ihnen","unser","euer","mein","dein"
    ]),
    uk: new Set([
        "і","й","та","або","але","якщо","то","коли","ніж","що","це","ця","цей","ці","той","такий","у","в","на","до","з","із","по","від","за","для","як","ми","ви","вони","він","вона","я","ти","є","бути","був","були"
    ]),
    ru: new Set([
        "и","или","но","если","то","когда","чем","что","это","этот","эта","эти","тот","такой","в","на","к","с","из","по","от","за","для","как","мы","вы","они","он","она","я","ты","есть","быть","был","были"
    ]),
    fr: new Set(["le","la","les","un","une","et","ou","mais","si","alors","quand","que","de","du","des","à","en","dans","sur","pour","avec","par","est","sont","été","être","ce","cet","cette","ces"]),
    es: new Set(["el","la","los","las","un","una","y","o","pero","si","cuando","que","de","del","en","sobre","para","con","por","es","son","fue","ser","esto","esta","estas","estos"]),
};

export function getStopwords(lang: string): Set<string> {
    const key = lang.toLowerCase();
    return STOPWORDS[key] ?? STOPWORDS.en;
}

export function guessLangFromText(text: string): string {
    const cyr = (text.match(/[\p{Script=Cyrillic}]/gu) || []).length;
    const lat = (text.match(/[\p{Script=Latin}]/gu) || []).length;
    if (cyr > lat) return "uk"; // умовно; підправ, якщо вчиш іншу
    return "en";
}
