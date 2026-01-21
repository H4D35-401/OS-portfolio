import React, { useState, useEffect } from "react";
import { Terminal, Music, Layout, Cpu, HardDrive, Clock, Search } from "lucide-react";
import useDesktopStore from "../store/useDesktopStore";

const TopBar = () => {
    const { workspace, setWorkspace, toggleWindow, activeWindow, cycleWorkspace, setSearchOpen } = useDesktopStore();
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleScroll = (e) => {
        const direction = e.deltaY > 0 ? 1 : -1;
        cycleWorkspace(direction);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-10 flex items-center justify-between px-4 z-[1000] pointer-events-none">
            {/* Left: Launcher & Workspaces */}
            <div className="flex gap-2 pointer-events-auto">
                <div
                    className="glass px-2 py-1 rounded-lg flex items-center gap-3"
                    onWheel={handleScroll}
                >
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-1 transition-transform active:scale-90"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        <Search size={14} strokeWidth={3} />
                    </button>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <button
                                key={i}
                                onClick={() => setWorkspace(i)}
                                className={`w-6 h-6 rounded flex items-center justify-center transition-all text-[10px] font-bold
                                    ${workspace === i ? "bg-white/10 border" : "text-zinc-500 hover:text-zinc-300"}`}
                                style={workspace === i ? {
                                    color: 'var(--color-primary)',
                                    borderColor: 'var(--color-primary)'
                                } : {}}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center: Brand/Active Window */}
            <div className="glass px-6 py-1 rounded-lg text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-3 pointer-events-auto"
                style={{ color: 'var(--color-primary)' }}>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
                    BLACKARCH // {activeWindow ? activeWindow.toUpperCase() : "HYPRLAND"}
                </div>
            </div>

            {/* Right: Modules */}
            <div className="flex gap-2 pointer-events-auto">
                <div className="flex gap-2 glass px-3 py-1 rounded-lg">
                    <button
                        onClick={() => toggleWindow('terminal')}
                        className={`transition-colors ${activeWindow === 'terminal' ? 'opacity-100' : 'text-zinc-400'}`}
                        style={activeWindow === 'terminal' ? { color: 'var(--color-primary)' } : {}}
                    >
                        <Terminal size={14} />
                    </button>
                    <button
                        onClick={() => toggleWindow('music')}
                        className={`transition-colors ${activeWindow === 'music' ? 'opacity-100' : 'text-zinc-400'}`}
                        style={activeWindow === 'music' ? { color: 'var(--color-primary)' } : {}}
                    >
                        <Music size={14} />
                    </button>
                </div>

                <div className="glass px-3 py-1 rounded-lg flex items-center gap-4 text-[10px] font-bold text-zinc-400">
                    <div className="flex items-center gap-1.5">
                        <Cpu size={12} style={{ color: 'var(--color-primary)' }} />
                        <span>12%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <HardDrive size={12} style={{ color: 'var(--color-primary)' }} />
                        <span>4.2GB</span>
                    </div>
                </div>

                <div className="glass px-4 py-1 rounded-lg flex items-center gap-2 font-bold text-xs text-white">
                    <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                    {time}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
