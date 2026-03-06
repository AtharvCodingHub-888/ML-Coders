"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Line, Html, Float } from '@react-three/drei';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';

const phases = [
    { id: 1, title: "Intro to Unsupervised Learning" },
    { id: 2, title: "Data Preparation" },
    { id: 3, title: "Clustering Fundamentals" },
    { id: 4, title: "K-Means Clustering" },
    { id: 5, title: "Hierarchical Clustering" },
    { id: 6, title: "DBSCAN" },
    { id: 7, title: "Dimensionality Reduction" },
    { id: 8, title: "Principal Component Analysis" },
    { id: 9, title: "t-SNE & UMAP" },
    { id: 10, title: "Anomaly Detection" },
    { id: 11, title: "Association Rule Learning" },
    { id: 12, title: "Unsupervised Workflow" }
];

const phaseContent: Record<number, string> = {
    1: "### 1. Introduction to Unsupervised Learning\n\nThe model finds hidden structures in unlabeled data. There is no target variable (y). \n\n**Key Idea:**\nPattern discovery & grouping.\n\n**Example:** Customer segmentation.",
    2: "### 2. Data Preparation\n\nClustering relies heavily on distance. If features aren't scaled properly, features with larger numbers dominate the distance calculations. \n\n**Techniques:**\n* Feature scaling\n* Normalization",
    3: "### 3. Clustering Fundamentals\n\nHow do we define similarity? We use distance metrics to group data points together.\n\n**Common Metrics:**\n* Euclidean Distance\n* Manhattan Distance\n* Cosine Similarity",
    4: "### 4. K-Means Clustering\n\nPartitions data into K distinct clusters. \n\n**The Algorithm:**\n1. Place K random centroids.\n2. Assign points to the nearest centroid.\n3. Move centroid to the mean of those points.\n4. Repeat until optimized.",
    5: "### 5. Hierarchical Clustering\n\nBuilds a tree of clusters (a Dendrogram). \n\n**Agglomerative (Bottom-Up):** Starts with each point as its own cluster and merges the closest pairs.",
    6: "### 6. Density-Based Clustering (DBSCAN)\n\nGroups together points that are closely packed together (many nearby neighbors), marking points that lie alone in low-density regions as outliers (noise).\n\n**Parameters:**\n* Epsilon (Radius)\n* Min Points",
    7: "### 7. Dimensionality Reduction\n\nThe 'Curse of Dimensionality' makes data hard to process and impossible to visualize. We aim to compress 100 features down to 2 or 3 while keeping the core information.",
    8: "### 8. Principal Component Analysis (PCA)\n\nTransforms data into a new coordinate system. The first Principal Component captures the maximum variance in the data.\n\nUsed for: Data compression, noise reduction.",
    9: "### 9. t-SNE & UMAP\n\nAdvanced nonlinear techniques. Perfect for visualizing massive, complex datasets like Image Embeddings or LLM Word Vectors in 2D or 3D space.",
    10: "### 10. Anomaly Detection\n\nIdentifying rare items, events, or observations which raise suspicions by differing significantly from the majority of the data.\n\n**Algorithms:** Isolation Forest, Local Outlier Factor.",
    11: "### 11. Association Rule Learning\n\nDiscovers interesting relations between variables in large databases.\n\n**Example:** 'People who buy bread often buy butter.'\n**Algorithms:** Apriori, FP-Growth.",
    12: "### 12. Unsupervised Workflow\n\nThe complete pipeline: Collect -> Clean -> Scale -> Choose Method -> Evaluate -> Visualize -> Deploy."
};

// --- 3D SCENE COMPONENTS ---

const KMeansScene = ({ kClusters }: { kClusters: number }) => {
    const clusterColors = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#eab308"];

    // Deterministic random points around K centers
    const points = useMemo(() => {
        const pts = [];
        const centers = [
            [2, 2, 0], [-2, -2, 0], [2, -2, 0], [-2, 2, 0], [0, 0, 2]
        ];
        for (let i = 0; i < 30; i++) {
            const cIdx = i % kClusters; // Force them into kClusters groups
            const cx = centers[cIdx][0];
            const cy = centers[cIdx][1];
            const cz = centers[cIdx][2];
            pts.push({
                pos: [cx + (Math.random() - 0.5) * 1.5, cy + (Math.random() - 0.5) * 1.5, cz + (Math.random() - 0.5) * 1.5],
                color: clusterColors[cIdx]
            });
        }
        return pts;
    }, [kClusters]);

    const centroids = useMemo(() => {
        const centers = [
            [2, 2, 0], [-2, -2, 0], [2, -2, 0], [-2, 2, 0], [0, 0, 2]
        ];
        return centers.slice(0, kClusters);
    }, [kClusters]);

    return (
        <group>
            {points.map((p, i) => (
                <Sphere key={'p' + i} position={new THREE.Vector3(...p.pos)} args={[0.15, 16, 16]}>
                    <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.5} />
                </Sphere>
            ))}
            {centroids.map((c, i) => (
                <Float key={'c' + i} speed={2} rotationIntensity={1} floatIntensity={0.5}>
                    <Box position={new THREE.Vector3(...c)} args={[0.5, 0.5, 0.5]}>
                        <meshStandardMaterial color={clusterColors[i]} emissive={clusterColors[i]} emissiveIntensity={1} wireframe={false} />
                    </Box>
                    <Html position={new THREE.Vector3(c[0], c[1] + 0.8, c[2])} center>
                        <div className="bg-black/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 text-white truncate">Centroid {i + 1}</div>
                    </Html>
                </Float>
            ))}
        </group>
    );
};

const HierarchicalScene = () => {
    // A manually defined 3D Dendrogram
    return (
        <group position={[0, -2, 0]}>
            {/* Base Points */}
            <Sphere position={[-2, 0, 0]} args={[0.2, 16, 16]}><meshStandardMaterial color="#a855f7" /></Sphere>
            <Sphere position={[-1, 0, 0]} args={[0.2, 16, 16]}><meshStandardMaterial color="#a855f7" /></Sphere>
            <Sphere position={[1, 0, 0]} args={[0.2, 16, 16]}><meshStandardMaterial color="#3b82f6" /></Sphere>
            <Sphere position={[2, 0, 0]} args={[0.2, 16, 16]}><meshStandardMaterial color="#3b82f6" /></Sphere>

            {/* Level 1 Merges */}
            <Line points={[[-2, 0, 0], [-2, 1, 0], [-1, 1, 0], [-1, 0, 0]]} color="#a855f7" lineWidth={2} />
            <Line points={[[1, 0, 0], [1, 1.5, 0], [2, 1.5, 0], [2, 0, 0]]} color="#3b82f6" lineWidth={2} />

            {/* Level 1 Nodes */}
            <Sphere position={[-1.5, 1, 0]} args={[0.15, 16, 16]}><meshStandardMaterial color="#a855f7" emissive="#a855f7" /></Sphere>
            <Sphere position={[1.5, 1.5, 0]} args={[0.15, 16, 16]}><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" /></Sphere>

            {/* Level 2 Merge (Root) */}
            <Line points={[[-1.5, 1, 0], [-1.5, 3, 0], [1.5, 3, 0], [1.5, 1.5, 0]]} color="#ffffff" lineWidth={3} />
            <Sphere position={[0, 3, 0]} args={[0.3, 16, 16]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" /></Sphere>

            <Html position={[0, 3.5, 0]} center>
                <div className="text-xs font-mono font-bold text-white bg-black/50 px-2 py-1 rounded">Root Cluster</div>
            </Html>
        </group>
    );
};

const DBSCANScene = ({ epsilon }: { epsilon: number }) => {
    // Generate two dense clusters
    const dense1 = useMemo(() => Array.from({ length: 15 }).map(() => [
        -2 + (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)
    ]), []);
    const dense2 = useMemo(() => Array.from({ length: 15 }).map(() => [
        2 + (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)
    ]), []);

    // Noise points
    const noise = [[0, 3, 0], [0, -3, 0], [3, 3, 0], [-3, -3, 0]];

    return (
        <group>
            {/* Dense Clusters */}
            {dense1.map((p, i) => <Sphere key={'d1' + i} position={new THREE.Vector3(...p)} args={[0.15, 16, 16]}><meshStandardMaterial color="#22c55e" /></Sphere>)}
            {dense2.map((p, i) => <Sphere key={'d2' + i} position={new THREE.Vector3(...p)} args={[0.15, 16, 16]}><meshStandardMaterial color="#22c55e" /></Sphere>)}

            {/* Epsilon Radii */}
            <Sphere position={[-2, 0, 0]} args={[epsilon * 0.6, 32, 32]}>
                <meshStandardMaterial color="#22c55e" transparent opacity={0.15} depthWrite={false} />
            </Sphere>
            <Sphere position={[2, 0, 0]} args={[epsilon * 0.6, 32, 32]}>
                <meshStandardMaterial color="#22c55e" transparent opacity={0.15} depthWrite={false} />
            </Sphere>

            {/* Noise */}
            {noise.map((p, i) => (
                <group key={'n' + i} position={new THREE.Vector3(...p)}>
                    <Sphere args={[0.15, 16, 16]}><meshStandardMaterial color="#ef4444" emissive="#ef4444" /></Sphere>
                    <Html position={[0, 0.4, 0]} center>
                        <div className="text-[9px] text-red-400 font-mono">Noise</div>
                    </Html>
                </group>
            ))}
        </group>
    );
};

const PCAScene = ({ dimensions }: { dimensions: number }) => {
    const points = useMemo(() => {
        return Array.from({ length: 50 }).map(() => ({
            origX: (Math.random() - 0.5) * 6,
            origY: (Math.random() - 0.5) * 6,
            origZ: (Math.random() - 0.5) * 6,
        }));
    }, []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((child, i) => {
            const p = points[i];
            const targetX = p.origX;
            const targetY = dimensions >= 2 ? p.origY : 0; // Flatten to 1D (line) if dim=1
            const targetZ = dimensions === 3 ? p.origZ : 0; // Flatten to 2D (plane) if dim<=2

            child.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
        });
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    });

    return (
        <group>
            <group ref={groupRef}>
                {points.map((p, i) => (
                    <Sphere key={i} position={[p.origX, p.origY, p.origZ]} args={[0.1, 16, 16]}>
                        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
                    </Sphere>
                ))}
            </group>
            {/* Visualization Aids */}
            {dimensions === 2 && <Plane args={[8, 8]} rotation={[-Math.PI / 2, 0, 0]}><meshBasicMaterial color="#a855f7" transparent opacity={0.1} wireframe /></Plane>}
            {dimensions === 1 && <Line points={[[-4, 0, 0], [4, 0, 0]]} color="#a855f7" lineWidth={3} />}
        </group>
    );
};

const GalaxyScene = () => {
    const points = useMemo(() => {
        return Array.from({ length: 200 }).map(() => {
            const radius = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 2;
            return [Math.cos(theta) * radius, y, Math.sin(theta) * radius];
        });
    }, []);

    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    });

    return (
        <group ref={groupRef}>
            {points.map((p, i) => (
                <Sphere key={i} position={new THREE.Vector3(...p)} args={[0.03, 8, 8]}>
                    <meshBasicMaterial color={Math.random() > 0.5 ? "#a855f7" : "#22d3ee"} transparent opacity={0.6 + Math.random() * 0.4} />
                </Sphere>
            ))}
        </group>
    );
};


// --- MAIN COMPONENT ---

export default function UnsupervisedMasterclassContent() {
    const [activePhase, setActivePhase] = useState(1);

    // Phase specific states
    const [kClusters, setKClusters] = useState(3);
    const [epsilon, setEpsilon] = useState(2);
    const [dimensions, setDimensions] = useState(3);

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
                    prompt: `You are an AI Tutor for Unsupervised Learning. The student is currently in phase: "${phases[activePhase - 1].title}". Their question is: "${userQuestion}". Explain the concepts using standard markdown without KaTeX math formatting. Keep it informative but accessible.`
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
        <div className="flex h-screen bg-[#05050A] text-gray-200 font-sans overflow-hidden">

            {/* Pane 1: Sidebar (20%) */}
            <div className="w-1/5 border-r border-purple-900/30 bg-[#080511] p-6 flex flex-col overflow-y-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                </Link>
                <h2 className="text-sm font-bold tracking-widest text-[#a855f7] mb-6 uppercase leading-tight">Unsupervised Learning</h2>
                <div className="space-y-2">
                    {phases.map((phase) => {
                        const isActive = activePhase === phase.id;
                        return (
                            <button
                                key={phase.id}
                                onClick={() => setActivePhase(phase.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${isActive
                                        ? "bg-purple-900/40 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white"
                                        : "hover:bg-purple-900/20 text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-[#a855f7] text-white" : "bg-gray-800"}`}>
                                    {phase.id}
                                </div>
                                <span className="text-sm font-medium leading-tight truncate">{phase.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pane 2: Theory & 2D Controls (40%) */}
            <div className="w-2/5 flex flex-col border-r border-purple-900/30 overflow-y-auto bg-gradient-to-b from-[#0a0510] to-[#05050A]">
                <div className="p-10 flex-grow">
                    <span className="text-xs uppercase tracking-widest text-purple-500 font-bold mb-4 block">Module {activePhase} / 12</span>

                    <div className="prose prose-invert prose-purple max-w-none text-sm/relaxed mb-10">
                        <ReactMarkdown>{phaseContent[activePhase]}</ReactMarkdown>
                    </div>

                    {/* 2D Interactive Controls */}
                    <div className="bg-[#0b0514] border border-purple-900/50 rounded-2xl p-6 mb-8 shadow-inner">
                        <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">Engine Configuration</h3>

                        {activePhase === 4 ? (
                            <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-purple-900/30">
                                <span className="text-sm text-purple-400 font-mono">K-Clusters: {kClusters}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setKClusters(Math.max(1, kClusters - 1))} className="px-3 py-1 bg-purple-900/40 hover:bg-purple-800 rounded text-purple-400 font-mono">-</button>
                                    <button onClick={() => setKClusters(Math.min(5, kClusters + 1))} className="px-3 py-1 bg-purple-900/40 hover:bg-purple-800 rounded text-purple-400 font-mono">+</button>
                                </div>
                            </div>
                        ) : activePhase === 6 ? (
                            <div className="space-y-4">
                                <label className="text-sm text-purple-400 font-mono block">Epsilon Radius: {epsilon.toFixed(1)}</label>
                                <input
                                    type="range"
                                    min="1" max="5" step="0.5"
                                    value={epsilon}
                                    onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                                    className="w-full accent-purple-500"
                                />
                            </div>
                        ) : activePhase === 8 ? (
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-mono text-purple-400 block mb-2">Target Dimensions: {dimensions}D</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setDimensions(3)} className={`py-2 rounded text-xs font-bold ${dimensions === 3 ? 'bg-purple-600' : 'bg-purple-900/40 hover:bg-purple-800'}`}>3D (Raw Data)</button>
                                    <button onClick={() => setDimensions(2)} className={`py-2 rounded text-xs font-bold ${dimensions === 2 ? 'bg-purple-600' : 'bg-purple-900/40 hover:bg-purple-800'}`}>2D (Plane)</button>
                                    <button onClick={() => setDimensions(1)} className={`py-2 rounded text-xs font-bold ${dimensions === 1 ? 'bg-purple-600' : 'bg-purple-900/40 hover:bg-purple-800'}`}>1D (Line)</button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono p-3 rounded flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                Unsupervised Engine Active
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Tutor Chat */}
                <div className="p-8 bg-[#05050A] border-t border-purple-900/30">
                    <div className="flex items-center gap-2 mb-4 text-[#a855f7] font-semibold text-sm">
                        <Sparkles size={16} /> Ask Your AI Tutor
                    </div>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder={`Ask about ${phases[activePhase - 1].title}...`}
                            className="flex-1 bg-[#0a0510] border border-purple-900/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white placeholder-gray-600 transition-colors"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAskAI(); }}
                        />
                        <button
                            onClick={handleAskAI}
                            disabled={isGenerating || !userQuestion.trim()}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        >
                            Ask
                        </button>
                    </div>
                    {isGenerating && (
                        <div className="text-purple-400 text-sm font-mono animate-pulse">Analyzing embedded space...</div>
                    )}
                    {aiResponse && !isGenerating && (
                        <div className="bg-purple-900/20 border border-purple-500/20 p-5 rounded-xl text-sm/relaxed text-gray-300 prose prose-invert prose-purple">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-2/5 relative bg-[#020205]">
                <div className="absolute top-6 right-6 z-10 bg-black/60 border border-purple-500/30 px-3 py-1.5 rounded-full text-[10px] font-mono text-purple-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    LATENT SPACE VISUALIZER
                </div>

                {/* Glow ambient effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full"></div>
                    <div className="absolute -bottom-[20%] -left-[20%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full"></div>
                </div>

                <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                    <color attach="background" args={["#020205"]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />
                    <OrbitControls enableZoom={true} />

                    {activePhase === 4 && <KMeansScene kClusters={kClusters} />}
                    {activePhase === 5 && <HierarchicalScene />}
                    {activePhase === 6 && <DBSCANScene epsilon={epsilon} />}
                    {activePhase === 8 && <PCASScene dimensions={dimensions} />}
                    {![4, 5, 6, 8].includes(activePhase) && <GalaxyScene />}

                </Canvas>
            </div>

        </div>
    );
}
