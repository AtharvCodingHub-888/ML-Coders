'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ScanLine, Skull, ShieldBan } from 'lucide-react';

interface Point {
    id: number;
    x: number;
    y: number;
    isOutlier: boolean;
    state: 'active' | 'caught' | 'missed';
}

const GAME_DURATION = 30; // seconds

export default function OutlierSweeper() {
    const [points, setPoints] = useState<Point[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [sweeperPos, setSweeperPos] = useState({ x: 50, y: 50 });
    const containerRef = useRef<HTMLDivElement>(null);

    const generateCluster = useCallback(() => {
        const newPoints: Point[] = [];
        const numInliers = 40;
        const numOutliers = 8;

        // Generate inliers loosely clustered in the center
        for (let i = 0; i < numInliers; i++) {
            newPoints.push({
                id: i,
                x: 30 + Math.random() * 40, // 30% to 70% width
                y: 30 + Math.random() * 40, // 30% to 70% height
                isOutlier: false,
                state: 'active'
            });
        }

        // Generate outliers around the edges
        for (let i = 0; i < numOutliers; i++) {
            const edge = Math.floor(Math.random() * 4);
            let x = 0, y = 0;
            switch (edge) {
                case 0: x = Math.random() * 100; y = Math.random() * 15; break; // Top
                case 1: x = Math.random() * 100; y = 85 + Math.random() * 15; break; // Bottom
                case 2: x = Math.random() * 15; y = Math.random() * 100; break; // Left
                case 3: x = 85 + Math.random() * 15; y = Math.random() * 100; break; // Right
            }
            newPoints.push({
                id: numInliers + i,
                x, y,
                isOutlier: true,
                state: 'active'
            });
        }

        setPoints(newPoints.sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing') {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('gameover');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || gameState !== 'playing') return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setSweeperPos({ x, y });
    };

    const handleSweep = (id: number, isOutlier: boolean) => {
        if (gameState !== 'playing') return;

        setPoints(current => current.map(p => {
            if (p.id === id && p.state === 'active') {
                if (isOutlier) {
                    setScore(s => s + 100);
                    return { ...p, state: 'caught' };
                } else {
                    setScore(s => Math.max(0, s - 50));
                    return { ...p, state: 'caught' }; // Caught an inlier! Bad!
                }
            }
            return p;
        }));

        // Check if all outliers are caught to spawn a new cluster
        if (isOutlier) {
            setPoints(current => {
                const activeOutliers = current.filter(p => p.isOutlier && p.state === 'active');
                if (activeOutliers.length <= 1) { // <= 1 because state hasn't fully updated yet in this scope
                    setTimeout(generateCluster, 500);
                }
                return current;
            });
        }
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameState('playing');
        generateCluster();
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-between bg-[#0a0f18]/90 backdrop-blur-xl rounded-3xl border border-white/5 p-8 relative overflow-hidden font-mono shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
            </div>

            {/* HUD */}
            <div className="w-full flex justify-between items-start relative z-20 pointer-events-none">
                <div className="flex flex-col gap-1 bg-black/40 p-4 rounded-xl border border-white/10 pointer-events-auto">
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ScanLine className="w-3 h-3 text-purple-400" /> Anomalies Cleared
                    </span>
                    <span className="text-3xl font-black text-white tracking-tighter tabular-nums text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        {score.toLocaleString()}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-1 bg-black/40 p-4 rounded-xl border border-white/10 pointer-events-auto min-w-[120px]">
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Time Remaining</span>
                    <span className={`text-2xl font-black tracking-tighter tabular-nums ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Scatter Plot Arena */}
            <div
                ref={containerRef}
                className="flex-grow w-full max-w-2xl relative my-8 border border-white/10 rounded-2xl bg-black/20 cursor-crosshair overflow-hidden"
                onMouseMove={handleMouseMove}
            >
                {/* Axes */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-white/20" />
                <div className="absolute bottom-4 left-4 right-4 h-px bg-white/20" />

                {gameState === 'playing' && (
                    <>
                        {/* Sweeper Reticle */}
                        <motion.div
                            className="absolute w-12 h-12 -ml-6 -mt-6 border border-purple-400/50 rounded-full pointer-events-none flex items-center justify-center bg-purple-500/10 backdrop-blur-[1px] z-50 mix-blend-screen"
                            animate={{ x: `${sweeperPos.x}%`, y: `${sweeperPos.y}%` }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
                        >
                            <Target className="w-6 h-6 text-purple-400 opacity-50" strokeWidth={1} />
                        </motion.div>

                        {/* Data Points */}
                        <AnimatePresence>
                            {points.map((p) => {
                                if (p.state !== 'active') return null;
                                return (
                                    <motion.button
                                        key={p.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: p.isOutlier ? 0.9 : 0.6 }}
                                        exit={{ scale: p.isOutlier ? 2 : 0, opacity: 0 }}
                                        className={`absolute w-3 h-3 rounded-full -ml-[6px] -mt-[6px] transition-colors ${p.isOutlier
                                                ? 'bg-red-400 hover:bg-red-300 hover:scale-150 z-30 shadow-[0_0_10px_rgba(248,113,113,0.8)]'
                                                : 'bg-cyan-400/50 hover:bg-red-500 hover:scale-125 z-20'
                                            }`}
                                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                                        onClick={() => handleSweep(p.id, p.isOutlier)}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </>
                )}

                {/* Overlays */}
                <AnimatePresence mode="wait">
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50 rounded-2xl"
                        >
                            <div className="w-16 h-16 bg-purple-500/20 border border-purple-500/50 rounded-2xl flex items-center justify-center mb-6">
                                <ScanLine className="w-8 h-8 text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-4">Outlier Sweeper</h2>
                            <p className="text-white/60 text-xs uppercase tracking-widest text-center max-w-sm mb-8 leading-relaxed">
                                Identify and eliminate statistical anomalies (red glowing nodes) beyond the acceptable variance threshold. Do not delete valid clustered data!
                            </p>
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-purple-500 text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105"
                            >
                                Initiate Sweep
                            </button>
                        </motion.div>
                    )}

                    {gameState === 'gameover' && (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 z-50 rounded-2xl border border-white/10"
                        >
                            <ShieldBan className="w-16 h-16 text-purple-500 mb-6" />
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Scan Complete</h2>
                            <div className="mt-6 mb-8 text-center flex flex-col gap-2">
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Final Precision Score</p>
                                <p className="text-6xl font-black text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                                    {score.toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-8 py-4 bg-white text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-gray-200 transition-all hover:scale-105"
                            >
                                Run Diagnostics Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
