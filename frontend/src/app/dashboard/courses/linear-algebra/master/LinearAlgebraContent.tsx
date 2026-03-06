"use client";

import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import { ChevronLeft, Atom, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as THREE from "three";

const phases = [
    "Vectors",
    "Addition",
    "Dot Product",
    "Matrices",
    "Multiplication",
    "Transformations",
    "Eigenvectors",
    "Dimensionality Reduction (PCA)"
];

export default function LinearAlgebraMasterclass() {
    const [activePhase, setActivePhase] = useState(1);
    const [vectorA, setVectorA] = useState<[number, number, number]>([3, 2, 1]);
    const [vectorB, setVectorB] = useState<[number, number, number]>([-1, 3, 2]);

    const [transformScale, setTransformScale] = useState(1);
    const [transformShear, setTransformShear] = useState(0);
    const [pcaProgress, setPcaProgress] = useState(0);

    const pcaPoints = useMemo(() => {
        return Array.from({ length: 20 }).map(() => [
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        ] as [number, number, number]);
    }, []);

    // Derived Values for dynamic content
    const resultantVector: [number, number, number] = [
        vectorA[0] + vectorB[0],
        vectorA[1] + vectorB[1],
        vectorA[2] + vectorB[2]
    ];

    const dotProduct = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1] + vectorA[2] * vectorB[2];
    const magA = Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2 + vectorA[2] ** 2);
    const magB = Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2 + vectorB[2] ** 2);
    const cosineSimilarity = magA && magB ? dotProduct / (magA * magB) : 0;
    const similarityPercentage = ((cosineSimilarity + 1) / 2) * 100;
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosineSimilarity)));
    const angleDeg = (angleRad * 180) / Math.PI;

    return (
        <div className="h-screen w-full bg-[#05050B] text-white flex overflow-hidden font-sans">

            {/* Pane 1: The 8-Phase Sidebar (20%) */}
            <div className="w-[20%] border-r border-white/10 bg-black/40 p-6 flex flex-col z-20">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium w-fit mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    Dashboard
                </Link>

                <h2 className="text-xl font-extrabold text-white mb-6 tracking-tight">Linear Algebra Path</h2>

                <div className="flex flex-col gap-2 overflow-y-auto pr-2 pb-10">
                    {phases.map((phaseTitle, index) => {
                        const phaseNumber = index + 1;
                        const isActive = activePhase === phaseNumber;
                        const isUnlocked = true;

                        return (
                            <button
                                key={phaseNumber}
                                onClick={() => isUnlocked && setActivePhase(phaseNumber)}
                                className={cn(
                                    "flex items-center gap-3 p-3.5 rounded-xl transition-all w-full text-left",
                                    isActive
                                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                                        : isUnlocked
                                            ? "hover:bg-white/5 text-white/70 border border-transparent"
                                            : "opacity-40 cursor-not-allowed border border-transparent"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                    isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-white/10"
                                )}>
                                    {isUnlocked ? phaseNumber : <Lock className="w-3 h-3" />}
                                </div>
                                <span className="text-sm font-semibold truncate">{phaseTitle}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pane 2: Theory & 2D Controls (40%) */}
            <div className="w-[40%] h-full overflow-y-auto p-12 flex flex-col justify-between relative bg-gradient-to-br from-[#0a0a0f] to-[#05050B] z-10 border-r border-white/5">
                <div className="max-w-xl mx-auto w-full flex flex-col gap-10">

                    {/* Header based on Phase */}
                    <div className="flex flex-col gap-4">
                        <span className="text-xs uppercase tracking-widest text-cyan-500 font-bold">Phase {activePhase}</span>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {phases[activePhase - 1]}
                        </h1>
                    </div>

                    {/* Switch Content based on Phase */}
                    <div className="flex flex-col gap-8 flex-1">
                        {activePhase === 1 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    A vector represents a point or a direction in space. In machine learning, vectors represent features of data. By manipulating the components, you actively shape the multi-dimensional position of the data point.
                                </p>

                                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center relative">
                                    <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl pointer-events-none" />
                                    <div className="flex items-center gap-6">
                                        <div className="text-3xl font-serif text-white/80 italic">A&#8407; =</div>
                                        <div className="flex flex-col border-l-2 border-r-2 border-white/20 px-4 py-2 gap-4 text-2xl font-mono text-cyan-300 relative z-10 w-24">
                                            <span className="text-center">{vectorA[0]}</span>
                                            <span className="text-center">{vectorA[1]}</span>
                                            <span className="text-center">{vectorA[2]}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-2">Vector A Slider Controls</h3>
                                    {['X', 'Y', 'Z'].map((axis, i) => (
                                        <div key={axis} className="flex flex-col gap-2">
                                            <div className="flex justify-between text-sm">
                                                <span className={i === 0 ? "text-red-400 font-bold" : i === 1 ? "text-green-400 font-bold" : "text-blue-400 font-bold"}>
                                                    {axis} Axis
                                                </span>
                                                <span className="font-mono text-white/80">{vectorA[i]}</span>
                                            </div>
                                            <input
                                                type="range" min="-5" max="5" step="1"
                                                value={vectorA[i]}
                                                onChange={(e) => {
                                                    const newVector = [...vectorA] as [number, number, number];
                                                    newVector[i] = parseFloat(e.target.value);
                                                    setVectorA(newVector);
                                                }}
                                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${i === 0 ? 'bg-red-950 accent-red-500' : i === 1 ? 'bg-green-950 accent-green-500' : 'bg-blue-950 accent-blue-500'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activePhase === 2 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    Vector addition operates component-wise. Visually, it follows the &quot;tip-to-tail&quot; or &quot;parallelogram&quot; rule. Combining two vectors geometrically merges their independent impacts in space.
                                </p>

                                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center gap-6 overflow-x-auto relative">
                                    <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-sm font-serif italic text-cyan-300">A&#8407;</div>
                                        <div className="flex flex-col border-l-2 border-r-2 border-white/20 px-3 py-1 gap-2 text-xl font-mono text-cyan-300 bg-black/20">
                                            <span>{vectorA[0]}</span><span>{vectorA[1]}</span><span>{vectorA[2]}</span>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold">+</div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-sm font-serif italic text-purple-400">B&#8407;</div>
                                        <div className="flex flex-col border-l-2 border-r-2 border-white/20 px-3 py-1 gap-2 text-xl font-mono text-purple-400 bg-black/20">
                                            <span>{vectorB[0]}</span><span>{vectorB[1]}</span><span>{vectorB[2]}</span>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold">=</div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-sm font-serif italic text-yellow-400">R&#8407;</div>
                                        <div className="flex flex-col border-l-2 border-r-2 border-white/20 px-3 py-1 gap-2 text-xl font-mono text-yellow-400 bg-yellow-400/10">
                                            <span>{resultantVector[0]}</span><span>{resultantVector[1]}</span><span>{resultantVector[2]}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    <div className="flex flex-col gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">Vector A (Cyan)</h3>
                                        {['X', 'Y', 'Z'].map((axis, i) => (
                                            <input key={`A-${axis}`} type="range" min="-5" max="5" step="1" value={vectorA[i]} onChange={(e) => { const v = [...vectorA] as [number, number, number]; v[i] = parseFloat(e.target.value); setVectorA(v); }} className="accent-cyan-500 bg-cyan-950 h-1.5 rounded-lg appearance-none" />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">Vector B (Purple)</h3>
                                        {['X', 'Y', 'Z'].map((axis, i) => (
                                            <input key={`B-${axis}`} type="range" min="-5" max="5" step="1" value={vectorB[i]} onChange={(e) => { const v = [...vectorB] as [number, number, number]; v[i] = parseFloat(e.target.value); setVectorB(v); }} className="accent-purple-500 bg-purple-950 h-1.5 rounded-lg appearance-none" />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activePhase === 3 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    The Dot Product quantifies the directional similarity between two vectors. A large positive value indicates alignment, zero means perpendicular (orthogonal), and a negative value means they point in opposite directions.
                                </p>

                                <div className="flex flex-col gap-6 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                                    <div className="flex justify-between items-center text-xl">
                                        <span className="text-white/80 font-serif italic">A&#8407; · B&#8407;</span>
                                        <span className="font-mono font-bold text-3xl">{dotProduct}</span>
                                    </div>

                                    <div className="h-px bg-white/10 w-full" />

                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-white/50">Cosine Similarity (Angle)</span>
                                            <span className="text-cyan-400">{cosineSimilarity.toFixed(2)} ({angleDeg.toFixed(0)}&deg;)</span>
                                        </div>
                                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative">
                                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 z-10" />
                                            <div
                                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
                                                style={{ width: `${similarityPercentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-white/30 uppercase font-bold mt-1">
                                            <span>Opposite (-1)</span>
                                            <span>Orthogonal (0)</span>
                                            <span>Parallel (1)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    <div className="flex flex-col gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">Vector A (Cyan)</h3>
                                        {['X', 'Y', 'Z'].map((axis, i) => (
                                            <input key={`A-${axis}`} type="range" min="-5" max="5" step="1" value={vectorA[i]} onChange={(e) => { const v = [...vectorA] as [number, number, number]; v[i] = parseFloat(e.target.value); setVectorA(v); }} className="accent-cyan-500 bg-cyan-950 h-1.5 rounded-lg appearance-none" />
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">Vector B (Purple)</h3>
                                        {['X', 'Y', 'Z'].map((axis, i) => (
                                            <input key={`B-${axis}`} type="range" min="-5" max="5" step="1" value={vectorB[i]} onChange={(e) => { const v = [...vectorB] as [number, number, number]; v[i] = parseFloat(e.target.value); setVectorB(v); }} className="accent-purple-500 bg-purple-950 h-1.5 rounded-lg appearance-none" />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activePhase === 4 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    A matrix is simply a collection of vectors. Think of it as a dataset where each row represents a different data point (e.g., three different patients) and columns are features (X, Y, Z).
                                </p>
                                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center relative mt-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-6">Patient Data Matrix (X)</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="text-3xl font-serif text-white/80 italic">X =</div>
                                        <div className="flex flex-col border-l-2 border-r-2 border-white/20 px-6 py-4 gap-4 text-xl font-mono relative z-10 bg-black/20">
                                            <div className="flex gap-6 text-cyan-300"><span>&nbsp;1.2</span><span>&nbsp;0.5</span><span>-0.8</span></div>
                                            <div className="flex gap-6 text-purple-400"><span>-0.5</span><span>&nbsp;1.5</span><span>&nbsp;2.0</span></div>
                                            <div className="flex gap-6 text-yellow-500"><span>&nbsp;2.1</span><span>-1.0</span><span>&nbsp;0.3</span></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activePhase === 5 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    In Neural Networks, we multiply our data matrix $X$ by a weight matrix $W$ ($Y = XW$). This operation uniformly scales and transforms our entire dataset simultaneously.
                                </p>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center gap-6 relative mt-4">
                                    <div className="text-center flex flex-col gap-2">
                                        <div className="font-serif italic text-white/50 text-sm">Data (X)</div>
                                        <div className="bg-black/30 w-16 h-16 rounded flex items-center justify-center font-bold text-xl border border-white/10">3x3</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white/30">&times;</div>
                                    <div className="text-center flex flex-col gap-2">
                                        <div className="font-serif italic text-white/50 text-sm">Weights (W)</div>
                                        <div className="bg-black/30 w-16 h-16 rounded flex items-center justify-center font-bold text-xl border border-cyan-500/30 text-cyan-400">3x3</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white/30">=</div>
                                    <div className="text-center flex flex-col gap-2">
                                        <div className="font-serif italic text-white/50 text-sm">Output (Y)</div>
                                        <div className="bg-black/30 w-16 h-16 rounded flex items-center justify-center font-bold text-xl border border-purple-500/30 text-purple-400">3x3</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-bold">Weight Multiplier (Scale)</span>
                                        <span className="font-mono text-cyan-400">{transformScale.toFixed(2)}x</span>
                                    </div>
                                    <input type="range" min="0.5" max="2" step="0.1" value={transformScale} onChange={(e) => setTransformScale(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                                </div>
                            </>
                        )}

                        {activePhase === 6 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    Matrices represent linear transformations. They can scale space, rotate it, or shear it. Watch how applying a matrix physically warps the entire 3D space, taking every point with it.
                                </p>
                                <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-bold">Scale Space</span>
                                        <span className="font-mono text-cyan-400">{transformScale.toFixed(2)}x</span>
                                    </div>
                                    <input type="range" min="0.5" max="2" step="0.1" value={transformScale} onChange={(e) => setTransformScale(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" />

                                    <div className="flex justify-between text-sm mt-4">
                                        <span className="text-white font-bold">Shear Space (X by Y)</span>
                                        <span className="font-mono text-purple-400">{transformShear.toFixed(2)}</span>
                                    </div>
                                    <input type="range" min="-2" max="2" step="0.1" value={transformShear} onChange={(e) => setTransformShear(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                </div>
                            </>
                        )}

                        {activePhase === 7 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    An Eigenvector is a special vector that does not get knocked off its span during a transformation. When the space shears or scales, the Eigenvector ($v$) only changes in length by its Eigenvalue ($\lambda$).
                                </p>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center relative mt-4">
                                    <div className="absolute inset-0 bg-yellow-400/5 rounded-2xl pointer-events-none" />
                                    <div className="text-3xl font-serif text-white/80 italic flex items-center gap-4">
                                        Av = <span className="text-yellow-400 font-bold text-4xl">&lambda;</span>v
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-bold">Scale Space</span>
                                        <span className="font-mono text-cyan-400">{transformScale.toFixed(2)}x</span>
                                    </div>
                                    <input type="range" min="0.5" max="2" step="0.1" value={transformScale} onChange={(e) => setTransformScale(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" />

                                    <div className="flex justify-between text-sm mt-4">
                                        <span className="text-white font-bold">Shear Space</span>
                                        <span className="font-mono text-purple-400">{transformShear.toFixed(2)}</span>
                                    </div>
                                    <input type="range" min="-2" max="2" step="0.1" value={transformShear} onChange={(e) => setTransformShear(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                </div>
                            </>
                        )}

                        {activePhase === 8 && (
                            <>
                                <p className="text-lg text-white/60 leading-relaxed">
                                    Dimensionality Reduction (like PCA) finds the most mathematically important spans and discards the rest. Here, we project a 3D dataset onto a 2D plane, intentionally losing the Z-axis to compress the data.
                                </p>
                                <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4 relative overflow-hidden">
                                    <div className="absolute top-0 bottom-0 right-0 w-32 bg-cyan-500/10 blur-[50px]" />
                                    <div className="flex justify-between text-sm relative z-10">
                                        <span className="text-cyan-400 font-bold text-lg">Flatten to 2D Plane</span>
                                        <span className="font-mono text-white/80 text-lg">{(pcaProgress * 100).toFixed(0)}%</span>
                                    </div>
                                    <input type="range" min="0" max="1" step="0.01" value={pcaProgress} onChange={(e) => setPcaProgress(parseFloat(e.target.value))} className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 relative z-10" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom Action Button */}
                    {activePhase < 8 && (
                        <button
                            onClick={() => setActivePhase(activePhase + 1)}
                            className={cn(
                                "flex items-center justify-center gap-3 p-5 rounded-2xl transition-all font-bold w-full",
                                "bg-white text-black hover:bg-cyan-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02]"
                            )}
                        >
                            Continue to Phase {activePhase + 1}
                        </button>
                    )}
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-[40%] h-full sticky top-0 bg-black/60 relative border-l border-white/10">
                <div className="absolute top-6 right-6 z-10 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-mono text-white/60">
                    Interact: Drag to rotate, scroll to zoom
                </div>

                <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

                    {/* Grid and Axes */}
                    <gridHelper args={[20, 20, '#333333', '#111111']} />
                    <axesHelper args={[10]} />

                    {/* Origin Point */}
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.15, 32, 32]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
                    </mesh>

                    {/* Phase 1 Geometry */}
                    {activePhase === 1 && (
                        <>
                            <Line points={[[0, 0, 0], vectorA]} color="#22d3ee" lineWidth={4} />
                            <mesh position={vectorA}>
                                <sphereGeometry args={[0.2, 32, 32]} />
                                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
                            </mesh>
                        </>
                    )}

                    {/* Phase 2 Geometry (Addition) */}
                    {activePhase === 2 && (
                        <>
                            <Line points={[[0, 0, 0], vectorA]} color="#22d3ee" lineWidth={3} />
                            <mesh position={vectorA}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#22d3ee" /></mesh>

                            <Line points={[[0, 0, 0], vectorB]} color="#c084fc" lineWidth={3} />
                            <mesh position={vectorB}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#c084fc" /></mesh>

                            <Line points={[[0, 0, 0], resultantVector]} color="#facc15" lineWidth={5} />
                            <mesh position={resultantVector}><sphereGeometry args={[0.25, 32, 32]} /><meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1} /></mesh>

                            <Line points={[vectorA, resultantVector]} color="#c084fc" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
                            <Line points={[vectorB, resultantVector]} color="#22d3ee" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
                        </>
                    )}

                    {/* Phase 3 Geometry (Dot Product & Angles) */}
                    {activePhase === 3 && (
                        <>
                            <Line points={[[0, 0, 0], vectorA]} color="#22d3ee" lineWidth={3} />
                            <mesh position={vectorA}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#22d3ee" /></mesh>

                            <Line points={[[0, 0, 0], vectorB]} color="#c084fc" lineWidth={3} />
                            <mesh position={vectorB}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#c084fc" /></mesh>

                            <Html position={[
                                (vectorA[0] * 0.5 + vectorB[0] * 0.5),
                                (vectorA[1] * 0.5 + vectorB[1] * 0.5),
                                (vectorA[2] * 0.5 + vectorB[2] * 0.5)
                            ]} center zIndexRange={[100, 0]}>
                                <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-sm whitespace-nowrap shadow-2xl">
                                    {angleDeg.toFixed(1)}&deg;
                                </div>
                            </Html>
                        </>
                    )}

                    {/* Phase 4 Geometry (Matrices) */}
                    {activePhase === 4 && (
                        <>
                            <Line points={[[0, 0, 0], [1.2, 0.5, -0.8]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
                            <mesh position={[1.2, 0.5, -0.8]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" /></mesh>

                            <Line points={[[0, 0, 0], [-0.5, 1.5, 2.0]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
                            <mesh position={[-0.5, 1.5, 2.0]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#c084fc" emissive="#c084fc" /></mesh>

                            <Line points={[[0, 0, 0], [2.1, -1.0, 0.3]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
                            <mesh position={[2.1, -1.0, 0.3]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#eab308" emissive="#eab308" /></mesh>
                        </>
                    )}

                    {/* Phase 5 Geometry (Multiplication) */}
                    {activePhase === 5 && (
                        <group scale={transformScale}>
                            <Line points={[[0, 0, 0], [1.2, 0.5, -0.8]]} color="#ffffff" opacity={0.2} transparent lineWidth={2} />
                            <mesh position={[1.2, 0.5, -0.8]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} /></mesh>

                            <Line points={[[0, 0, 0], [-0.5, 1.5, 2.0]]} color="#ffffff" opacity={0.2} transparent lineWidth={2} />
                            <mesh position={[-0.5, 1.5, 2.0]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1} /></mesh>

                            <Line points={[[0, 0, 0], [2.1, -1.0, 0.3]]} color="#ffffff" opacity={0.2} transparent lineWidth={2} />
                            <mesh position={[2.1, -1.0, 0.3]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={1} /></mesh>
                        </group>
                    )}

                    {/* Phase 6 & 7 Geometry (Transformations & Eigenvectors) */}
                    {(activePhase === 6 || activePhase === 7) && (
                        <group>
                            {(() => {
                                const matrix = new THREE.Matrix4().set(
                                    transformScale, transformShear, 0, 0,
                                    0, transformScale, 0, 0,
                                    0, 0, transformScale, 0,
                                    0, 0, 0, 1
                                );
                                return (
                                    <group matrix={matrix} matrixAutoUpdate={false}>
                                        <gridHelper args={[20, 20, '#c084fc', '#4c1d95']} rotation={[Math.PI / 2, 0, 0]} />
                                        <gridHelper args={[20, 20, '#22d3ee', '#164e63']} />
                                    </group>
                                );
                            })()}

                            {activePhase === 7 && (
                                <>
                                    <Line points={[[0, 0, 0], [4 * transformScale, 0, 0]]} color="#facc15" lineWidth={6} />
                                    <mesh position={[4 * transformScale, 0, 0]}>
                                        <sphereGeometry args={[0.3, 32, 32]} />
                                        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={2} />
                                    </mesh>
                                    <Html position={[4 * transformScale + 0.5, 0.5, 0]}>
                                        <div className="text-yellow-400 font-bold font-mono px-2 py-1 bg-black/80 rounded border border-yellow-500/30">Eigenvector</div>
                                    </Html>
                                </>
                            )}
                        </group>
                    )}

                    {/* Phase 8 Geometry (PCA) */}
                    {activePhase === 8 && (
                        <>
                            {pcaPoints.map((p, i) => (
                                <mesh key={i} position={[p[0], p[1], p[2] * (1 - pcaProgress)]}>
                                    <sphereGeometry args={[0.2, 16, 16]} />
                                    <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} transparent opacity={0.9} />
                                </mesh>
                            ))}
                            <mesh position={[0, 0, 0]}>
                                <planeGeometry args={[15, 15]} />
                                <meshPhysicalMaterial color="#ffffff" transparent opacity={0.1 + (pcaProgress * 0.2)} side={THREE.DoubleSide} roughness={0.1} metalness={0.8} />
                                <lineSegments>
                                    <edgesGeometry args={[new THREE.PlaneGeometry(15, 15)]} />
                                    <lineBasicMaterial color="#22d3ee" transparent opacity={pcaProgress} />
                                </lineSegments>
                            </mesh>
                        </>
                    )}
                </Canvas>
            </div>
        </div>
    );
}
