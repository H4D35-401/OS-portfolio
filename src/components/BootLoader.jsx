import React, { useState, useEffect, useRef } from 'react';

const BootLoader = ({ onComplete }) => {
    const [lines, setLines] = useState([]);
    const scrollRef = useRef(null);

    const bootMessages = [
        "Starting Arch Linux...",
        "[OK] Reached target Basic System.",
        "[OK] Reached target Graphical Interface.",
        "[OK] Started Network Manager.",
        "[OK] Started WPA Supplicant.",
        "[OK] Started Login Service.",
        "[OK] Started D-Bus System Message Bus.",
        "[OK] Reached target Multi-User System.",
        "Starting BlackArch Main Repository...",
        "[OK] Mounted /boot.",
        "[OK] Mounted /home.",
        "Loading Hyprland Compositor...",
        "Initializing ZADE Engine...",
        "Loading H4D35-401 Config...",
        "Accessing Neural Interface...",
        "WELCOME TO BLACKARCH // HYPRLAND"
    ];

    useEffect(() => {
        let mounted = true;
        const runBoot = async () => {
            for (const msg of bootMessages) {
                if (!mounted) return;
                setLines(prev => [...prev, msg]);
                await new Promise(r => setTimeout(r, 40));
            }
            if (mounted) onComplete();
        };
        runBoot();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="w-screen h-screen bg-black text-white font-mono text-sm p-8 overflow-hidden flex flex-col justify-end">
            <div ref={scrollRef} className="max-w-3xl flex flex-col gap-1">
                {lines.map((line, i) => (
                    <div key={i} className="flex gap-3">
                        <span className="text-zinc-500">[{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                        <span className={line.includes("[OK]") ? "text-green-500" : "text-white"}>
                            {line.replace("[OK]", "")}
                            {line.includes("[OK]") && <span className="font-bold">OK</span>}
                        </span>
                    </div>
                ))}
                <div className="animate-pulse">_</div>
            </div>
        </div>
    );
};

export default BootLoader;
