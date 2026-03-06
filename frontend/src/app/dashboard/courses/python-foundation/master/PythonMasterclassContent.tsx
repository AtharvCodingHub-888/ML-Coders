"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Float } from "@react-three/drei";
import { ChevronLeft, Sparkles, Play, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

const phases = [
    "Variables & Memory",
    "Control Flow",
    "Lists (Data Structures)",
    "Functions"
];

const phaseContent: Record<number, string> = {
    1: "### 1. Variables & Memory\n\nIn Python, a variable is just a label pointing to a box in the computer's memory. When you type `x = 10`, Python creates a 3D memory block and stores 10 inside it.\n\nPython manages this memory automatically, but understanding that variables are **references** to objects is key to avoiding bugs!",
    2: "### 2. Control Flow (Loops)\n\nA `for` loop iterates over a sequence. Think of it as a machine stepping through data points one by one.\n\n```python\nfor i in range(5):\n    print(i)\n```\n\nEach step of the loop moves the 'pointer' to the next item in memory.",
    3: "### 3. Lists (Data Structures)\n\nA List is a dynamic array in memory. When you use `.append()`, Python physically allocates a new block of memory and links it to the chain.\n\n```python\nmy_list = [1, 2, 3]\nmy_list.append(4)\n```",
    4: "### 4. Functions\n\nA function is a reusable machine. Data goes into the parameters (Inputs), gets transformed by the logic, and comes out the return statement (Output).\n\n```python\ndef square(n):\n    return n * n\n```"
};

/* ─── 3D Scene Components ─── */

function MemoryBox({ value }: { value: number }) {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial
                    color="#06b6d4"
                    transparent
                    opacity={0.6}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
            <mesh scale={[1.1, 1.1, 1.1]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.2} />
            </mesh>
            <Html position={[0, 1.8, 0]} center>
                <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-cyan-500/50 text-cyan-400 font-mono text-xl whitespace-nowrap shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    x = {value}
                </div>
            </Html>
            <pointLight color="#06b6d4" intensity={5} distance={6} />
        </Float>
    );
}

function LoopVisualizer({ currentStep }: { currentStep: number }) {
    const nodes = [0, 1, 2, 3, 4];
    return (
        <group>
            {nodes.map((node, i) => {
                const isActive = currentStep === i;
                return (
                    <group key={i} position={[(i - 2) * 2, 0, 0]}>
                        <mesh scale={isActive ? 1.4 : 1}>
                            <sphereGeometry args={[0.5, 32, 32]} />
                            <meshStandardMaterial
                                color={isActive ? "#22c55e" : "#334155"}
                                emissive={isActive ? "#22c55e" : "#000000"}
                                emissiveIntensity={isActive ? 2 : 0}
                            />
                        </mesh>
                        {isActive && (
                            <pointLight color="#22c55e" intensity={5} distance={5} />
                        )}
                        <Html position={[0, -1, 0]} center>
                            <span className={cn(
                                "text-xs font-mono font-bold",
                                isActive ? "text-green-400" : "text-slate-500"
                            )}>
                                idx: {i}
                            </span>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

function ListVisualizer({ size }: { size: number }) {
    return (
        <group>
            {Array.from({ length: size }).map((_, i) => (
                <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                    <group position={[(i - (size - 1) / 2) * 1.8, 0, 0]}>
                        <mesh>
                            <boxGeometry args={[1.2, 1.2, 1.2]} />
                            <meshStandardMaterial color="#9333ea" transparent opacity={0.8} metalness={0.6} roughness={0.2} />
                        </mesh>
                        <mesh scale={[1.08, 1.08, 1.08]}>
                            <boxGeometry args={[1.2, 1.2, 1.2]} />
                            <meshBasicMaterial color="#d8b4fe" wireframe transparent opacity={0.3} />
                        </mesh>
                        <Html position={[0, -1, 0]} center>
                            <span className="text-[10px] font-mono text-purple-400 font-bold">[{i}]</span>
                        </Html>
                    </group>
                </Float>
            ))}
            <pointLight position={[0, 2, 0]} color="#9333ea" intensity={5} distance={8} />
        </group>
    );
}

function FunctionMachine() {
    return (
        <group>
            <mesh>
                <boxGeometry args={[3, 2, 2]} />
                <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh scale={[1.03, 1.03, 1.03]}>
                <boxGeometry args={[3, 2, 2]} />
                <meshBasicMaterial color="#64748b" wireframe transparent opacity={0.15} />
            </mesh>

            <group position={[-3, 0, 0]}>
                <mesh rotation={[0, 0, -Math.PI / 2]}>
                    <coneGeometry args={[0.3, 0.8, 32]} />
                    <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} />
                </mesh>
                <Html position={[0, 1, 0]} center>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">Input</span>
                </Html>
            </group>

            <group position={[3, 0, 0]}>
                <mesh rotation={[0, 0, -Math.PI / 2]}>
                    <coneGeometry args={[0.3, 0.8, 32]} />
                    <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={1} />
                </mesh>
                <Html position={[0, 1, 0]} center>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-widest">Output</span>
                </Html>
            </group>

            <Html position={[0, 1.5, 0]} center>
                <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                    def square(n)
                </div>
            </Html>

            <pointLight position={[0, 2, 2]} intensity={5} color="#ffffff" />
        </group>
    );
}

/* ─── Main Page Component ─── */

export default function PythonMasterclass() {
    const [activePhase, setActivePhase] = useState(1);
    const [varValue, setVarValue] = useState(10);
    const [loopStep, setLoopStep] = useState(0);
    const [listSize, setListSize] = useState(3);
    const [userQuestion, setUserQuestion] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setAiResponse("");
        setUserQuestion("");
    }, [activePhase]);

    const handleGenerateAi = async () => {
        if (!userQuestion.trim()) return;
        setIsGenerating(true);
        setAiResponse("");
        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `You are an AI Tutor for Python. The student is currently in the phase: "${phases[activePhase - 1]}". 
                    Their question is: "${userQuestion}". 
                    Explain the concept simply using Python examples.`
                })
            });
            const data = await response.json();
            setAiResponse(data.text || data.error || "Failed to generate response.");
            setUserQuestion("");
        } catch {
            setAiResponse("Sorry, I encountered an error connecting to the memory mainframe.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#05050A] text-white overflow-hidden font-sans">

            {/* ═══ Pane 1: Course Navigator (20%) ═══ */}
            <div className="w-[20%] border-r border-white/5 bg-black/20 flex flex-col p-6 overflow-y-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-10 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Dashboard</span>
                </Link>

                <div className="flex flex-col gap-2">
                    <h2 className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Masterclass Roadmap</h2>
                    {phases.map((phaseTitle, index) => {
                        const phaseNumber = index + 1;
                        const isActive = activePhase === phaseNumber;
                        return (
                            <button
                                key={phaseNumber}
                                onClick={() => setActivePhase(phaseNumber)}
                                title={phaseTitle}
                                className={cn(
                                    "flex items-center gap-3 p-3.5 rounded-xl transition-all w-full text-left",
                                    isActive
                                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                        : "hover:bg-white/5 text-white/70 border border-transparent"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                    isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-white/10"
                                )}>
                                    {phaseNumber}
                                </div>
                                <span className="text-sm font-semibold truncate">{phaseTitle}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ═══ Pane 2: Theory & Controls (40%) ═══ */}
            <div className="w-[40%] h-full overflow-y-auto p-12 flex flex-col justify-between relative bg-gradient-to-br from-[#050B10] to-[#05050B] z-10 border-r border-white/5">
                <div className="max-w-xl mx-auto w-full flex flex-col gap-10">

                    <div className="flex flex-col gap-4">
                        <span className="text-xs uppercase tracking-widest text-cyan-500 font-bold">Phase {activePhase}</span>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {phases[activePhase - 1]}
                        </h1>
                    </div>

                    <div className="prose prose-invert prose-cyan max-w-none mb-4 text-sm/relaxed">
                        <ReactMarkdown>
                            {phaseContent[activePhase]}
                        </ReactMarkdown>
                    </div>

                    {/* ─── 2D Interactive Controls ─── */}
                    <div className="flex flex-col gap-6">
                        {activePhase === 1 && (
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="var-slider" className="text-sm font-bold text-cyan-400 uppercase tracking-wider italic">Value (x)</label>
                                    <span className="font-mono text-xl text-white">{varValue}</span>
                                </div>
                                <input id="var-slider" type="range" min="0" max="100" value={varValue} onChange={(e) => setVarValue(parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" title="Variable value" />
                                <p className="text-[10px] text-white/40 italic">Observe the 3D memory cell react to state change.</p>
                            </div>
                        )}

                        {activePhase === 2 && (
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-green-400 uppercase tracking-wider italic">Iteration Pointer</span>
                                    <span className="text-xs text-white/40">Current index: <span className="text-green-400 font-mono">{loopStep}</span></span>
                                </div>
                                <button onClick={() => setLoopStep((prev) => (prev + 1) % 5)} title="Step Forward" className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                    <Play className="w-4 h-4 fill-white" /> Step Forward
                                </button>
                            </div>
                        )}

                        {activePhase === 3 && (
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between gap-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-purple-400 uppercase tracking-wider italic">Dynamic Array</span>
                                    <div className="flex gap-1 font-mono text-xs text-white/40 mt-1">
                                        [{Array.from({ length: listSize }).map((_, i) => <span key={i}>📦{i < listSize - 1 ? "," : ""}</span>)}]
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setListSize(prev => Math.max(1, prev - 1))} title="Pop element" className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-bold text-sm">
                                        <Minus className="w-4 h-4" /> .pop()
                                    </button>
                                    <button onClick={() => setListSize(prev => Math.min(6, prev + 1))} title="Append element" className="flex items-center gap-2 p-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] font-bold text-sm">
                                        <Plus className="w-4 h-4" /> .append()
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── AI Tutor Chat ─── */}
                    <div className="mt-8 border border-cyan-500/30 bg-cyan-900/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent group-hover:from-cyan-500/20 transition-all pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                                    <Sparkles className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">✨ Ask Your AI Tutor</h2>
                            </div>

                            <div className="flex gap-3 mb-4">
                                <input type="text" value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} placeholder="Explain this memory model to me..." className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500 transition-colors" onKeyDown={(e) => { if (e.key === 'Enter') handleGenerateAi(); }} />
                                <button onClick={handleGenerateAi} disabled={isGenerating || !userQuestion.trim()} title="Ask AI Tutor" className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white">Ask</button>
                            </div>

                            {isGenerating && (
                                <div className="w-full p-8 border border-cyan-500/30 bg-black/40 rounded-xl flex flex-col items-center justify-center gap-4 mt-2">
                                    <div className="relative">
                                        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                                    </div>
                                    <span className="text-cyan-400 font-medium animate-pulse text-sm">Accessing Memory...</span>
                                </div>
                            )}

                            {aiResponse && !isGenerating && (
                                <div className="w-full p-6 bg-black/40 rounded-xl border border-cyan-500/30 relative flex flex-col gap-3 mt-2">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
                                        <Sparkles className="w-4 h-4 text-cyan-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Gemini Memory Insights</span>
                                    </div>
                                    <div className="prose prose-invert prose-cyan max-w-none text-sm/relaxed">
                                        <ReactMarkdown>{aiResponse}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Pane 3: 3D Visualization (40%) ═══ */}
            <div className="w-[40%] h-full bg-[#05050A] relative group">
                <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-2">
                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">Real-time Memory Canvas</span>
                    </div>
                    <span className="text-[10px] text-white/20 font-mono tracking-tighter">three.js • memory_visualizer_v1.0</span>
                </div>

                <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                    <color attach="background" args={["#05050A"]} />
                    <fog attach="fog" args={["#05050A", 8, 20]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={200} />
                    <gridHelper args={[20, 20, "#1e1b4b", "#1e1b4b"]} position={[0, -2, 0]} />

                    {activePhase === 1 && <MemoryBox value={varValue} />}
                    {activePhase === 2 && <LoopVisualizer currentStep={loopStep} />}
                    {activePhase === 3 && <ListVisualizer size={listSize} />}
                    {activePhase === 4 && <FunctionMachine />}

                    <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
                </Canvas>

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>
            </div>
        </div>
    );
}
