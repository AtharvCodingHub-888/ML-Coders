'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Zap, AlertCircle } from 'lucide-react';

const DATA_POOL = [
    { value: '42', type: 'int' },
    { value: '"hello"', type: 'str' },
    { value: '3.14', type: 'float' },
    { value: 'True', type: 'bool' },
    { value: '7', type: 'int' },
    { value: '"python"', type: 'str' },
    { value: '0.001', type: 'float' },
    { value: 'False', type: 'bool' },
    { value: '-10', type: 'int' },
    { value: '"AI"', type: 'str' },
    { value: '9.81', type: 'float' },
    { value: 'None', type: 'bool' }, // In this simple game, we'll treat None as a bool-ish for classification or just a "non-int/float/str"
    { value: '2.718', type: 'float' },
    { value: '"[1, 2]"', type: 'str' },
    { value: '1000', type: 'int' },
];

const BUCKETS = [
    { id: 'int', label: 'int', color: 'cyan' },
    { id: 'float', label: 'float', color: 'purple' },
    { id: 'str', label: 'str', color: 'blue' },
    { id: 'bool', label: 'bool', color: 'orange' },
];

export default function PythonDataTypesArcade() {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentData, setCurrentData] = useState(DATA_POOL[0]);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', text: string } | null>(null);

    const nextData = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * DATA_POOL.length);
        setCurrentData(DATA_POOL[randomIndex]);
    }, []);

    const handleClassify = (typeId: string) => {
        if (gameState !== 'playing') return;

        if (typeId === currentData.type) {
            setScore(prev => prev + 100);
            setFeedback({ type: 'correct', text: '+100 XP' });
            nextData();
        } else {
            setLives(prev => prev - 1);
            setFeedback({ type: 'wrong', text: 'SYSTEM ERROR' });
            if (lives <= 1) {
                setGameState('gameover');
            } else {
                nextData();
            }
        }

        setTimeout(() => setFeedback(null), 1000);
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setGameState('playing');
        nextData();
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-between bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 p-12 relative overflow-hidden font-mono">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
            </div>

            {/* HUD */}
            <div className="w-full flex justify-between items-center relative z-20">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Sync Score</span>
                    <span className="text-3xl font-black text-cyan-400 tracking-tighter tabular-nums">
                        {score.toLocaleString()}
                    </span>
                </div>

                <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Shield
                            key={i}
                            className={`w-6 h-6 transition-all duration-500 ${i < lives ? 'text-cyan-400 fill-cyan-400/20' : 'text-white/5 opacity-20'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-grow flex flex-col items-center justify-center relative z-20 w-full py-12">
                <AnimatePresence mode="wait">
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic">Data Arena</h2>
                                <p className="text-white/40 text-xs uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                    Classify the incoming data packets into their correct architectural types. 3 Errors = System Shutdown.
                                </p>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-12 py-4 bg-cyan-500 text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                            >
                                Initialize Loop
                            </button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-12"
                        >
                            <motion.div
                                key={currentData.value}
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] relative group"
                            >
                                <div className="absolute -top-3 -left-3">
                                    <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                                </div>
                                <span className="text-5xl font-black tracking-tighter text-white font-mono">
                                    {currentData.value}
                                </span>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4">
                                {BUCKETS.map((bucket) => {
                                    const colors: any = {
                                        cyan: 'border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 shadow-cyan-500/20',
                                        purple: 'border-purple-500/30 hover:bg-purple-500/10 text-purple-400 shadow-purple-500/20',
                                        blue: 'border-blue-500/30 hover:bg-blue-500/10 text-blue-400 shadow-blue-500/20',
                                        orange: 'border-orange-500/30 hover:bg-orange-500/10 text-orange-400 shadow-orange-500/20',
                                    };
                                    return (
                                        <button
                                            key={bucket.id}
                                            onClick={() => handleClassify(bucket.id)}
                                            className={`py-4 px-6 rounded-xl border backdrop-blur-sm transition-all duration-300 font-black uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_0_20px_var(--tw-shadow-color)] ${colors[bucket.color]}`}
                                        >
                                            {bucket.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'gameover' && (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="space-y-4">
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-red-500">System Failure</h2>
                                <div className="space-y-1">
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest">Final Data Integration</p>
                                    <p className="text-4xl font-black text-white">{score.toLocaleString()} XP</p>
                                </div>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-12 py-4 bg-white text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Reboot System
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Overlay */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -50, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 font-black text-2xl tracking-tighter uppercase z-50 ${feedback.type === 'correct' ? 'text-cyan-400' : 'text-red-500'}`}
                            style={{ textShadow: feedback.type === 'correct' ? '0 0 20px rgba(34,211,238,0.5)' : '0 0 20px rgba(239,68,68,0.5)' }}
                        >
                            {feedback.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="w-full pt-8 border-t border-white/5 flex justify-between items-center relative z-20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    <span className="text-[8px] text-white/20 uppercase tracking-[0.4em]">Node: DataArcade_01</span>
                </div>
                <div className="text-[8px] text-white/20 uppercase tracking-[0.4em]">Calibration: Stable</div>
            </div>
        </div>
    );
}
