import { useCallback } from "react";
import Tesseract from "tesseract.js";
import { toTesseractLangs } from "./langMap";

export type OcrProgress = { status: string; progress: number };

export function useOcr() {
    const recognize = useCallback(async (
        file: File | Blob | string,
        opts?: {
            langs?: any[] | any;
            onProgress?: (p: OcrProgress) => void;
        }
    ): Promise<string> => {
        const langs = toTesseractLangs(opts?.langs ?? ["en"]);
        const { data } = await Tesseract.recognize(file, langs, {
            logger: (m) => {
                if (opts?.onProgress) {
                    opts.onProgress({ status: m.status, progress: m.progress });
                }
            },
        });
        return (data?.text ?? "").trim();
    }, []);

    return { recognize };
}
