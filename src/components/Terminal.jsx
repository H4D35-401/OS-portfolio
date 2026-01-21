import React, { useState, useEffect, useRef } from "react";
import useTerminalStore from "../store/useTerminalStore";
import useDesktopStore from "../store/useDesktopStore";
import SnakeGame from "./SnakeGame";
import TronGame from "./TronGame";

const ARCH_LOGO = `
       /\\
      /  \\
     /    \\
    /      \\
   /   ,,   \\
  /   |  |   \\
 /   -|  |-   \\
/    __\\/__    \\
\\___/      \\___/
`;

const Commands = {
    help: () => [
        "Available commands:",
        "  about     - Learn about me",
        "  projects  - View my work",
        "  contact   - Get in touch",
        "  neofetch  - System summary",
        "  ls        - List files",
        "  cat       - Read a file",
        "  pacman    - System manager",
        "  clear     - Clear terminal",
        "  snake     - Play Snake game",
        "  tron      - Play Tron light cycles",
        "  help      - Show this help",
    ],
    about: () => [
        "User: Aditya Nakhate (H4D35-401)",
        "Role: Creative Developer & Engineer",
        "Stack: React, 3D Web, Systems Engineering",
        "Bio: Building vintage aesthetics and modern web engines. Creator of ZADE.",
    ],
    projects: () => [
        "Repository Highlights (GitHub: @H4D35-401)",
        "-----------------------------------------",
        "1. zade-release        - [Current Release]",
        "2. cassette-player     - [Portfolio Template]",
        "3. vintage-web         - [Retro Aesthetics]",
        "4. MorphoMyst          - [Generative Art]",
        "-----------------------------------------",
        "Total Public Repos: 9",
    ],
    gh: (args) => {
        if (args[0] === "profile") {
            return [
                "GitHub Profile: Aditya Nakhate (H4D35-401)",
                "-------------------------------------------",
                "Location: Earth",
                "Languages: JavaScript, CSS, HTML, Shell",
                "Focus: Portfolio Templates, Vintage Web, 3D Art",
                "Stats: 9 Public Repositories",
                "Status: Building the Metaverse",
            ];
        }
        if (args[0] === "list") {
            return [
                "H4D35-401 Public Repositories:",
                "  - zade-release",
                "  - cassette-player-portfolio",
                "  - H4D35-401",
                "  - vintage-web",
                "  - Happy-birthday-special",
                "  - webie",
                "  - MorphoMyst",
                "  - Vin",
                "  - Wc",
            ];
        }
        return ["usage: gh [profile|list]"];
    },
    whoami: () => ["Aditya Nakhate", "H4D35-401 // System Architect"],
    neofetch: () => [
        ARCH_LOGO,
        "zariel@archlinux",
        "----------------",
        "OS: BlackArch Linux x86_64",
        "Host: Portfolio v4.0 (Hyprland Rice)",
        "Kernel: 6.1.0-zen1-1-zen",
        "Uptime: 3 hours, 12 mins",
        "Shell: zsh 5.9",
        "DE: React 19",
        "WM: Hyprland (Illogical Impulse)",
        "CPU: Human Intelligence @ 5.0GHz",
        "Memory: Unlimited / Dedication",
        "GitHub: @H4D35-401 (9 Repos)",
    ],
    history: (args, state) => {
        return state.history
            .filter(item => item.type === "input")
            .map((item, i) => `${i + 1}  ${item.content.replace("[zariel@archlinux ~]$ ", "")}`);
    },
    ls: (args) => {
        if (args.includes("-a")) {
            return ["about.md", "projects.md", "contact.md", ".secret_easter_egg", ".git"];
        }
        return ["about.md", "projects.md", "contact.md"];
    },
    cat: (args) => {
        const file = args[0];
        if (file === "about.md") return Commands.about();
        if (file === "projects.md") return Commands.projects();
        if (file === "contact.md") return Commands.contact();
        if (file === ".secret_easter_egg") return ["Wait... how did you find this?", "The cake is a lie."];
        if (file === ".git") return ["Don't touch my configs! Try 'gh profile' instead."];
        return [`cat: ${file}: No such file or directory`];
    },
    pacman: (args) => {
        if (args[0] === "-S") {
            const skill = args[1] || "nothing";
            if (skill === "snake") return ["INSTALLING SNAKE GAME...", "Type 'snake' to play!"];
            if (skill === "gh") return ["RESOLVING DEPENDENCIES...", "gh-cli installed. Type 'gh profile' to see my stats!"];
            return [`resolving dependencies...`, `Packages (1) ${skill}-1.0-1`, `(1/1) installing ${skill} [####################] 100%`];
        }
        return ["error: no operation specified (use -h for help)"];
    },
    sudo: () => ["[sudo] password for zariel: ", "zariel is not in the sudoers file. This incident will be reported."],
};

const Terminal = () => {
    const { history, addHistory, clearHistory, isGlitched, setGlitched, isVimMode, setVimMode, isSnakeMode, setSnakeMode, isTronMode, setIsTronMode } = useTerminalStore();
    const { setTheme, openWindow, addNotification } = useDesktopStore();
    const [input, setInput] = useState("");
    const terminalEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, isSnakeMode, isVimMode, isTronMode]);

    const handleCommand = (e) => {
        if (e.key === "Enter") {
            const trimmedInput = input.trim();
            const [cmd, ...args] = trimmedInput.split(" ");

            addHistory({ type: "input", content: `[zariel@archlinux ~]$ ${input}` });

            if (cmd === "clear") {
                clearHistory();
            } else if (cmd === "rm" && args.includes("-rf") && args.includes("/")) {
                setGlitched(true);
                addHistory({ type: "output", content: "CRITICAL SYSTEM ERROR: ROOT PARTITION DELETED" });
                setTimeout(() => setGlitched(false), 3000);
            } else if (cmd === "vim") {
                setVimMode(true);
            } else if (cmd === "ranger") {
                openWindow("ranger");
                addHistory({ type: "output", content: "Launching Ranger File Manager..." });
            } else if (cmd === "snake") {
                setSnakeMode(true);
            } else if (cmd === "tron") {
                setIsTronMode(true);
            } else if (cmd === "wal") {
                const themeMap = {
                    "--theme=default": "default",
                    "--theme=matrix": "matrix",
                    "--theme=cyan": "cyan",
                    "--theme=gold": "gold",
                    "--theme=tokyo-night": "tokyo-night",
                    "--theme=dracula": "dracula",
                    "--theme=nord": "nord",
                    "--theme=gruvbox": "gruvbox",
                    "--theme=cyberpunk": "cyberpunk",
                    "--theme=monokai": "monokai",
                    "--theme=solarized": "solarized",
                    "--theme=catppuccin": "catppuccin",
                    "--theme=one-dark": "one-dark",
                    "--theme=rose-pine": "rose-pine",
                };
                const themeArgs = args.find(a => a.startsWith("--theme="));
                const themeName = themeMap[themeArgs] || "default";

                setTheme(themeName);
                addHistory({ type: "output", content: `[wal] generating colorscheme: ${themeName}... done.` });
                addNotification({
                    type: 'success',
                    title: 'Theme Changed',
                    message: `Applied ${themeName} colorscheme`,
                    duration: 2000
                });
            } else if (cmd === "sudo") {
                Commands.sudo().forEach(line => addHistory({ type: "output", content: line }));
            } else if (Commands[cmd]) {
                const results = Commands[cmd](args, { history });
                results.forEach(line => addHistory({ type: "output", content: line }));
            } else if (trimmedInput !== "") {
                addHistory({ type: "output", content: `zsh: command not found: ${cmd}` });
            }

            setInput("");
        }
    };

    if (isSnakeMode) return <div className="crt-screen w-full h-full"><SnakeGame onExit={() => setSnakeMode(false)} /></div>;
    if (isTronMode) return <div className="crt-screen w-full h-full"><TronGame /></div>;


    return (
        <div
            className={`w-full h-full p-6 overflow-y-auto ${isGlitched ? "glitch" : ""}`}
            onClick={() => inputRef.current?.focus()}
        >
            {isVimMode ? (
                <div className="flex flex-col items-center justify-center h-full text-white">
                    <pre className="text-blue-400 mb-8">{ARCH_LOGO}</pre>
                    <p className="text-xl mb-4 font-bold">VIM v9.0</p>
                    <p className="text-slate-400">Recording @r...</p>
                    <div className="mt-10 p-4 border border-white/20 glass rounded-lg text-center">
                        <button onClick={() => setVimMode(false)} className="text-sm text-blue-500 hover:scale-110 transition-transform">
                            :q! (click to exit the joke)
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {history.map((item, i) => (
                        <div key={i} className={`mb-1 whitespace-pre-wrap ${item.type === 'input' ? 'arch-blue font-bold' : 'arch-white opacity-90'}`}>
                            {item.content}
                        </div>
                    ))}

                    <div className="flex mt-2">
                        <span className="arch-blue font-bold mr-2 text-nowrap">[zariel@archlinux ~]$</span>
                        <input
                            ref={inputRef}
                            autoFocus
                            className="bg-transparent border-none outline-none flex-1 arch-white"
                            style={{ caretColor: 'var(--color-primary)' }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                        />
                    </div>
                    <div ref={terminalEndRef} />
                </div>
            )}
        </div>
    );
};

export default Terminal;
