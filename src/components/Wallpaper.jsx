import React from "react";
import useDesktopStore from "../store/useDesktopStore";

const Wallpaper = () => {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
            {/* Background Base - Dynamic Mix */}
            <div className="absolute inset-0"
                style={{ background: 'radial-gradient(circle at center, color-mix(in srgb, var(--color-primary) 15%, black) 0%, #050505 100%)' }} />

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[250px] rounded-full opacity-10"
                style={{ backgroundColor: 'var(--color-primary)' }} />

            {/* Main Branding - Visible on all workspaces */}
            <div className="flex flex-col items-center gap-4 opacity-100 z-10 relative">
                <div
                    className="text-[120px] font-bold leading-none tracking-normal filter"
                    style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-primary)',
                        filter: 'drop-shadow(0 0 1px var(--color-primary))',
                        textShadow: '0 0 10px black'
                    }}
                >
                    ZARIEL
                </div>
                <div className="flex items-center gap-3 w-full px-12">
                    <div className="h-[1px] flex-1 opacity-40" style={{ backgroundColor: 'var(--color-primary)' }} />
                    <div className="font-mono text-sm tracking-[0.6em] uppercase font-black uppercase opacity-100"
                        style={{ color: 'var(--color-primary)', textShadow: '0 0 10px var(--color-primary)' }}>
                        SYSTEM OS // V4.0
                    </div>
                    <div className="h-[1px] flex-1 opacity-40" style={{ backgroundColor: 'var(--color-primary)' }} />
                </div>
            </div>

            {/* Geometric Grid Accents */}
            <div className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />
        </div>
    );
};

export default Wallpaper;
