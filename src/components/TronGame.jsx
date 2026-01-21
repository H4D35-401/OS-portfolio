import React, { useState, useEffect, useCallback } from 'react';
import useTerminalStore from '../store/useTerminalStore';

const GRID_SIZE = 40;
const CELL_SIZE = 15;

const TronGame = () => {
    const { setIsTronMode } = useTerminalStore();
    const [player, setPlayer] = useState({ x: 5, y: 5, direction: 'RIGHT', trail: [{ x: 5, y: 5 }] });
    const [ai, setAi] = useState({ x: 34, y: 34, direction: 'LEFT', trail: [{ x: 34, y: 34 }] });
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

    // Handle keyboard input
    const handleKeyPress = useCallback((e) => {
        // ESC to exit - priority check
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopImmediatePropagation();
            setIsTronMode(false);
            return false;
        }

        if (gameOver) return;

        const key = e.key.toLowerCase();

        // Arrow keys
        if (key === 'arrowup' && player.direction !== 'DOWN') setPlayer(p => ({ ...p, direction: 'UP' }));
        else if (key === 'arrowdown' && player.direction !== 'UP') setPlayer(p => ({ ...p, direction: 'DOWN' }));
        else if (key === 'arrowleft' && player.direction !== 'RIGHT') setPlayer(p => ({ ...p, direction: 'LEFT' }));
        else if (key === 'arrowright' && player.direction !== 'LEFT') setPlayer(p => ({ ...p, direction: 'RIGHT' }));

        // WASD keys
        else if (key === 'w' && player.direction !== 'DOWN') setPlayer(p => ({ ...p, direction: 'UP' }));
        else if (key === 's' && player.direction !== 'UP') setPlayer(p => ({ ...p, direction: 'DOWN' }));
        else if (key === 'a' && player.direction !== 'RIGHT') setPlayer(p => ({ ...p, direction: 'LEFT' }));
        else if (key === 'd' && player.direction !== 'LEFT') setPlayer(p => ({ ...p, direction: 'RIGHT' }));
    }, [player.direction, gameOver, setIsTronMode]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyPress, { capture: true });
    }, [handleKeyPress]);

    // AI logic - simple chase with trail avoidance
    const moveAI = useCallback(() => {
        const dx = player.x - ai.x;
        const dy = player.y - ai.y;

        let newDirection = ai.direction;

        // Prioritize moving toward player
        if (Math.abs(dx) > Math.abs(dy)) {
            newDirection = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
            newDirection = dy > 0 ? 'DOWN' : 'UP';
        }

        // Check if proposed direction hits a trail or wall
        const testPos = getNextPosition(ai.x, ai.y, newDirection);
        const hitsTrail = [...player.trail, ...ai.trail].some(t => t.x === testPos.x && t.y === testPos.y);
        const hitsWall = testPos.x < 0 || testPos.x >= GRID_SIZE || testPos.y < 0 || testPos.y >= GRID_SIZE;

        if (hitsTrail || hitsWall) {
            // Try alternative directions
            const alternatives = ['UP', 'DOWN', 'LEFT', 'RIGHT'].filter(d => d !== ai.direction);
            for (const altDir of alternatives) {
                const altPos = getNextPosition(ai.x, ai.y, altDir);
                const altHitsTrail = [...player.trail, ...ai.trail].some(t => t.x === altPos.x && t.y === altPos.y);
                const altHitsWall = altPos.x < 0 || altPos.x >= GRID_SIZE || altPos.y < 0 || altPos.y >= GRID_SIZE;
                if (!altHitsTrail && !altHitsWall) {
                    newDirection = altDir;
                    break;
                }
            }
        }

        setAi(a => ({ ...a, direction: newDirection }));
    }, [player, ai]);

    const getNextPosition = (x, y, direction) => {
        let newX = x;
        let newY = y;
        if (direction === 'UP') newY--;
        if (direction === 'DOWN') newY++;
        if (direction === 'LEFT') newX--;
        if (direction === 'RIGHT') newX++;
        return { x: newX, y: newY };
    };

    // Game loop
    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setPlayer(p => {
                const newPos = getNextPosition(p.x, p.y, p.direction);

                // Check wall collision
                if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
                    setGameOver(true);
                    setWinner('AI');
                    return p;
                }

                // Check trail collision
                if ([...p.trail, ...ai.trail].some(t => t.x === newPos.x && t.y === newPos.y)) {
                    setGameOver(true);
                    setWinner('AI');
                    return p;
                }

                return { ...p, x: newPos.x, y: newPos.y, trail: [...p.trail, newPos] };
            });

            setAi(a => {
                const newPos = getNextPosition(a.x, a.y, a.direction);

                // Check wall collision
                if (newPos.x < 0 || newPos.x >= GRID_SIZE || newPos.y < 0 || newPos.y >= GRID_SIZE) {
                    setGameOver(true);
                    setWinner('PLAYER');
                    return a;
                }

                // Check trail collision
                if ([...player.trail, ...a.trail].some(t => t.x === newPos.x && t.y === newPos.y)) {
                    setGameOver(true);
                    setWinner('PLAYER');
                    return a;
                }

                return { ...a, x: newPos.x, y: newPos.y, trail: [...a.trail, newPos] };
            });

            moveAI();
        }, 150);

        return () => clearInterval(interval);
    }, [gameOver, player, ai, moveAI]);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-black/90 p-4">
            <div className="mb-4 text-cyan-400 font-mono text-sm">
                {gameOver ? (
                    <div className="text-center">
                        <div className="text-2xl mb-2">{winner === 'PLAYER' ? '🏆 YOU WIN!' : '💀 AI WINS!'}</div>
                        <div className="text-zinc-500">Press ESC to exit</div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-lg mb-1">[TRON] LIGHT CYCLE BATTLE</div>
                        <div className="text-zinc-500 text-xs">Controls: Arrow Keys / WASD | ESC to Exit</div>
                    </div>
                )}
            </div>

            <div
                className="relative border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                style={{
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE,
                    backgroundColor: '#000'
                }}
            >
                {/* Player trail */}
                {player.trail.map((segment, i) => {
                    const isHead = i === player.trail.length - 1;
                    const direction = isHead ? player.direction : null;

                    // Triangle pointing in direction of travel
                    let clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'; // UP default
                    if (direction === 'DOWN') clipPath = 'polygon(0% 0%, 100% 0%, 50% 100%)';
                    else if (direction === 'LEFT') clipPath = 'polygon(100% 0%, 100% 100%, 0% 50%)';
                    else if (direction === 'RIGHT') clipPath = 'polygon(0% 0%, 100% 50%, 0% 100%)';

                    return (
                        <div
                            key={`p-${i}`}
                            className={`absolute ${isHead ? 'bg-cyan-300' : 'bg-cyan-500'} shadow-[0_0_10px_rgba(0,255,255,0.8)]`}
                            style={{
                                left: segment.x * CELL_SIZE,
                                top: segment.y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                clipPath: isHead ? clipPath : undefined,
                            }}
                        />
                    );
                })}

                {/* AI trail */}
                {ai.trail.map((segment, i) => {
                    const isHead = i === ai.trail.length - 1;
                    const direction = isHead ? ai.direction : null;

                    // Triangle pointing in direction of travel
                    let clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'; // UP default
                    if (direction === 'DOWN') clipPath = 'polygon(0% 0%, 100% 0%, 50% 100%)';
                    else if (direction === 'LEFT') clipPath = 'polygon(100% 0%, 100% 100%, 0% 50%)';
                    else if (direction === 'RIGHT') clipPath = 'polygon(0% 0%, 100% 50%, 0% 100%)';

                    return (
                        <div
                            key={`ai-${i}`}
                            className={`absolute ${isHead ? 'bg-red-400' : 'bg-red-600'} shadow-[0_0_10px_rgba(255,0,0,0.8)]`}
                            style={{
                                left: segment.x * CELL_SIZE,
                                top: segment.y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                clipPath: isHead ? clipPath : undefined,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TronGame;
