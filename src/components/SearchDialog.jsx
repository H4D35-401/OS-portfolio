import React, { useState, useEffect } from "react";
import { Search, Terminal, Music, Command, Code, Github, ExternalLink } from "lucide-react";
import useDesktopStore from "../store/useDesktopStore";
import { motion, AnimatePresence } from "framer-motion";

const SearchDialog = () => {
    const { isSearchOpen, setSearchOpen, toggleWindow } = useDesktopStore();
    const [query, setQuery] = useState("");

    const apps = [
        { id: "terminal", name: "Terminal", icon: Terminal, desc: "Arch Linux Shell (zsh)" },
        { id: "music", name: "Music Player", icon: Music, desc: "Spotify-lite Client" },
        { id: "github", name: "GitHub", icon: Github, desc: "@zariel-ag", isLink: true, url: "https://github.com" },
        { id: "projects", name: "Projects", icon: Code, desc: "Portfolio Work", isLink: true, url: "/projects" },
    ];

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.desc.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setSearchOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setSearchOpen]);

    if (!isSearchOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-[2000] flex items-start justify-center pt-32 bg-black/40 backdrop-blur-sm"
                onClick={() => setSearchOpen(false)}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-xl glass rounded-2xl overflow-hidden border border-red-500/20 shadow-2xl"
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-white/5">
                        <Search className="text-red-500" size={20} />
                        <input
                            autoFocus
                            placeholder="Search applications or commands..."
                            className="bg-transparent border-none outline-none text-white flex-1 font-mono text-lg"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-zinc-500">
                            <Command size={10} />
                            <span>K</span>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="p-2 max-h-[400px] overflow-y-auto">
                        <p className="px-4 py-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Applications</p>
                        {filteredApps.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    if (app.isLink) {
                                        window.open(app.url, "_blank");
                                    } else {
                                        toggleWindow(app.id);
                                    }
                                    setSearchOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-600/10 group transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-red-500 transition-colors">
                                        <app.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase tracking-tighter">{app.name}</p>
                                        <p className="text-xs text-zinc-500">{app.desc}</p>
                                    </div>
                                </div>
                                {app.isLink && <ExternalLink size={14} className="text-zinc-700 group-hover:text-red-900" />}
                            </button>
                        ))}

                        {filteredApps.length === 0 && (
                            <div className="py-10 text-center text-zinc-600 italic text-sm">
                                No matches for "{query}"
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-black/40 flex justify-between items-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1.5"><span className="text-red-900">ENTER</span> SELECT</span>
                            <span className="flex items-center gap-1.5"><span className="text-red-900">ESC</span> CLOSE</span>
                        </div>
                        <span className="text-red-950">BLACKARCH LAUNCHER</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SearchDialog;
