"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Line, Html, Float } from '@react-three/drei';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ChevronLeft, Cpu } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';

const phases = [
    { id: 1, title: "Intro to Deep Learning" },
    { id: 2, title: "Feedforward Networks" },
    { id: 3, title: "Convolutional Networks" },
    { id: 4, title: "Recurrent Networks" },
    { id: 5, title: "Long Short-Term Memory" },
    { id: 6, title: "Gated Recurrent Units" },
    { id: 7, title: "Autoencoders" },
    { id: 8, title: "Generative Adversarial Nets" },
    { id: 9, title: "Transformer Architecture" },
    { id: 10, title: "Attention Mechanisms" },
    { id: 11, title: "Graph Neural Networks" },
    { id: 12, title: "Modern Systems" }
];

const phaseContent: Record<number, string> = {
    1: "### 1. Intro to Deep Learning\n\nUnlike traditional ML, Deep Learning models automatically discover the representations needed for feature detection from raw data. \n\n**Applications:** Image recognition, NLP, Speech translation.",
    2: "### 2. Feedforward Networks (MLP)\n\nThe classic Multilayer Perceptron. Data flows strictly in one direction: Input → Hidden Layers → Output. Best for tabular data.",
    3: "### 3. Convolutional Neural Networks (CNN)\n\nThe king of computer vision. CNNs use sliding filters (kernels) to extract spatial features like edges and textures, shrinking the data via pooling layers.",
    4: "### 4. Recurrent Neural Networks (RNN)\n\nBuilt for sequential data (like time series or text). RNNs have 'memory'—they pass hidden states from previous steps into the current step.",
    5: "### 5. LSTMs\n\nStandard RNNs suffer from 'short-term memory' (vanishing gradients). LSTMs fix this using a Memory Cell and complex Gates (Forget, Input, Output) to hold data longer.",
    6: "### 6. Gated Recurrent Units (GRU)\n\nA streamlined version of the LSTM. It combines the forget and input gates into a single 'Update Gate', making it faster to train while maintaining high performance.",
    7: "### 7. Autoencoders\n\nAn unsupervised architecture that compresses data down to a tiny 'latent representation' (Encoder), and then tries to perfectly reconstruct the original data from that tiny bottleneck (Decoder).",
    8: "### 8. Generative Adversarial Networks (GAN)\n\nTwo networks at war. The Generator creates fake data (like synthetic images), and the Discriminator tries to catch the fakes. They train until the fakes are indistinguishable from reality.",
    9: "### 9. Transformer Architecture\n\nThe architecture behind LLMs. It completely abandons recurrence (RNNs) in favor of processing all data simultaneously using Positional Encoding and Self-Attention.",
    10: "### 10. Attention Mechanisms\n\nAttention calculates a score for how strongly a word (or patch of an image) relates to every other word in a sequence using Query, Key, and Value matrices.",
    11: "### 11. Graph Neural Networks (GNN)\n\nBuilt for data that exists in complex networks (like social networks or molecular structures). GNNs use 'Message Passing' between nodes and edges.",
    12: "### 12. Modern Systems\n\nThe cutting edge: Large Language Models (GPT), Vision Transformers, Multimodal AI, and Diffusion Models (which gradually remove noise to generate high-fidelity images)."
};

// --- 3D SCENE COMPONENTS ---

const CNNScene = ({ isFilterActive }: { isFilterActive: boolean }) => {
    const filterRef = useRef<THREE.Group>(null);
    const featureMapRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (filterRef.current && isFilterActive) {
            const time = state.clock.elapsedTime * 2;
            const step = Math.floor(time) % 4;
            // Snappy movement across 2x2 grid positions on a 3x3 image
            const positions = [
                [-0.6, 0.6], [0.6, 0.6],
                [-0.6, -0.6], [0.6, -0.6]
            ];
            const target = new THREE.Vector3(positions[step][0], positions[step][1], 0);
            filterRef.current.position.lerp(target, 0.2);
        } else if (filterRef.current && !isFilterActive) {
            filterRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        }

        if (featureMapRef.current) {
            featureMapRef.current.position.x = THREE.MathUtils.lerp(
                featureMapRef.current.position.x,
                isFilterActive ? 4 : 0,
                0.1
            );
            featureMapRef.current.scale.setScalar(
                THREE.MathUtils.lerp(featureMapRef.current.scale.x, isFilterActive ? 1 : 0.01, 0.1)
            );
        }
    });

    return (
        <group>
            {/* 3x3 Input Image Grid */}
            <group position={[-2, 0, 0]}>
                {[-1.2, 0, 1.2].map((y, rowIdx) =>
                    [-1.2, 0, 1.2].map((x, colIdx) => (
                        <Box key={`${rowIdx}-${colIdx}`} position={[x, y, 0]} args={[1, 1, 0.2]}>
                            <meshStandardMaterial color="#1e293b" wireframe={false} />
                            <Box args={[1.05, 1.05, 0.25]}>
                                <meshBasicMaterial color="#334155" wireframe={true} />
                            </Box>
                        </Box>
                    ))
                )}

                {/* 2x2 Sliding Filter Plane */}
                <group ref={filterRef}>
                    <mesh position={[0, 0, 0.5]}>
                        <planeGeometry args={[2.2, 2.2]} />
                        <meshBasicMaterial color="#a855f7" transparent opacity={0.4} side={2} />
                    </mesh>
                    <Line points={[[-1.1, 1.1, 0.5], [1.1, 1.1, 0.5], [1.1, -1.1, 0.5], [-1.1, -1.1, 0.5], [-1.1, 1.1, 0.5]]} color="#d8b4fe" lineWidth={3} />
                    {isFilterActive && <pointLight color="#a855f7" intensity={2} distance={3} position={[0, 0, 1]} />}
                </group>
                <Html position={[0, -2.5, 0]} center>
                    <div className="text-xs font-mono font-bold text-gray-400">Input Image (3x3)</div>
                </Html>
            </group>

            {/* Spawned Feature Map */}
            <group ref={featureMapRef} position={[0, 0, 0]}>
                <Line points={[[-3, 0, 0], [-1, 0, 0]]} color="#a855f7" />
                {[-0.6, 0.6].map((y, rowIdx) =>
                    [-0.6, 0.6].map((x, colIdx) => (
                        <Box key={`fm-${rowIdx}-${colIdx}`} position={[x, y, 0]} args={[1, 1, 0.2]}>
                            <meshStandardMaterial color="#4c1d95" emissive="#6b21a8" emissiveIntensity={0.5} />
                            <Box args={[1.05, 1.05, 0.25]}>
                                <meshBasicMaterial color="#a855f7" wireframe={true} />
                            </Box>
                        </Box>
                    ))
                )}
                <Html position={[0, -2, 0]} center>
                    <div className="text-xs font-mono font-bold text-purple-400">Feature Map (2x2)</div>
                </Html>
            </group>
        </group>
    );
};

const RNNScene = ({ length }: { length: number }) => {
    const spacing = 2;
    const startX = -(length - 1) * spacing / 2;

    const nodes = Array.from({ length }).map((_, i) => ({
        x: startX + (i * spacing),
        y: 0,
        z: 0
    }));

    return (
        <group>
            {nodes.map((n, i) => (
                <group key={i} position={[n.x, n.y, n.z]}>
                    {/* Input arrow */}
                    <Line points={[[0, -1.5, 0], [0, -0.5, 0]]} color="#38bdf8" />
                    {/* RNN Cell */}
                    <Sphere args={[0.5, 32, 32]}>
                        <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.5} />
                    </Sphere>
                    <Html position={[0, 0, 0]} center>
                        <div className="text-[10px] font-mono text-white">h{i}</div>
                    </Html>

                    {/* Self-Loop (Memory) */}
                    <Line
                        points={[
                            new THREE.Vector3(0, 0.5, 0),
                            new THREE.Vector3(-0.5, 1, 0),
                            new THREE.Vector3(0, 1.5, 0),
                            new THREE.Vector3(0.5, 1, 0),
                            new THREE.Vector3(0, 0.5, 0),
                        ]}
                        color="#38bdf8"
                    />

                    {/* Forward Pass Line */}
                    {i < length - 1 && (
                        <Line points={[[0.5, 0, 0], [spacing - 0.5, 0, 0]]} color="#ffffff" transparent opacity={0.5} />
                    )}
                </group>
            ))}
            <Html position={[0, -2.5, 0]} center>
                <div className="text-xs font-mono font-bold text-sky-400">Unrolled Sequence (t = {length})</div>
            </Html>
        </group>
    );
};

const AutoencoderScene = () => {
    const layers = [5, 3, 2, 3, 5];
    const spacingX = 2;
    const spacingY = 1.2;
    let startX = -4;

    const nodes: any[] = [];
    const links: any[] = [];

    layers.forEach((count, lIdx) => {
        let startY = -(count - 1) * spacingY / 2;
        for (let pos = 0; pos < count; pos++) {
            nodes.push({ layer: lIdx, x: startX, y: startY + pos * spacingY, z: 0 });
        }
        startX += spacingX;
    });

    for (let i = 0; i < layers.length - 1; i++) {
        const l1 = nodes.filter(n => n.layer === i);
        const l2 = nodes.filter(n => n.layer === i + 1);
        l1.forEach(n1 => {
            l2.forEach(n2 => {
                links.push({ start: [n1.x, n1.y, 0], end: [n2.x, n2.y, 0] });
            })
        })
    }

    return (
        <group>
            {links.map((l, i) => (
                <Line key={`l-${i}`} points={[new THREE.Vector3(...l.start), new THREE.Vector3(...l.end)]} color="#334155" transparent opacity={0.2} />
            ))}
            {nodes.map((n, i) => {
                const isLatent = n.layer === 2;
                return (
                    <Sphere key={`n-${i}`} position={[n.x, n.y, n.z]} args={[isLatent ? 0.3 : 0.2, 16, 16]}>
                        <meshStandardMaterial
                            color={isLatent ? "#eab308" : "#94a3b8"}
                            emissive={isLatent ? "#eab308" : "#000000"}
                            emissiveIntensity={isLatent ? 1 : 0}
                        />
                    </Sphere>
                )
            })}

            {/* Labels */}
            <Html position={[-4, -3.5, 0]} center><div className="text-[10px] font-mono font-bold text-gray-500">Encoder</div></Html>
            <Html position={[0, -2.5, 0]} center><div className="text-xs border border-yellow-500/50 bg-black/50 px-2 py-1 rounded font-mono font-bold text-yellow-400">Latent Space Bottleneck</div></Html>
            <Html position={[4, -3.5, 0]} center><div className="text-[10px] font-mono font-bold text-gray-500">Decoder</div></Html>
        </group>
    );
};

const GANScene = () => {
    const pGenRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (pGenRef.current) {
            const time = state.clock.elapsedTime;
            // Particles flow from gen(-3) to disc(3)
            pGenRef.current.children.forEach((c, i) => {
                const speed = 1 + (i % 3) * 0.5;
                c.position.x = -3 + ((time * speed + i) % 6);
                c.position.y = Math.sin(time * 2 + i) * 0.5;
            });
        }
    });

    return (
        <group>
            {/* Generator */}
            <Float speed={2} rotationIntensity={0.2} position={[-3, 0, 0]}>
                <Box args={[2, 4, 2]}>
                    <meshStandardMaterial color="#0ea5e9" wireframe={true} />
                    <Html position={[0, -2.5, 0]} center>
                        <div className="text-xs font-bold text-sky-400 font-mono bg-black/60 px-2 rounded">Generator (Fake Data)</div>
                    </Html>
                </Box>
            </Float>

            {/* Discriminator */}
            <Float speed={2} rotationIntensity={0.2} position={[3, 0, 0]}>
                <Box args={[1.5, 3, 1.5]}>
                    <meshStandardMaterial color="#ef4444" wireframe={true} />
                    <Html position={[0, -2, 0]} center>
                        <div className="text-xs font-bold text-red-400 font-mono bg-black/60 px-2 rounded">Discriminator (Truth Check)</div>
                    </Html>
                </Box>
            </Float>

            {/* Flowing Data */}
            <group ref={pGenRef}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <Sphere key={i} args={[0.05]} position={[-3, 0, 0]}>
                        <meshBasicMaterial color="#ffffff" />
                    </Sphere>
                ))}
            </group>
        </group>
    );
};

const TransformerScene = ({ isAttentionActive }: { isAttentionActive: boolean }) => {
    const seq = ["The", "cat", "sat", "on", "the", "mat"];
    const nodesTop = seq.map((word, i) => ({ word, x: -3.75 + (i * 1.5), y: 1.5 }));
    const nodesBot = seq.map((word, i) => ({ word, x: -3.75 + (i * 1.5), y: -1.5 }));

    const links = useMemo(() => {
        const arr = [];
        for (let t = 0; t < nodesTop.length; t++) {
            for (let b = 0; b < nodesBot.length; b++) {
                // Determine a fake "attention weight"
                const dist = Math.abs(t - b); // closer words have higher base weight
                let weight = 0.1;
                if (t === 1 && b === 2) weight = 0.9; // 'cat' -> 'sat'
                else if (t === 5 && b === 4) weight = 0.8; // 'mat' -> 'the'
                else if (t === b) weight = 0.5; // self
                else weight = Math.max(0.05, 0.4 - (dist * 0.1));

                arr.push({ start: [nodesTop[t].x, nodesTop[t].y, 0], end: [nodesBot[b].x, nodesBot[b].y, 0], weight });
            }
        }
        return arr;
    }, [nodesTop, nodesBot]);

    const linesRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.position.z = THREE.MathUtils.lerp(
                linesRef.current.position.z,
                isAttentionActive ? 0 : -2,
                0.1
            );
            linesRef.current.traverse((child) => {
                if (child instanceof THREE.Line) {
                    const targetOpacity = isAttentionActive ? child.userData.weight : 0;
                    if (child.material instanceof THREE.Material) {
                        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity, 0.1);
                    }
                }
            })
        }
    })

    return (
        <group>
            {/* Attention Lines */}
            <group ref={linesRef}>
                {links.map((l, i) => (
                    <Line
                        key={i}
                        points={[new THREE.Vector3(...l.start), new THREE.Vector3(...l.end)]}
                        color="#f59e0b"
                        transparent opacity={0}
                        userData={{ weight: l.weight }}
                        lineWidth={l.weight * 3}
                    />
                ))}
            </group>

            {/* Sequence Nodes */}
            {[nodesTop, nodesBot].map((row, rIdx) => (
                <group key={rIdx}>
                    {row.map((n, i) => (
                        <group key={i} position={[n.x, n.y, 0]}>
                            <Box args={[1.2, 0.6, 0.2]}>
                                <meshStandardMaterial color="#4c1d95" emissive="#5b21b6" emissiveIntensity={0.5} />
                            </Box>
                            <Html position={[0, 0, 0.15]} center zIndexRange={[100, 0]}>
                                <div className="text-[11px] font-mono font-bold text-white selection:bg-transparent cursor-default">{n.word}</div>
                            </Html>
                        </group>
                    ))}
                </group>
            ))}
        </group>
    );
};

const GalaxyScene = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {Array.from({ length: 300 }).map((_, i) => (
                <Sphere key={i} position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]} args={[0.02]}>
                    <meshBasicMaterial color={Math.random() > 0.5 ? "#c084fc" : "#2dd4bf"} transparent opacity={0.4} />
                </Sphere>
            ))}
        </group>
    );
};

// --- MAIN COMPONENT ---

export default function DeepLearningMasterclassContent() {
    const [activePhase, setActivePhase] = useState(1);

    // Phase specific states
    const [cnnFilterActive, setCnnFilterActive] = useState(false);
    const [sequenceLength, setSequenceLength] = useState(3);
    const [attentionActive, setAttentionActive] = useState(false);

    // AI states
    const [userQuestion, setUserQuestion] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setAiResponse("");
        setUserQuestion("");
    }, [activePhase]);

    const handleAskAI = async () => {
        if (!userQuestion.trim()) return;
        setIsGenerating(true);
        setAiResponse("");
        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `You are an AI Tutor for Deep Learning Architectures. The student is currently studying: "${phases[activePhase - 1].title}". Their question is: "${userQuestion}". Explain the concepts using standard markdown without KaTeX math formatting. Output standard code blocks for formulas if needed.`
                })
            });
            const data = await res.json();
            setAiResponse(data.text || data.error || "Failed to generate response.");
        } catch {
            setAiResponse("I encountered an issue connecting to the AI system.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#05030A] text-gray-200 font-sans overflow-hidden">

            {/* Pane 1: Sidebar (20%) */}
            <div className="w-[20%] border-r border-purple-900/40 bg-[#080310] p-6 flex flex-col overflow-y-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                </Link>
                <h2 className="text-sm font-bold tracking-widest text-[#d8b4fe] mb-6 uppercase leading-tight flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Deep Learning
                </h2>
                <div className="space-y-2">
                    {phases.map((phase) => {
                        const isActive = activePhase === phase.id;
                        return (
                            <button
                                key={phase.id}
                                onClick={() => setActivePhase(phase.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${isActive
                                    ? "bg-purple-900/50 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white"
                                    : "hover:bg-purple-900/20 text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-[#d8b4fe] text-black" : "bg-gray-800"}`}>
                                    {phase.id}
                                </div>
                                <span className="text-sm font-medium leading-tight truncate">{phase.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pane 2: Theory & 2D Controls (40%) */}
            <div className="w-[40%] flex flex-col border-r border-purple-900/40 overflow-y-auto bg-gradient-to-b from-[#0B0515] to-[#05030A]">
                <div className="p-10 flex-grow">
                    <span className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-4 block">Architecture Phase {activePhase} / 12</span>

                    <div className="prose prose-invert prose-purple max-w-none text-sm/relaxed mb-10">
                        <ReactMarkdown>{phaseContent[activePhase]}</ReactMarkdown>
                    </div>

                    {/* 2D Interactive Controls */}
                    <div className="bg-[#050208] border border-purple-900/50 rounded-2xl p-6 mb-8 shadow-inner relative overflow-hidden">
                        <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">Visualizer Engine</h3>

                        {activePhase === 3 ? (
                            <button
                                onClick={() => setCnnFilterActive(!cnnFilterActive)}
                                className={`w-full py-3 rounded-xl font-mono text-sm font-bold transition-all border ${cnnFilterActive ? 'bg-purple-600/20 border-purple-400 text-purple-300' : 'bg-purple-900/40 border-purple-700 hover:bg-purple-800 text-white'
                                    }`}
                            >
                                {cnnFilterActive ? "Stop Convolution Filter" : "Pass Convolution Filter (3x3 Kernel)"}
                            </button>
                        ) : (activePhase === 4 || activePhase === 5 || activePhase === 6) ? (
                            <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-purple-900/30">
                                <span className="text-sm text-purple-400 font-mono">Unroll Sequence (t={sequenceLength})</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setSequenceLength(Math.max(1, sequenceLength - 1))} className="px-3 py-1 bg-purple-900/40 hover:bg-purple-800 rounded text-purple-400 font-mono">-</button>
                                    <button onClick={() => setSequenceLength(Math.min(5, sequenceLength + 1))} className="px-3 py-1 bg-purple-900/40 hover:bg-purple-800 rounded text-purple-400 font-mono">+</button>
                                </div>
                            </div>
                        ) : (activePhase === 9 || activePhase === 10) ? (
                            <button
                                onClick={() => setAttentionActive(!attentionActive)}
                                className={`w-full py-3 rounded-xl font-mono text-sm font-bold transition-all border ${attentionActive ? 'bg-amber-600/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-purple-900/40 border-purple-700 hover:bg-amber-900/40 text-white'
                                    }`}
                            >
                                {attentionActive ? "Hide Attention Matrices" : "Calculate Self-Attention (QKV)"}
                            </button>
                        ) : (
                            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono p-3 rounded flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                Architecture Visualizer Active
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Tutor Chat */}
                <div className="p-8 bg-[#05030A] border-t border-purple-900/40">
                    <div className="flex items-center gap-2 mb-4 text-[#d8b4fe] font-semibold text-sm">
                        <Sparkles size={16} /> Ask Your AI Tutor
                    </div>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder={`Ask about ${phases[activePhase - 1].title}...`}
                            className="flex-1 bg-[#0A0510] border border-purple-900/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white placeholder-gray-600 transition-colors"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAskAI(); }}
                        />
                        <button
                            onClick={handleAskAI}
                            disabled={isGenerating || !userQuestion.trim()}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        >
                            Ask
                        </button>
                    </div>
                    {isGenerating && (
                        <div className="text-purple-400 text-sm font-mono animate-pulse">Loading tensor cores...</div>
                    )}
                    {aiResponse && !isGenerating && (
                        <div className="bg-purple-900/20 border border-purple-500/20 p-5 rounded-xl text-sm/relaxed text-gray-300 prose prose-invert prose-purple">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-[40%] relative bg-[#020104]">
                <div className="absolute top-6 right-6 z-10 bg-black/60 border border-purple-500/30 px-3 py-1.5 rounded-full text-[10px] font-mono text-purple-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-[ping_1.5s_ease-in-out_infinite]"></div>
                    ARCHITECTURE SPACE
                </div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full"></div>
                </div>

                <Canvas camera={{ position: [5, 4, 7], fov: 45 }}>
                    <color attach="background" args={["#020104"]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />
                    <OrbitControls enableZoom={true} />

                    {activePhase === 3 && <CNNScene isFilterActive={cnnFilterActive} />}
                    {(activePhase === 4 || activePhase === 5 || activePhase === 6) && <RNNScene length={sequenceLength} />}
                    {activePhase === 7 && <AutoencoderScene />}
                    {activePhase === 8 && <GANScene />}
                    {(activePhase === 9 || activePhase === 10) && <TransformerScene isAttentionActive={attentionActive} />}

                    {![3, 4, 5, 6, 7, 8, 9, 10].includes(activePhase) && <GalaxyScene />}

                </Canvas>
            </div>

        </div>
    );
}
