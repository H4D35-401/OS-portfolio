import React, { useState } from 'react';
import { Folder, File, ChevronRight, HardDrive } from 'lucide-react';
import useDesktopStore from '../store/useDesktopStore';

const fileSystem = {
    name: "home",
    type: "dir",
    children: [
        {
            name: "zariel",
            type: "dir",
            children: [
                {
                    name: "projects", type: "dir", children: [
                        { name: "zade-release", type: "file", size: "1.2 MB" },
                        { name: "vintage-web", type: "file", size: "850 KB" },
                        { name: "cassette-player", type: "file", size: "2.1 MB" }
                    ]
                },
                { name: "about.md", type: "file", size: "2 KB" },
                { name: "contact.md", type: "file", size: "1 KB" },
                {
                    name: ".config", type: "dir", children: [
                        { name: "hypr", type: "dir", children: [] },
                        { name: "nvim", type: "dir", children: [] }
                    ]
                }
            ]
        }
    ]
};

const Ranger = () => {
    const [path, setPath] = useState(["home", "zariel"]);
    const [selected, setSelected] = useState("projects");
    const { openWindow } = useDesktopStore();

    // Helper to get current directory object
    const getCurrentDir = () => {
        let current = fileSystem;
        for (const p of path.slice(1)) { // Skip 'home' root
            if (current.children) {
                current = current.children.find(c => c.name === p) || current;
            }
        }
        return current;
    };

    const currentDir = getCurrentDir();

    const handleNavigate = (item) => {
        setSelected(item.name);
        if (item.type === 'dir') {
            setPath([...path, item.name]);
        }
    };

    const handleBack = () => {
        if (path.length > 2) {
            setPath(path.slice(0, -1));
        }
    };

    return (
        <div className="w-full h-full bg-[#101010] text-gray-300 font-mono text-xs flex">
            {/* Left Column: Parents */}
            <div className="w-1/4 border-r border-[#333] p-2 flex flex-col gap-1 text-gray-500">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333] text-blue-500">
                    <HardDrive size={14} />
                    <span>/home/zariel</span>
                </div>
                {path.length > 2 && (
                    <button onClick={handleBack} className="text-left hover:text-white">../</button>
                )}
                {path.slice(0, -1).map((p, i) => (
                    <div key={i} className="pl-2">{p}/</div>
                ))}
            </div>

            {/* Middle Column: Current Dir */}
            <div className="w-1/4 border-r border-[#333] p-2 flex flex-col gap-1">
                {currentDir.children?.map(item => (
                    <button
                        key={item.name}
                        onClick={() => handleNavigate(item)}
                        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer group ${selected === item.name ? 'bg-blue-900/30 text-blue-400' : 'hover:bg-[#222]'}`}
                    >
                        <div className="flex items-center gap-2">
                            {item.type === 'dir' ? <Folder size={14} className="text-blue-500" /> : <File size={14} />}
                            <span>{item.name}</span>
                        </div>
                        {item.type === 'dir' && <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />}
                    </button>
                ))}
            </div>

            {/* Right Column: Preview */}
            <div className="flex-1 p-4 bg-[#0a0a0a]">
                <div className="border border-[#333] h-full p-4 font-mono text-gray-400">
                    <div className="text-xl font-bold text-white mb-4">{selected}</div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between border-b border-[#333] pb-1">
                            <span>Type:</span>
                            <span className="text-white">{selected.includes('.') ? 'File' : 'Directory'}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#333] pb-1">
                            <span>Permissions:</span>
                            <span className="text-white">drwxr-xr-x</span>
                        </div>
                        <div className="flex justify-between border-b border-[#333] pb-1">
                            <span>Owner:</span>
                            <span className="text-white">zariel:users</span>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-600">
                        {selected.includes('.') ? '[File Preview Unavailable in TTY]' : '[Directory Content]'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ranger;
