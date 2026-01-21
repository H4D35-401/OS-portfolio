import { create } from "zustand";

const THEMES = {
    default: { primary: '#ef4444', bg: '#0a0a0a', panel: '#1a1a1a', text: '#ffffff' },
    matrix: { primary: '#00ff41', bg: '#000000', panel: '#001a00', text: '#00ff41' },
    cyan: { primary: '#06b6d4', bg: '#0a0a0a', panel: '#0f1419', text: '#ffffff' },
    gold: { primary: '#f59e0b', bg: '#0a0a0a', panel: '#1a1410', text: '#ffffff' },

    // Premium Themes
    'tokyo-night': { primary: '#7aa2f7', bg: '#1a1b26', panel: '#24283b', text: '#a9b1d6' },
    dracula: { primary: '#bd93f9', bg: '#282a36', panel: '#44475a', text: '#f8f8f2' },
    nord: { primary: '#88c0d0', bg: '#2e3440', panel: '#3b4252', text: '#eceff4' },
    gruvbox: { primary: '#fe8019', bg: '#282828', panel: '#3c3836', text: '#ebdbb2' },
    cyberpunk: { primary: '#ff00ff', bg: '#0a0014', panel: '#1a0028', text: '#00ffff' },
    monokai: { primary: '#a6e22e', bg: '#272822', panel: '#3e3d32', text: '#f8f8f2' },
    solarized: { primary: '#268bd2', bg: '#002b36', panel: '#073642', text: '#fdf6e3' },
    catppuccin: { primary: '#f5c2e7', bg: '#1e1e2e', panel: '#313244', text: '#cdd6f4' },
    'one-dark': { primary: '#61afef', bg: '#282c34', panel: '#3e4451', text: '#abb2bf' },
    'rose-pine': { primary: '#c4a7e7', bg: '#191724', panel: '#1f1d2e', text: '#e0def4' },
};

const useDesktopStore = create((set) => ({
    windows: [
        { id: "terminal", isOpen: true, isActive: true, icon: "⌘" },
        { id: "music", isOpen: true, isActive: false, icon: "♪" },
        { id: "ranger", isOpen: false, isActive: false, icon: "📁" },
    ],
    activeWindow: "terminal",
    workspace: 1,
    isSearchOpen: false,

    setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

    // Global Audio State
    audio: {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        trackName: "",
        artist: "",
        trackUrl: null,
    },

    setAudio: (updates) => set((state) => ({
        audio: { ...state.audio, ...updates }
    })),

    openWindow: (id) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, isOpen: true, zIndex: 100 } : { ...w, zIndex: Math.max(1, w.zIndex - 1) }),
        activeWindow: id
    })),

    closeWindow: (id) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w)
    })),

    toggleWindow: (id) => set((state) => {
        const win = state.windows.find(w => w.id === id);
        if (win?.isOpen && state.activeWindow === id) {
            return { windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w) };
        }
        return {
            windows: state.windows.map(w => w.id === id ? { ...w, isOpen: true, zIndex: 100 } : { ...w, zIndex: Math.max(1, w.zIndex - 1) }),
            activeWindow: id
        };
    }),

    focusWindow: (id) => set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, zIndex: 100 } : { ...w, zIndex: Math.max(1, w.zIndex - 1) }),
        activeWindow: id
    })),

    setWorkspace: (ws) => set({ workspace: ws }),

    cycleWorkspace: (direction) => set((state) => {
        let next = state.workspace + direction;
        if (next < 1) next = 5;
        if (next > 5) next = 1;
        return { workspace: next };
    }),

    currentTheme: 'default',
    notifications: [],

    setTheme: (themeName) => {
        const theme = THEMES[themeName] || THEMES.default;
        document.documentElement.style.setProperty('--color-primary', theme.primary);
        document.documentElement.style.setProperty('--color-bg', theme.bg);
        document.documentElement.style.setProperty('--color-panel', theme.panel);
        document.documentElement.style.setProperty('--color-text', theme.text);
        set({ currentTheme: themeName });
    },

    addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { id: Date.now(), ...notification }]
    })),

    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),
}));

export default useDesktopStore;
