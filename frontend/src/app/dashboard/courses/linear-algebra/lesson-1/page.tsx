"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import { ChevronLeft, Lock, PlayCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Lesson1Page() {
    const [vector, setVector] = useState<[number, number, number]>([3, 2, 1]);

    return (
        <div className="min-h-screen bg-[#05050B] text-white flex overflow-hidden font-sans">

            {/* Left Column: Theory & Inputs */}
            <div className="h-screen flex-[0.8] overflow-y-auto p-12 flex flex-col relative bg-gradient-to-br from-[#0a0a0f] to-[#05050B] z-10 border-r border-white/5">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium w-fit mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="max-w-xl mx-auto w-full flex flex-col gap-10 pb-32">

                    {/* Phase 1: The Theory */}
                    <div className="flex flex-col gap-4">
                        <span className="text-xs uppercase tracking-widest text-cyan-500 font-bold">Phase 1: The Theory</span>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Linear Algebra: Vectors
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Vectors are the fundamental building blocks of machine learning. They represent a specific point or direction in space.
                        </p>
                    </div>

                    {/* Math Representation */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/40">Mathematical Representation</h3>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center gap-8 relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />

                            <div className="text-3xl font-serif text-white/80 italic">
                                v&#8407; =
                            </div>
                            <div className="flex flex-col border-l-2 border-r-2 border-white/20 px-4 py-2 gap-4 text-2xl font-mono text-cyan-300 relative z-10">
                                <span className="text-center">{vector[0]}</span>
                                <span className="text-center">{vector[1]}</span>
                                <span className="text-center">{vector[2]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Phase 2: The Interactive Inputs */}
                    <div className="flex flex-col gap-6 mt-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-widest text-cyan-500 font-bold">Phase 2: The Inputs</span>
                            <h2 className="text-2xl font-bold text-white/90">Manipulate the Space</h2>
                        </div>

                        <div className="flex flex-col gap-8 bg-black/20 p-8 rounded-2xl border border-white/5">
                            {/* X Slider */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-red-400 font-bold">X (Red Axis)</span>
                                    <span className="font-mono text-white/80">{vector[0]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="-5" max="5" step="1"
                                    value={vector[0]}
                                    onChange={(e) => setVector([parseFloat(e.target.value), vector[1], vector[2]])}
                                    className="w-full h-2 bg-red-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>

                            {/* Y Slider */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-400 font-bold">Y (Green Axis)</span>
                                    <span className="font-mono text-white/80">{vector[1]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="-5" max="5" step="1"
                                    value={vector[1]}
                                    onChange={(e) => setVector([vector[0], parseFloat(e.target.value), vector[2]])}
                                    className="w-full h-2 bg-green-950 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                            </div>

                            {/* Z Slider */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-blue-400 font-bold">Z (Blue Axis)</span>
                                    <span className="font-mono text-white/80">{vector[2]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="-5" max="5" step="1"
                                    value={vector[2]}
                                    onChange={(e) => setVector([vector[0], vector[1], parseFloat(e.target.value)])}
                                    className="w-full h-2 bg-blue-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase 3: 3D Canvas (Right Column) */}
            <div className="h-screen flex-1 sticky top-0 bg-black/60 relative">
                <div className="absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-mono text-white/60">
                    Interact: Drag to rotate, scroll to zoom
                </div>

                <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />

                    <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

                    {/* Grid and Axes */}
                    <gridHelper args={[20, 20, '#333333', '#111111']} />
                    <axesHelper args={[10]} />

                    {/* The Vector Line */}
                    <Line
                        points={[[0, 0, 0], vector]}
                        color="#22d3ee"
                        lineWidth={3}
                        dashed={false}
                    />

                    {/* Vector Head/Point */}
                    <mesh position={vector}>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial
                            color="#22d3ee"
                            emissive="#22d3ee"
                            emissiveIntensity={2}
                            roughness={0.2}
                            metalness={0.8}
                        />
                        {/* Dynamic HTML Label attached to the point */}
                        <Html position={[0.4, 0.4, 0]} center zIndexRange={[100, 0]}>
                            <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-mono text-sm whitespace-nowrap shadow-[0_0_15px_rgba(34,211,238,0.3)] select-none">
                                ({vector[0]}, {vector[1]}, {vector[2]})
                            </div>
                        </Html>
                    </mesh>

                    {/* Origin Point */}
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.15, 32, 32]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
                    </mesh>
                </Canvas>
            </div>
        </div>
    );
}
