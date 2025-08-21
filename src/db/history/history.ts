import {TranslationRecord} from "../../types";

const DB_NAME = "translate-history-db";
const STORE_NAME = "records";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                store.createIndex("createdAt_idx", "createdAt", { unique: false });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function addRecord(rec: Omit<TranslationRecord, "id">): Promise<number> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const idReq = tx.objectStore(STORE_NAME).add(rec);
        idReq.onsuccess = () => resolve(idReq.result as number);
        idReq.onerror = () => reject(idReq.error);
    });
}

export async function getRecent(limit = 100): Promise<TranslationRecord[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const index = store.index("createdAt_idx");

        // Збираємо в зворотному порядку за createdAt
        const results: TranslationRecord[] = [];
        const direction: IDBCursorDirection = "prev";
        const req = index.openCursor(null, direction);

        req.onsuccess = () => {
            const cursor = req.result;
            if (cursor && results.length < limit) {
                results.push(cursor.value as TranslationRecord);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        req.onerror = () => reject(req.error);
    });
}

export async function deleteRecord(id: number): Promise<void> {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const req = tx.objectStore(STORE_NAME).delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

export async function clearAll(): Promise<void> {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const req = tx.objectStore(STORE_NAME).clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}
