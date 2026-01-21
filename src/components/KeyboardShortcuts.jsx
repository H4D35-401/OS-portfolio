import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

const KeyboardShortcuts = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e) => {
            console.log('Key pressed:', e.key, 'Active element:', document.activeElement.tagName);
            if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const isInputFocused = document.activeElement.tagName === 'INPUT' ||
                    document.activeElement.tagName === 'TEXTAREA' ||
                    document.activeElement.isContentEditable;
                console.log('? pressed, input focused:', isInputFocused);
                if (!isInputFocused) {
                    e.preventDefault();
                    console.log('Toggling shortcuts overlay');
                    setIsOpen(prev => !prev);
                }
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen]);

    const shortcuts = [
        {
            category: 'Navigation', items: [
                { keys: ['Super', '1-5'], description: 'Switch to workspace 1-5' },
                { keys: ['Scroll'], description: 'Cycle workspaces (on top bar)' },
                { keys: ['Super', 'Q'], description: 'Close active window' },
            ]
        },
        {
            category: 'Applications', items: [
                { keys: ['Super', 'Enter'], description: 'Open terminal' },
                { keys: ['Super', 'M'], description: 'Toggle music player' },
                { keys: ['Super', 'R'], description: 'Open ranger' },
                { keys: ['Super', 'Space'], description: 'App launcher' },
            ]
        },
        {
            category: 'Terminal', items: [
                { keys: ['snake'], description: 'Play Snake game (WASD/Arrows)' },
                { keys: ['tron'], description: 'Play Tron game (WASD/Arrows)' },
                { keys: ['wal --theme=X'], description: 'Change color theme' },
                { keys: ['Esc'], description: 'Exit games' },
            ]
        },
        {
            category: 'Themes', items: [
                { keys: ['default'], description: 'BlackArch red (default)' },
                { keys: ['matrix'], description: 'Matrix green' },
                { keys: ['tokyo-night'], description: 'Tokyo Night blue' },
                { keys: ['dracula'], description: 'Dracula purple' },
                { keys: ['cyberpunk'], description: 'Cyberpunk neon' },
                { keys: ['nord'], description: 'Nord frosty blue' },
            ]
        },
        {
            category: 'Help', items: [
                { keys: ['?'], description: 'Toggle this help menu' },
                { keys: ['help'], description: 'Terminal help command' },
            ]
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-8"
                    >
                        <div className="glass rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border-2" style={{ borderColor: 'var(--color-primary)' }}>
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <Keyboard size={24} style={{ color: 'var(--color-primary)' }} />
                                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                        KEYBOARD SHORTCUTS
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] grid grid-cols-1 md:grid-cols-2 gap-6">
                                {shortcuts.map((section, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3">
                                            {section.category}
                                        </h3>
                                        <div className="space-y-2">
                                            {section.items.map((item, i) => (
                                                <div key={i} className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.keys.map((key, ki) => (
                                                            <kbd
                                                                key={ki}
                                                                className="px-2 py-1 text-xs font-mono rounded border border-white/20 bg-white/5 text-white"
                                                            >
                                                                {key}
                                                            </kbd>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-zinc-400 text-right flex-1">
                                                        {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 text-center text-xs text-zinc-600">
                                Press <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white">?</kbd> or <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white">Esc</kbd> to close
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default KeyboardShortcuts;
