'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, AlertTriangle, ShieldCheck, Zap, ServerCrash } from 'lucide-react';

const DATA_DISTRIBUTIONS = [
    { type: 'Normal', desc: 'Symmetrical distribution, few outliers.', correct: 'Mean', value: '42.5' },
    { type: 'Skewed', desc: 'Asymmetrical distribution, heavy tail.', correct: 'Median', value: '180k' },
    { type: 'Categorical', desc: 'Discrete, non-numerical groups.', correct: 'Mode', value: '"Red"' },
    { type: 'Corrupted', desc: 'Over 80% data missing or invalid.', correct: 'Drop', value: 'NaN' },
];

const IMPUTATION_STRATEGIES = [
    { id: 'Mean', color: 'cyan' },
    { id: 'Median', color: 'purple' },
    { id: 'Mode', color: 'blue' },
    { id: 'Drop', color: 'red' },
];

export default function MissingValueImputer() {
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(100);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [currentData, setCurrentData] = useState(DATA_DISTRIBUTIONS[0]);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', text: string } | null>(null);
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; color: string }[]>([]);

    const spawnData = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * DATA_DISTRIBUTIONS.length);
        setCurrentData(DATA_DISTRIBUTIONS[randomIndex]);
    }, []);

    useEffect(() => {
        if (gameState === 'playing') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        setGameState('gameover');
                        return 0;
                    }
                    return prev - 0.5; // Drain speed
                });
            }, 100);
            return () => clearInterval(timer);
        }
    }, [gameState]);

    const handleImpute = (strategy: string) => {
        if (gameState !== 'playing') return;

        if (strategy === currentData.correct) {
            const points = 100 + (combo * 50);
            setScore(prev => prev + points);
            setCombo(prev => prev + 1);
            setTimeLeft(prev => Math.min(100, prev + 5)); // Gain time back

            const id = Date.now();
            setFloatingTexts(prev => [...prev, { id, text: `+${points} XP`, color: '#00f0ff' }]);
            setTimeout(() => setFloatingTexts(p => p.filter(t => t.id !== id)), 1000);

            spawnData();
        } else {
            setCombo(0);
            setTimeLeft(prev => Math.max(0, prev - 15)); // Time penalty
            setFeedback({ type: 'wrong', text: 'CORRUPTION DETECTED' });
            setTimeout(() => setFeedback(null), 800);
        }
    };

    const startGame = () => {
        setScore(0);
        setCombo(0);
        setTimeLeft(100);
        setGameState('playing');
        spawnData();
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-between bg-[#0a0f18]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-8 relative overflow-hidden font-mono shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Background Grid & Glows */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full" />
            </div>

            {/* HUD */}
            <div className="w-full flex justify-between items-start relative z-20">
                <div className="flex flex-col gap-1 bg-black/40 p-4 rounded-xl border border-white/10">
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Database className="w-3 h-3 text-cyan-400" /> Processed Data
                    </span>
                    <span className="text-3xl font-black text-white tracking-tighter tabular-nums">
                        {score.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                        Multiplier x{combo + 1}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-2 bg-black/40 p-4 rounded-xl border border-white/10 w-48">
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">System Integrity</span>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${timeLeft > 30 ? 'bg-cyan-400' : 'bg-red-500'}`}
                            animate={{ width: `${timeLeft}%` }}
                            transition={{ duration: 0.1, ease: 'linear' }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Game Stage */}
            <div className="flex-grow flex flex-col items-center justify-center relative z-20 w-full py-8">
                <AnimatePresence mode="wait">
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8 max-w-md bg-black/40 p-10 rounded-3xl border border-white/10 backdrop-blur-md"
                        >
                            <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Value Imputer</h2>
                                <p className="text-white/50 text-xs uppercase tracking-widest leading-relaxed">
                                    Incoming data streams contain missing values (NaN). Analyze the distribution type and apply the correct statistical imputation strategy before system failure.
                                </p>
                            </div>
                            <button
                                onClick={startGame}
                                className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95"
                            >
                                Start Processing
                            </button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-12 w-full max-w-3xl"
                        >
                            {/* Data Packet */}
                            <motion.div
                                key={currentData.type + score}
                                initial={{ scale: 0.8, opacity: 0, rotateX: 90 }}
                                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                                className="w-full bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-2xl relative overflow-hidden group shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-30">
                                    <AlertTriangle className="w-12 h-12 text-yellow-500 animate-pulse" />
                                </div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    <span className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-bold">Incoming Missing Value</span>
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase">{currentData.type} Distribution</h3>
                                        <p className="text-sm text-white/50 font-mono mt-2">{currentData.desc}</p>
                                    </div>
                                    <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-black/50 rounded-lg border border-white/5 w-fit">
                                        <span className="text-white/30 text-xs uppercase">Preview:</span>
                                        <span className="font-mono font-bold text-white opacity-50 blur-[2px] select-none text-lg">NaN</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Controls */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                {IMPUTATION_STRATEGIES.map((strategy) => {
                                    const colors: Record<string, string> = {
                                        cyan: 'border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300',
                                        purple: 'border-purple-500/30 hover:bg-purple-500/20 text-purple-300',
                                        blue: 'border-blue-500/30 hover:bg-blue-500/20 text-blue-300',
                                        red: 'border-red-500/30 hover:bg-red-500/20 text-red-300',
                                    };
                                    return (
                                        <button
                                            key={strategy.id}
                                            onClick={() => handleImpute(strategy.id)}
                                            className={`p-6 rounded-2xl bg-black/60 border backdrop-blur-md transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-1 hover:shadow-lg ${colors[strategy.color]}`}
                                        >
                                            <Zap className="w-5 h-5 opacity-50" />
                                            <span className="font-black uppercase tracking-widest text-sm">{strategy.id}</span>
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
                            className="text-center space-y-8 bg-red-950/20 p-12 rounded-3xl border border-red-500/30 backdrop-blur-md"
                        >
                            <div className="space-y-4">
                                <ServerCrash className="w-16 h-16 text-red-500 mx-auto" />
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-red-500">System Integrity Compromised</h2>
                                <p className="text-white/60 font-mono text-sm max-w-sm mx-auto">Pipeline failed due to incorrect imputation strategies or timeout.</p>
                                <div className="pt-6">
                                    <p className="text-[10px] text-red-400/50 uppercase tracking-[0.3em] mb-2">Total Processed Data</p>
                                    <p className="text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{score.toLocaleString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-12 py-4 bg-white text-black font-black uppercase text-sm tracking-widest rounded-xl hover:bg-gray-200 transition-all hover:scale-105"
                            >
                                Reboot Pipeline
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error Overlay */}
            <AnimatePresence>
                {feedback && feedback.type === 'wrong' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-500/10 pointer-events-none z-50 flex items-center justify-center"
                    >
                        <div className="text-red-500 font-black text-4xl uppercase tracking-tighter bg-black/50 px-8 py-4 rounded-xl border border-red-500/50 backdrop-blur-sm">
                            {feedback.text}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating text for points */}
            <AnimatePresence>
                {floatingTexts.map(ft => (
                    <motion.div
                        key={ft.id}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -100, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 font-black text-2xl tracking-tighter pointer-events-none"
                        style={{ color: ft.color, textShadow: `0 0 20px ${ft.color}` }}
                    >
                        {ft.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
