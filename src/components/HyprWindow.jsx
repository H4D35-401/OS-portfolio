import React from "react";
import { X, Square } from "lucide-react";
import useDesktopStore from "../store/useDesktopStore";

const HyprWindow = ({ id, title, children, className = "" }) => {
    const { windows, focusWindow, closeWindow, activeWindow } = useDesktopStore();
    const windowState = windows.find(w => w.id === id);

    if (!windowState || !windowState.isOpen) return null;

    const isActive = activeWindow === id;

    return (
        <div
            className={`
                flex flex-col rounded-xl overflow-hidden transition-all duration-300
                ${isActive ? "hypr-border ring-4 scale-100" : "border border-white/5 opacity-80"}
                min-h-0 max-h-full bg-black/95
                ${className}
            `}
            style={{
                zIndex: windowState.zIndex,
                ...(isActive ? {
                    borderColor: 'var(--color-primary)',
                    '--tw-ring-color': 'rgba(var(--color-primary), 0.1)' // Note: this requires proper rgb vars, simplified for now
                } : {})
            }}
            onMouseDown={() => focusWindow(id)}
        >
            {/* Title Bar */}
            <div
                className={`
                    flex items-center justify-between px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]
                    ${isActive ? "bg-white/5" : "bg-black/80 text-zinc-500"}
                `}
                style={isActive ? { color: 'var(--color-primary)' } : {}}
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? 'var(--color-primary)' : '#3f3f46' }} />
                    {title}
                </div>
                <div className="flex gap-3">
                    <button className="text-zinc-600 hover:text-white transition-colors">
                        <Square size={10} />
                    </button>
                    <button
                        className="opacity-50 hover:opacity-100 transition-colors"
                        style={{ color: isActive ? 'var(--color-primary)' : '' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeWindow(id);
                        }}
                    >
                        <X size={12} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 bg-black/95 relative overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default HyprWindow;
