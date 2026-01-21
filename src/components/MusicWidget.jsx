import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Search, Disc, Zap } from "lucide-react";
import useDesktopStore from "../store/useDesktopStore";

const MusicWidget = () => {
    const { audio, setAudio } = useDesktopStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef(null);
    const [visualizerBars, setVisualizerBars] = useState(Array(48).fill(8));
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const QUICK_PICKS = [
        { label: "FOCUS", query: "lofi focus" },
        { label: "RETRO", query: "synthwave" },
        { label: "CHILL", query: "ambient" },
    ];

    // Ultra smooth organic wave animation
    useEffect(() => {
        let animationFrame;
        const animate = () => {
            if (!audio.isPlaying) {
                setVisualizerBars(prev => prev.map(v => Math.max(8, v * 0.95))); // Smooth decay
                animationFrame = requestAnimationFrame(animate);
                return;
            }

            const now = Date.now();
            setVisualizerBars(prev => prev.map((_, i) => {
                const center = 24;
                const dist = Math.abs(i - center) / center;

                // Multi-layered wave simulation
                const wave1 = Math.sin(now / 200 + i * 0.2) * 20;
                const wave2 = Math.cos(now / 120 - i * 0.3) * 15;
                const wave3 = Math.sin(now / 400 + i * 0.1) * 10;

                const noise = Math.random() * 8;
                const energy = (1 - dist * 0.6); // Higher energy in center

                const targetHeight = 15 + (40 + wave1 + wave2 + wave3 + noise) * energy;
                return Math.max(6, Math.min(85, targetHeight));
            }));
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [audio.isPlaying]);

    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=5`);
                const data = await res.json();
                if (data.results?.length > 0) {
                    setSuggestions(data.results);
                    setShowSuggestions(true);
                }
            } catch (e) { console.error(e); }
        }, 300);
        return () => clearTimeout(debounceTimer.current);
    }, [searchQuery]);

    const playTrack = async (query, directSong = null) => {
        setShowSuggestions(false);
        try {
            let t = directSong;
            if (!t) {
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=1`);
                const data = await res.json();
                t = data.results?.[0];
            }
            if (t) {
                setAudio({
                    isPlaying: true, currentTime: 0, duration: 30,
                    trackName: t.trackName.toUpperCase(),
                    artist: t.artistName.toUpperCase(),
                    trackUrl: t.previewUrl,
                    coverArt: t.artworkUrl100?.replace('100x100', '600x600')
                });
                setSearchQuery("");
            }
        } catch (e) { console.error(e); }
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 10, y: -x * 10 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    return (
        <div
            className="w-full h-full p-5 text-white overflow-hidden relative perspective-1000 group/widget"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                background: 'linear-gradient(170deg, #121215 0%, #08080a 100%)',
                fontFamily: "'Inter', 'Segoe UI', sans-serif"
            }}
        >
            {/* 3D Container */}
            <div className="w-full h-full relative transition-transform duration-200 ease-out"
                style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>

                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse-slow"
                    style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
                    style={{ backgroundColor: 'var(--color-primary)', opacity: 0.05 }} />

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col h-full">

                    {/* Header: Spinning Vinyl + Info */}
                    <div className="flex gap-5 items-center mb-5">
                        <div className={`w-20 h-20 rounded-full shrink-0 shadow-2xl relative border-4 border-zinc-900 group-hover/widget:scale-105 transition-transform duration-500 ${audio.isPlaying ? 'animate-spin-slow' : ''}`}>
                            {audio.coverArt ? (
                                <img src={audio.coverArt} className="w-full h-full object-cover rounded-full" alt="" />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center">
                                    <Disc size={30} className="text-zinc-600" />
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/0 via-white/5 to-black/0 pointer-events-none" />
                            <div className="absolute inset-[35%] bg-black rounded-full border border-zinc-800 flex items-center justify-center">
                                <div className="w-2 h-2 bg-zinc-200 rounded-full" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h2 className="text-lg font-black tracking-tight truncate leading-none mb-1 text-white drop-shadow-sm">
                                {audio.trackName || "SYSTEM OFFLINE"}
                            </h2>
                            <p className="text-xs text-zinc-400 font-medium tracking-wide truncate flex items-center gap-2 uppercase">
                                <Zap size={10} style={{ color: 'var(--color-primary)' }} className={audio.isPlaying ? "fill-current" : "text-zinc-600"} />
                                {audio.artist || "STANDING BY"}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions - Floating Pills */}
                    <div className="flex gap-2 justify-center mb-6">
                        {QUICK_PICKS.map(p => (
                            <button
                                key={p.label}
                                onClick={() => playTrack(p.query)}
                                className="px-4 py-1.5 text-[10px] font-bold tracking-widest rounded-full border border-white/5 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:-translate-y-0.5 hover:text-red-500"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Search - Glass */}
                    <div className="relative mb-4 group/search">
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/5 rounded-xl px-4 py-2.5 transition-all duration-300 group-hover/search:bg-white/10 group-focus-within/search:border-red-500/50 group-focus-within/search:bg-black/50">
                            <Search size={14} className="text-zinc-500" />
                            <input
                                className="bg-transparent text-xs w-full text-white placeholder:text-zinc-600 outline-none font-medium tracking-wide"
                                placeholder="..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchQuery.trim() && playTrack(searchQuery)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                                {suggestions.map((s, i) => (
                                    <button key={i} onClick={() => playTrack(s.trackName, s)} className="w-full flex items-center gap-3 p-3 hover:bg-white/10 text-left transition-colors border-b border-white/5 last:border-0">
                                        <img src={s.artworkUrl60} className="w-8 h-8 rounded-lg" alt="" />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-bold text-white truncate">{s.trackName}</div>
                                            <div className="text-[10px] text-zinc-500 truncate">{s.artistName}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Holographic Visualizer */}
                    <div className="flex-1 flex items-center justify-center px-4 relative min-h-0 perspective-500">
                        <div className="flex items-end justify-center gap-[3px] h-full max-h-20 w-full" style={{ transform: 'rotateX(10deg)' }}>
                            {visualizerBars.map((height, i) => {
                                const center = visualizerBars.length / 2;
                                const dist = Math.abs(i - center) / center;
                                const isCenter = dist < 0.35;

                                return (
                                    <div
                                        key={i}
                                        className="w-1 rounded-t-full transition-all duration-75"
                                        style={{
                                            height: `${height}%`,
                                            background: isCenter
                                                ? 'linear-gradient(to top, var(--color-primary), var(--color-primary))'
                                                : 'linear-gradient(to top, #52525b, #27272a)',
                                            opacity: audio.isPlaying ? (1 - dist * 0.3) : 0.2,
                                            boxShadow: audio.isPlaying && isCenter ? '0 -4px 10px var(--color-primary)' : 'none'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Controls & Progress */}
                    <div className="mt-auto pt-2">
                        {/* Timeline scrub */}
                        <div className="mb-4 group/progress cursor-pointer">
                            <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="absolute left-0 top-0 h-full transition-all duration-300"
                                    style={{ width: `${(audio.currentTime / (audio.duration || 1)) * 100}%`, backgroundColor: 'var(--color-primary)' }}
                                />
                            </div>
                            <div className="flex justify-between text-[8px] text-zinc-600 mt-1 font-mono tracking-widest uppercase">
                                <span>{formatTime(audio.currentTime)}</span>
                                <span>{audio.isPlaying ? "PLAYING" : "PAUSED"}</span>
                                <span>{formatTime(audio.duration || 0)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-8">
                            <button className="text-zinc-600 hover:text-white transition-all hover:scale-110"><SkipBack size={20} fill="currentColor" /></button>
                            <button
                                onClick={() => setAudio({ isPlaying: !audio.isPlaying })}
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-white"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    boxShadow: '0 10px 30px -5px color-mix(in srgb, var(--color-primary) 50%, transparent)'
                                }}
                            >
                                {audio.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <button className="text-zinc-600 hover:text-white transition-all hover:scale-110"><SkipForward size={20} fill="currentColor" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicWidget;
