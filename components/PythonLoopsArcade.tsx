'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RotateCw, Play, RotateCcw, ShieldAlert, CheckCircle2, Terminal } from 'lucide-react';

const GRID_SIZE = 5;
const INITIAL_ROBOT = { x: 0, y: 0, dir: 0 }; // dir: 0=right, 90=down, 180=left, 270=up
const OBSTACLES = [
    { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 0 }
];
const TARGET = { x: 4, y: 4 };

export default function PythonLoopsArcade() {
    const [robot, setRobot] = useState(INITIAL_ROBOT);
    const [commands, setCommands] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [message, setMessage] = useState('Enter loop commands to guide the robot.');
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'fail'>('idle');
    const [stepIndex, setStepIndex] = useState(-1);

    const runCode = async () => {
        if (isExecuting) return;
        setIsExecuting(true);
        setStatus('running');
        setMessage('Executing binary logic...');
        setRobot(INITIAL_ROBOT);

        const lines = commands.split('\n').map(l => l.trim()).filter(l => l);
        let expandedCommands: string[] = [];

        // Simple parser for "for i in range(n):"
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('for') && line.includes('range(')) {
                const match = line.match(/range\((\d+)\)/);
                if (match) {
                    const n = parseInt(match[1]);
                    const innerCommands: string[] = [];
                    // Look for indented commands (simulated by non-for lines following)
                    let j = i + 1;
                    while (j < lines.length && !lines[j].startsWith('for')) {
                        innerCommands.push(lines[j]);
                        j++;
                    }
                    for (let k = 0; k < n; k++) {
                        expandedCommands.push(...innerCommands);
                    }
                    i = j - 1;
                }
            } else {
                expandedCommands.push(line);
            }
        }

        // Execute step by step
        let currentRobot = { ...INITIAL_ROBOT };
        for (let k = 0; k < expandedCommands.length; k++) {
            setStepIndex(k);
            const cmd = expandedCommands[k].toLowerCase();
            let nextRobot = { ...currentRobot };

            if (cmd.includes('move_forward')) {
                if (currentRobot.dir === 0) nextRobot.x += 1;
                if (currentRobot.dir === 90) nextRobot.y += 1;
                if (currentRobot.dir === 180) nextRobot.x -= 1;
                if (currentRobot.dir === 270) nextRobot.y -= 1;
            } else if (cmd.includes('turn_right')) {
                nextRobot.dir = (currentRobot.dir + 90) % 360;
            } else if (cmd.includes('turn_left')) {
                nextRobot.dir = (currentRobot.dir + 270) % 360;
            }

            // Boundary & Obstacle Check
            const isOOB = nextRobot.x < 0 || nextRobot.x >= GRID_SIZE || nextRobot.y < 0 || nextRobot.y >= GRID_SIZE;
            const isHit = OBSTACLES.some(o => o.x === nextRobot.x && o.y === nextRobot.y);

            if (isOOB || isHit) {
                setRobot(nextRobot);
                setStatus('fail');
                setMessage(isOOB ? 'OUT_OF_BOUNDS ERROR' : 'COLLISION DETECTED');
                setIsExecuting(false);
                return;
            }

            currentRobot = nextRobot;
            setRobot(currentRobot);
            await new Promise(r => setTimeout(r, 400));
        }

        if (currentRobot.x === TARGET.x && currentRobot.y === TARGET.y) {
            setStatus('success');
            setMessage('MISSION SUCCESS: TARGET ACQUIRED');
        } else {
            setStatus('fail');
            setMessage('IDLE ERROR: TARGET NOT REACHED');
        }
        setIsExecuting(false);
    };

    const reset = () => {
        setRobot(INITIAL_ROBOT);
        setStatus('idle');
        setStepIndex(-1);
        setMessage('System reset. Awaiting instructions.');
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 p-8 relative overflow-hidden font-mono">
            {/* Left: Code Editor */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 relative z-20">
                <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-orange-400" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Loop Sequence Input</h2>
                </div>

                <div className="flex-grow relative group">
                    <div className="absolute inset-0 bg-orange-500/5 blur-xl group-hover:bg-orange-500/10 transition-all opacity-20 pointer-events-none" />
                    <textarea
                        value={commands}
                        onChange={(e) => setCommands(e.target.value)}
                        placeholder={`# Example Script:\nfor i in range(4):\n  move_forward()\n  turn_right()\n  move_forward()\n  turn_left()`}
                        className="w-full h-full min-h-[300px] bg-black/60 border border-white/10 rounded-2xl p-6 text-orange-400 text-sm focus:outline-none focus:border-orange-500/50 transition-colors resize-none custom-scrollbar font-mono leading-relaxed"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={runCode}
                        disabled={isExecuting || !commands.trim()}
                        className="flex-1 py-4 bg-orange-500 disabled:opacity-30 disabled:grayscale text-black font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-orange-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                    >
                        <Play size={14} fill="currentColor" />
                        Execute Core
                    </button>
                    <button
                        onClick={reset}
                        disabled={isExecuting}
                        className="px-6 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>

                <div className={`p-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 ${status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                    status === 'fail' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        'bg-white/5 border-white/10 text-white/40'
                    }`}>
                    {status === 'success' ? <CheckCircle2 size={14} /> : status === 'fail' ? <ShieldAlert size={14} /> : <Cpu size={14} className="animate-pulse" />}
                    {message}
                </div>
            </div>

            {/* Right: The Grid Arena */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-20">
                <div className="grid grid-cols-5 gap-2 p-4 bg-white/5 rounded-3xl border border-white/10 shadow-2xl relative">
                    {/* Grid Background */}
                    {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
                        const x = i % GRID_SIZE;
                        const y = Math.floor(i / GRID_SIZE);
                        const isObstacle = OBSTACLES.some(o => o.x === x && o.y === y);
                        const isTarget = TARGET.x === x && TARGET.y === y;

                        return (
                            <div
                                key={i}
                                className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all duration-500 relative ${isObstacle ? 'bg-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]' :
                                    isTarget ? 'bg-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-pulse' :
                                        'bg-black/40 border border-white/5'
                                    }`}
                            >
                                {isObstacle && <ShieldAlert size={20} className="text-red-500/40" />}
                                {isTarget && <RotateCw size={24} className="text-orange-500" />}
                            </div>
                        );
                    })}

                    {/* The Robot */}
                    <motion.div
                        className="absolute w-12 h-12 md:w-16 md:h-16 flex items-center justify-center z-30"
                        animate={{
                            left: 16 + robot.x * (window?.innerWidth < 768 ? 56 : 72), // Adjusted for gap+size
                            top: 16 + robot.y * (window?.innerWidth < 768 ? 56 : 72),
                            rotate: robot.dir
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="bg-orange-500 p-2 md:p-3 rounded-xl shadow-[0_0_20px_#f97316]">
                            <Cpu size={24} className="text-black" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                    </motion.div>
                </div>

                <div className="mt-8 flex gap-6 opacity-30">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500/50 rounded-sm" />
                        <span className="text-[10px] uppercase tracking-widest">Obstacle</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500/50 rounded-sm" />
                        <span className="text-[10px] uppercase tracking-widest">Target</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
