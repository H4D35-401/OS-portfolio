import React, { useState, useEffect } from "react";

const SnakeGame = ({ onExit }) => {
    const GRID_SIZE = 20;
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e) => {
            // ESC to exit game - use capture to catch before other handlers
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopImmediatePropagation();
                onExit();
                return false;
            }

            if (isGameOver) return;

            const key = e.key.toLowerCase();

            // Arrow keys and WASD keys
            if ((key === 'arrowup' || key === 'w') && direction.y !== 1) {
                setDirection({ x: 0, y: -1 });
            } else if ((key === 'arrowdown' || key === 's') && direction.y !== -1) {
                setDirection({ x: 0, y: 1 });
            } else if ((key === 'arrowleft' || key === 'a') && direction.x !== 1) {
                setDirection({ x: -1, y: 0 });
            } else if ((key === 'arrowright' || key === 'd') && direction.x !== -1) {
                setDirection({ x: 1, y: 0 });
            }
        };

        // Use capture:true to intercept ESC before React's event system
        window.addEventListener("keydown", handleKeyPress, { capture: true });

        if (isGameOver) return () => {
            window.removeEventListener("keydown", handleKeyPress, { capture: true });
        };

        const moveSnake = () => {
            setSnake((prev) => {
                const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || prev.some(s => s.x === head.x && s.y === head.y)) {
                    setIsGameOver(true);
                    return prev;
                }
                const newSnake = [head, ...prev];
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 1);
                    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
                } else {
                    newSnake.pop();
                }
                return newSnake;
            });
        };

        const gameInterval = setInterval(moveSnake, 150);
        return () => {
            window.removeEventListener("keydown", handleKeyPress, { capture: true });
            clearInterval(gameInterval);
        };
    }, [direction, food, isGameOver, onExit]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-blue-400 font-mono p-4">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold mb-1">TERMINAL SNAKE</h2>
                <p className="text-sm opacity-70">SCORE: {score} | ESC TO EXIT</p>
                {isGameOver && <p className="text-red-500 font-bold mt-2 animate-pulse">GAME OVER! PRESS ESC</p>}
            </div>

            <div
                className="grid gap-px border-2 border-blue-900 bg-blue-900/20"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    width: 'min(80vw, 400px)',
                    height: 'min(80vw, 400px)'
                }}
            >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const isSnake = snake.some(s => s.x === x && s.y === y);
                    const isFood = food.x === x && food.y === y;
                    return (
                        <div
                            key={i}
                            className={`aspect-square ${isSnake ? "bg-blue-400" : isFood ? "bg-red-500 animate-pulse" : "bg-black/40"}`}
                        />
                    );
                })}
            </div>

            <div className="mt-6 text-xs opacity-50 text-center max-w-xs">
                Use Arrow Keys or WASD to move. Eat the red pixels to grow. Don't hit the walls or yourself!
            </div>
        </div>
    );
};

export default SnakeGame;
