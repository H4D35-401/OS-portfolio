import { create } from "zustand";

const useTerminalStore = create((set) => ({
    history: [
        { type: "output", content: "Arch Linux 6.1.0-zen1-1-zen (tty1)" },
        { type: "output", content: "zariel-pc login: zariel" },
        { type: "output", content: "Password: ************" },
        { type: "output", content: "Welcome to Zariel's Portfolio OS." },
        { type: "output", content: "Type 'help' to see available commands." },
        { type: "output", content: "" },
    ],
    isGlitched: false,
    isVimMode: false,
    isSnakeMode: false,
    isTronMode: false,

    addHistory: (item) => set((state) => ({ history: [...state.history, item] })),
    clearHistory: () => set({ history: [] }),
    setGlitched: (value) => set({ isGlitched: value }),
    setVimMode: (value) => set({ isVimMode: value }),
    setSnakeMode: (value) => set({ isSnakeMode: value }),
    setIsTronMode: (value) => set({ isTronMode: value }),
}));

export default useTerminalStore;
