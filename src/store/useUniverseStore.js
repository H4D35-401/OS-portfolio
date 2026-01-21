import { create } from "zustand";

const useUniverseStore = create((set) => ({
    isLowEnd: false,
    activeSection: null,

    setLowEnd: (value) => set({ isLowEnd: value }),
    setActiveSection: (section) => set({ activeSection: section }),
    toggleMode: () => set((state) => ({ isLowEnd: !state.isLowEnd })),
}));

export default useUniverseStore;
