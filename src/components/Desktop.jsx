import React from "react";
import TopBar from "./TopBar";
import HyprWindow from "./HyprWindow";
import Terminal from "./Terminal";
import MusicWidget from "./MusicWidget";
import Wallpaper from "./Wallpaper";
import GlobalAudio from "./GlobalAudio";
import SearchDialog from "./SearchDialog";
import Ranger from "./Ranger";
import NotificationCenter from "./NotificationCenter";
import KeyboardShortcuts from "./KeyboardShortcuts";
import useDesktopStore from "../store/useDesktopStore";

const Desktop = () => {
    const { workspace } = useDesktopStore();

    return (
        <div
            className="w-screen h-screen relative overflow-hidden flex flex-col"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            {/* Absolute positioned overlays */}
            <GlobalAudio />
            <Wallpaper />
            <SearchDialog />
            <NotificationCenter />
            <KeyboardShortcuts />

            {/* Dynamic Background Noise/Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Fixed TopBar */}
            <TopBar />

            {/* CRITICAL: This spacer reserves space for the fixed TopBar */}
            <div className="h-12 flex-shrink-0" />

            {/* Workspace 1: Main Development */}
            {workspace === 1 && (
                <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-4 px-4 pb-4 min-h-0 relative z-10">
                    <HyprWindow
                        id="terminal"
                        title="zariel-terminal"
                        className="col-span-12 row-span-4 lg:col-span-8 lg:row-span-6 pointer-events-auto"
                    >
                        <Terminal />
                    </HyprWindow>

                    <HyprWindow
                        id="music"
                        title="Z radio"
                        className="col-span-12 row-span-2 lg:col-span-4 lg:row-span-3"
                    >
                        <MusicWidget />
                    </HyprWindow>

                    <HyprWindow
                        id="ranger"
                        title="ranger-fm"
                        className="col-span-12 row-span-4 lg:col-span-4 lg:row-span-3 !bg-[#101010] pointer-events-auto"
                    >
                        <Ranger />
                    </HyprWindow>

                    {/* Workspace 1 Specific Widgets */}
                    <div className="hidden lg:flex lg:col-span-4 lg:row-span-3 glass rounded-lg flex-col p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pointer-events-auto">
                        <div className="flex justify-between border-b border-zinc-900 pb-2 mb-2">
                            <span>UPTIME</span>
                            <span style={{ color: 'var(--color-primary)' }}>2H 43M</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-900 pb-2 mb-2">
                            <span>OS</span>
                            <span style={{ color: 'var(--color-primary)' }}>BLACKARCH</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-900 pb-2">
                            <span>WM</span>
                            <span style={{ color: 'var(--color-primary)' }}>HYPRLAND</span>
                        </div>
                        <div className="mt-auto text-zinc-700">
                            SYSTEM READY. STANDING BY FOR COMMANDS.
                        </div>
                    </div>
                </div>
            )}

            {/* Workspace 2 / Others - Clean Desktop for Wallpaper Visibility */}
            {workspace !== 1 && null}
        </div>
    );
};

export default Desktop;
