import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import type { TranslationRecord } from "../types";
import { addRecord, getRecent, deleteRecord, clearAll } from "../db";

type HistoryStore = {
    items: TranslationRecord[];
    loading: boolean;
    isReady: boolean;
    init: () => Promise<void>;
    refresh: () => Promise<void>;
    push: (rec: Omit<TranslationRecord, "id" | "createdAt">) => Promise<number>;
    remove: (id: number) => Promise<void>;
    reset: () => Promise<void>;
};

const bc =
    typeof window !== "undefined" && "BroadcastChannel" in window
        ? new BroadcastChannel("translate-history")
        : null;

export const useHistoryStore = create<HistoryStore>()((set, get) => {
    bc?.addEventListener("message", (e) => {
        if (e.data?.type === "changed") void get().refresh();
    });

    const emitChanged = () => bc?.postMessage({ type: "changed" });

    return {
        items: [],
        loading: false,
        isReady: false,

        init: async () => {
            if (get().isReady) return;
            set({ loading: true });
            const data = await getRecent(200);
            set({ items: data, loading: false, isReady: true });
        },

        refresh: async () => {
            set({ loading: true });
            const data = await getRecent(200);
            set({ items: data, loading: false, isReady: true });
        },

        push: async (rec) => {
            const id = await addRecord({ ...rec, createdAt: Date.now() });
            await get().refresh();
            emitChanged();
            return id;
        },

        remove: async (id) => {
            await deleteRecord(id);
            await get().refresh();
            emitChanged();
        },

        reset: async () => {
            await clearAll();
            await get().refresh();
            emitChanged();
        },
    };
});

export const useHistorySlice = <T,>(selector: (s: HistoryStore) => T) =>
    useHistoryStore(useShallow(selector));
