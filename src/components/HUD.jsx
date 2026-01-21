import React from "react";
import useUniverseStore from "../store/useUniverseStore";

const HUD = () => {
    const { isLowEnd, toggleMode, activeSection, setActiveSection } = useUniverseStore();

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-10">
            <div className="flex justify-between items-start pointer-events-auto">
                <div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-glow">ZARIEL</h1>
                    <p className="text-blue-400 font-medium tracking-widest text-sm md:text-base">CREATIVE DEVELOPER</p>
                </div>

                <button
                    onClick={toggleMode}
                    className="glass px-4 py-2 rounded-full text-xs md:text-sm font-medium hover:bg-white/10 transition-colors"
                >
                    {isLowEnd ? "🚀 HIGH PERFORMANCE" : "💻 LOW END MODE"}
                </button>
            </div>

            {activeSection && (
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-2xl p-8 rounded-3xl relative pointer-events-auto animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setActiveSection(null)}
                            className="absolute top-4 right-6 text-2xl text-slate-400 hover:text-white"
                        >
                            &times;
                        </button>
                        <h2 className="text-3xl font-display font-bold mb-4 text-blue-400 uppercase tracking-tighter">
                            {activeSection}
                        </h2>
                        <div className="text-slate-200 leading-relaxed text-lg">
                            {activeSection === "About" && (
                                <p>Building immersive web experiences where 2D meets 3D. Passionate about performance and visual excellence.</p>
                            )}
                            {activeSection === "Projects" && (
                                <ul className="space-y-4">
                                    <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <h3 className="font-bold">Portfolio V2</h3>
                                        <p className="text-sm text-slate-400">Hybrid 2D/3D Game Interface</p>
                                    </li>
                                    <li className="p-4 bg-white/5 rounded-xl border border-white/10">
                                        <h3 className="font-bold">Zade Ignite</h3>
                                        <p className="text-sm text-slate-400">Advanced AI System Upgrade</p>
                                    </li>
                                </ul>
                            )}
                            {activeSection === "Contact" && (
                                <div className="space-y-2">
                                    <p>Email: zariel@example.com</p>
                                    <p>GitHub: @zariel-ag</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center md:justify-end gap-4 md:gap-8 pointer-events-auto">
                {["About", "Projects", "Contact"].map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`text-lg md:text-xl font-display font-bold transition-all hover:text-blue-400 hover:-translate-y-1 ${activeSection === section ? "text-blue-400 underline decoration-2 underline-offset-8" : "text-white/60"
                            }`}
                    >
                        {section}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HUD;
