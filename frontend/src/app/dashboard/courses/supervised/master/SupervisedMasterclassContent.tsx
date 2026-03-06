"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Line, Plane, Html } from '@react-three/drei';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';

const phases = [
    { id: 1, title: "Intro to Supervised Learning" },
    { id: 2, title: "Data Preparation" },
    { id: 3, title: "Linear Regression" },
    { id: 4, title: "Logistic Regression" },
    { id: 5, title: "k-Nearest Neighbors" },
    { id: 6, title: "Decision Trees" },
    { id: 7, title: "Ensemble Methods" },
    { id: 8, title: "Support Vector Machines" },
    { id: 9, title: "Model Evaluation" },
    { id: 10, title: "Overfitting & Reg." },
    { id: 11, title: "Feature Selection" },
    { id: 12, title: "The ML Pipeline" }
];

const phaseContent: Record<number, string> = {
    1: "### 1. Introduction to Supervised Learning\n\nA model learns a mapping from input features (X) to a target variable (y). \n\n**Key Idea:**\nf(X) -> y\n\n**Example:** House size -> Price prediction",
    2: "### 2. Data Preparation\n\nBefore learning, data must be cleaned. This includes handling missing data, scaling features, and encoding categorical variables using libraries like Pandas and NumPy.",
    3: "### 3. Linear Regression\n\nPredicts a continuous value by fitting a straight line (or plane) through the data.\n\n**The Equation:**\ny = wX + b\n\nWe optimize weights (w) and bias (b) using Gradient Descent to minimize the Cost Function.",
    4: "### 4. Logistic Regression\n\nUsed for classification (predicting categories, like Spam/Not Spam). It squashes the output between 0 and 1 using the Sigmoid function.\n\n**Sigmoid Equation:**\nP(y=1) = 1 / (1 + e^-z)",
    5: "### 5. k-Nearest Neighbors (KNN)\n\nClassifies a data point based on how its neighbors are classified. It relies heavily on distance metrics.\n\n**Euclidean Distance:**\nd(x,y) = sum((xi - yi)^2)",
    6: "### 6. Decision Trees\n\nSplits data into branches based on feature conditions. It uses metrics like Entropy and Gini Impurity to decide the best split.",
    7: "### 7. Ensemble Methods\n\nCombines multiple weak models to create a massive powerhouse. Includes Bagging (Random Forest) and Boosting (XGBoost) to reduce overfitting.",
    8: "### 8. Support Vector Machines (SVM)\n\nFinds the optimal hyperplane that maximizes the margin between different classes. Uses the 'Kernel Trick' for nonlinear data.",
    9: "### 9. Model Evaluation\n\nHow do we know it works? We measure Accuracy, Precision, Recall, and F1 Score, and visualize errors using a Confusion Matrix.",
    10: "### 10. Overfitting & Regularization\n\nThe Bias-Variance tradeoff. If a model memorizes the training data, it fails in the real world. We fix this using L1/L2 Regularization.",
    11: "### 11. Feature Selection\n\nNot all data is useful. We use PCA or SelectKBest to reduce dimensionality and keep only the most important features.",
    12: "### 12. The ML Pipeline\n\nThe real-world workflow: Collect -> Clean -> Engineer -> Train -> Evaluate -> Deploy."
};

// --- 3D SCENE COMPONENTS ---

const LinearRegScene = ({ weight }: { weight: number }) => {
    const points = [[-4, -3], [-3, -1], [-2, -2], [-1, 0], [0, 1], [1, 2], [2, 1], [3, 4], [4, 5]]
        .map(p => new THREE.Vector3(p[0] * 0.5, p[1] * 0.5, 0));

    const startPoint = new THREE.Vector3(-3, -3 * (weight * 0.2), 0);
    const endPoint = new THREE.Vector3(3, 3 * (weight * 0.2), 0);

    return (
        <group>
            {points.map((p, i) => (
                <Sphere key={'p' + i} position={p} args={[0.15, 16, 16]}>
                    <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
                </Sphere>
            ))}
            <Line points={[startPoint, endPoint]} color="#a855f7" lineWidth={3} />
            <Html position={[0, -2, 0]} center>
                <span className="text-xs font-mono text-purple-400 bg-black/50 px-2 py-1 rounded border border-purple-500/30">y = {weight.toFixed(1)}x + b</span>
            </Html>
        </group>
    );
};

const ClassificationScene = () => {
    const redPoints = [[-2, 1, 0], [-3, -1, 1], [-2.5, 2, -1], [-1.5, -2, 0.5], [-3.5, 0, -0.5]].map(p => new THREE.Vector3(...p));
    const bluePoints = [[2, -1, 0], [3, 1, -1], [2.5, -2, 1], [1.5, 2, -0.5], [3.5, 0, 0.5]].map(p => new THREE.Vector3(...p));

    const planeRef = useRef<any>(null);
    useFrame((state) => {
        if (planeRef.current) {
            planeRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <group>
            {redPoints.map((p, i) => (
                <Sphere key={`r-${i}`} position={p} args={[0.2, 16, 16]}>
                    <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.5} />
                </Sphere>
            ))}
            {bluePoints.map((p, i) => (
                <Sphere key={`b-${i}`} position={p} args={[0.2, 16, 16]}>
                    <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
                </Sphere>
            ))}
            <Plane ref={planeRef} args={[6, 6]} rotation={[0, Math.PI / 2, 0]}>
                <meshStandardMaterial color="#eab308" transparent opacity={0.3} side={THREE.DoubleSide} />
            </Plane>
        </group>
    );
};

const KNNScene = ({ kValue }: { kValue: number }) => {
    const spheres = [
        { pos: [1, 1, 0], color: "#ef4444" },
        { pos: [-1.5, 0.5, 0], color: "#3b82f6" },
        { pos: [0.5, -1.5, 0], color: "#22c55e" },
        { pos: [-1, -1, 0], color: "#a855f7" },
        { pos: [2, -0.5, 0], color: "#eab308" },
        { pos: [-0.5, 2, 0], color: "#f97316" },
        { pos: [2.5, 1.5, 0], color: "#ec4899" },
        { pos: [-2, -1.5, 0], color: "#14b8a6" },
        { pos: [0, 2.5, 0], color: "#6366f1" }
    ];

    const center = new THREE.Vector3(0, 0, 0);
    const sorted = [...spheres].sort((a, b) => {
        const da = a.pos[0] ** 2 + a.pos[1] ** 2;
        const db = b.pos[0] ** 2 + b.pos[1] ** 2;
        return da - db;
    });

    return (
        <group>
            <Sphere position={[0, 0, 0]} args={[0.3, 32, 32]}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </Sphere>

            {spheres.map((s, i) => (
                <Sphere key={'s' + i} position={new THREE.Vector3(...s.pos)} args={[0.2, 16, 16]}>
                    <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.5} />
                </Sphere>
            ))}

            {sorted.slice(0, kValue).map((s, i) => (
                <Line key={'l' + i} points={[center, new THREE.Vector3(...s.pos)]} color="#ffffff" lineWidth={2} transparent opacity={0.6} />
            ))}
        </group>
    );
};

const TreeScene = ({ depth }: { depth: number }) => {
    const nodes: { x: number; y: number; z: number }[] = [];
    const lines: { start: number[]; end: number[] }[] = [];

    const buildTree = (x: number, y: number, z: number, currentDepth: number, maxDepth: number, hSpacing: number) => {
        nodes.push({ x, y, z });
        if (currentDepth < maxDepth) {
            const leftX = x - hSpacing;
            const rightX = x + hSpacing;
            const nextY = y - 1.5;
            lines.push({ start: [x, y, z], end: [leftX, nextY, z] });
            lines.push({ start: [x, y, z], end: [rightX, nextY, z] });
            buildTree(leftX, nextY, z, currentDepth + 1, maxDepth, hSpacing / 1.8);
            buildTree(rightX, nextY, z, currentDepth + 1, maxDepth, hSpacing / 1.8);
        }
    };

    buildTree(0, 2, 0, 1, depth, 2);

    return (
        <group>
            {nodes.map((n, i) => (
                <Sphere key={'n' + i} position={[n.x, n.y, n.z]} args={[0.15, 16, 16]}>
                    <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
                </Sphere>
            ))}
            {lines.map((l, i) => (
                <Line key={'l' + i} points={[new THREE.Vector3(...l.start), new THREE.Vector3(...l.end)]} color="#4ade80" lineWidth={1} transparent opacity={0.5} />
            ))}
        </group>
    );
};

const PipelineScene = () => {
    const cubesRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (cubesRef.current) {
            cubesRef.current.position.x = (state.clock.elapsedTime * 2) % 4;
        }
    });

    return (
        <group>
            <group ref={cubesRef as any}>
                {[-8, -4, 0, 4, 8].map((x, i) => (
                    <Box key={i} position={[x, Math.sin(x) * 0.5, 0]} args={[0.6, 0.6, 0.6]}>
                        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} wireframe />
                    </Box>
                ))}
            </group>
            <gridHelper args={[20, 20, '#06b6d4', '#164e63']} position={[0, -2, 0]} />
        </group>
    );
};

// --- MAIN COMPONENT ---

export default function SupervisedMasterclassContent() {
    const [activePhase, setActivePhase] = useState(1);

    // Phase specific states
    const [weight, setWeight] = useState(1);
    const [kValue, setKValue] = useState(3);
    const [treeDepth, setTreeDepth] = useState(1);

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
                    prompt: `You are an AI Tutor for Supervised Learning. The student is currently in phase: "${phases[activePhase - 1].title}". Their question is: "${userQuestion}". Explain the concepts using standard markdown without KaTeX math formatting.`
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
            <div className="w-1/5 border-r border-cyan-900/30 bg-[#080811] p-6 flex flex-col overflow-y-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                </Link>
                <h2 className="text-sm font-bold tracking-widest text-[#22d3ee] mb-6 uppercase">Supervised Learning</h2>
                <div className="space-y-2">
                    {phases.map((phase) => {
                        const isActive = activePhase === phase.id;
                        return (
                            <button
                                key={phase.id}
                                onClick={() => setActivePhase(phase.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${isActive
                                        ? "bg-cyan-900/40 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-white"
                                        : "hover:bg-cyan-900/20 text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-[#22d3ee] text-black" : "bg-gray-800"}`}>
                                    {phase.id}
                                </div>
                                <span className="text-sm font-medium leading-tight truncate">{phase.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pane 2: Theory & 2D Controls (40%) */}
            <div className="w-2/5 flex flex-col border-r border-cyan-900/30 overflow-y-auto bg-gradient-to-b from-[#0a0f18] to-[#05050A]">
                <div className="p-10 flex-grow">
                    <span className="text-xs uppercase tracking-widest text-cyan-500 font-bold mb-4 block">Module {activePhase} / 12</span>

                    <div className="prose prose-invert prose-cyan max-w-none text-sm/relaxed mb-10">
                        <ReactMarkdown>{phaseContent[activePhase]}</ReactMarkdown>
                    </div>

                    {/* 2D Interactive Controls */}
                    <div className="bg-[#050B14] border border-cyan-900/50 rounded-2xl p-6 mb-8 shadow-inner">
                        <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">Engine Configuration</h3>

                        {activePhase === 3 ? (
                            <div className="space-y-4">
                                <label className="text-sm text-cyan-400 font-mono block">Weight (w): {weight.toFixed(1)}</label>
                                <input
                                    type="range"
                                    min="-5" max="5" step="0.5"
                                    value={weight}
                                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                                    className="w-full accent-cyan-500"
                                />
                            </div>
                        ) : activePhase === 5 ? (
                            <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-cyan-900/30">
                                <span className="text-sm text-cyan-400 font-mono">k-Value: {kValue}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setKValue(Math.max(1, kValue - 1))} className="px-3 py-1 bg-cyan-900/40 hover:bg-cyan-800 rounded text-cyan-400 font-mono">-</button>
                                    <button onClick={() => setKValue(Math.min(9, kValue + 1))} className="px-3 py-1 bg-cyan-900/40 hover:bg-cyan-800 rounded text-cyan-400 font-mono">+</button>
                                </div>
                            </div>
                        ) : activePhase === 6 ? (
                            <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-cyan-900/30">
                                <span className="text-sm text-cyan-400 font-mono">Tree Depth: {treeDepth}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setTreeDepth(Math.max(1, treeDepth - 1))} className="px-3 py-1 bg-cyan-900/40 hover:bg-cyan-800 rounded text-cyan-400 font-mono">-</button>
                                    <button onClick={() => setTreeDepth(Math.min(4, treeDepth + 1))} className="px-3 py-1 bg-cyan-900/40 hover:bg-cyan-800 rounded text-cyan-400 font-mono">+</button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono p-3 rounded flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                                Theory Module Active
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Tutor Chat */}
                <div className="p-8 bg-[#05050A] border-t border-cyan-900/30">
                    <div className="flex items-center gap-2 mb-4 text-[#22d3ee] font-semibold text-sm">
                        <Sparkles size={16} /> Ask Your AI Tutor
                    </div>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder={`Ask about ${phases[activePhase - 1].title}...`}
                            className="flex-1 bg-[#0a0510] border border-cyan-900/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white placeholder-gray-600 transition-colors"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAskAI(); }}
                        />
                        <button
                            onClick={handleAskAI}
                            disabled={isGenerating || !userQuestion.trim()}
                            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        >
                            Ask
                        </button>
                    </div>
                    {isGenerating && (
                        <div className="text-cyan-400 text-sm font-mono animate-pulse">Analyzing vector space...</div>
                    )}
                    {aiResponse && !isGenerating && (
                        <div className="bg-cyan-900/20 border border-cyan-500/20 p-5 rounded-xl text-sm/relaxed text-gray-300 prose prose-invert prose-cyan">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-2/5 relative bg-[#020205]">
                <div className="absolute top-6 right-6 z-10 bg-black/60 border border-cyan-500/30 px-3 py-1.5 rounded-full text-[10px] font-mono text-cyan-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    L1/L2 COMPUTE GRAPH
                </div>

                {/* Glow ambient effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full"></div>
                    <div className="absolute -bottom-[20%] -left-[20%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full"></div>
                </div>

                <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                    <color attach="background" args={["#020205"]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />
                    <OrbitControls enableZoom={true} />

                    {activePhase === 3 && <LinearRegScene weight={weight} />}
                    {(activePhase === 4 || activePhase === 8) && <ClassificationScene />}
                    {activePhase === 5 && <KNNScene kValue={kValue} />}
                    {(activePhase === 6 || activePhase === 7) && <TreeScene depth={treeDepth} />}
                    {![3, 4, 5, 6, 7, 8].includes(activePhase) && <PipelineScene />}

                </Canvas>
            </div>

        </div>
    );
}
