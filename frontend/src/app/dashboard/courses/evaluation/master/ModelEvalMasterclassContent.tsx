"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html, Float } from '@react-three/drei';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ChevronLeft, Target } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';

const phases = [
    { id: 1, title: "Intro to Model Evaluation" },
    { id: 2, title: "Train-Test Split" },
    { id: 3, title: "Classification Metrics" },
    { id: 4, title: "Confusion Matrix" },
    { id: 5, title: "ROC Curve & AUC" },
    { id: 6, title: "Precision-Recall Curve" },
    { id: 7, title: "Regression Metrics" },
    { id: 8, title: "Cross Validation" },
    { id: 9, title: "Bias-Variance Tradeoff" },
    { id: 10, title: "Hyperparameter Tuning" },
    { id: 11, title: "Learning Curves" },
    { id: 12, title: "Real-World Evaluation" }
];

const phaseContent: Record<number, string> = {
    1: "### 1. Intro to Model Evaluation\n\nWe must ensure the model performs well on unseen data. A model that only memorizes the training set is useless in the real world.",
    2: "### 2. Train-Test Split\n\nWe divide our dataset. The model learns from the Training Set, and we grade its final exam using the Test Set.\n\n```python\nfrom sklearn.model_selection import train_test_split\n```",
    3: "### 3. Classification Metrics\n\nHow do we measure success?\n* **Accuracy:** Correct / Total\n* **Precision:** TP / (TP + FP)\n* **Recall:** TP / (TP + FN)",
    4: "### 4. Confusion Matrix\n\nA 2x2 grid showing exactly where the model got confused.\n* **True Positive (TP):** Predicted Yes, Actually Yes.\n* **False Positive (FP):** Predicted Yes, Actually No.",
    5: "### 5. ROC Curve & AUC\n\nVisualizes the tradeoff between the True Positive Rate and False Positive Rate across different classification thresholds.",
    6: "### 6. Precision-Recall Curve\n\nCrucial for highly imbalanced datasets (like Fraud Detection). It shows the tradeoff between catching every fraudster (Recall) and not flagging innocent people (Precision).",
    7: "### 7. Regression Metrics\n\nFor continuous numbers (like predicting prices).\n* **MAE:** Absolute average error.\n* **MSE:** `1/n * sum((y - y_hat)^2)` (Punishes large errors heavily).",
    8: "### 8. Cross Validation\n\nInstead of splitting the data once, k-Fold Cross Validation splits it 'k' times, training and testing on different chunks to ensure stability.",
    9: "### 9. Bias-Variance Tradeoff\n\nThe ultimate balancing act.\n* **High Bias (Underfitting):** Model is too simple.\n* **High Variance (Overfitting):** Model memorizes noise.\n* **Optimal:** Just right.",
    10: "### 10. Hyperparameter Tuning\n\nUsing techniques like Grid Search and Random Search to systematically test different model settings to find the optimal configuration.",
    11: "### 11. Learning Curves\n\nPlotting training and validation error over time (or dataset size) to visually diagnose if a model is underfitting or overfitting.",
    12: "### 12. Evaluation in Real Systems\n\nIn production, we use A/B Testing and continuous monitoring to ensure the model's performance doesn't drift over time as real-world data changes."
};

// --- NATIVE 3D SCENE COMPONENTS ---

const TrainTestSplitScene = ({ splitRatio }: { splitRatio: number }) => {
    // A 10x10 Grid representing 100 data points
    const points = useMemo(() => {
        const arr = [];
        let count = 0;
        for (let z = 0; z < 10; z++) {
            for (let x = 0; x < 10; x++) {
                count++;
                const isTrain = count <= splitRatio;
                arr.push({
                    pos: [(x - 4.5) * 0.6, isTrain ? 0.5 : -1, (z - 4.5) * 0.6],
                    color: isTrain ? "#3b82f6" : "#f97316" // Blue for Train, Orange for Test
                });
            }
        }
        return arr;
    }, [splitRatio]);

    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (groupRef.current) groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    });

    return (
        <group ref={groupRef} position={[0, -5, 0]}>
            {points.map((p, i) => (
                <mesh key={i} position={new THREE.Vector3(...p.pos)}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} />
                </mesh>
            ))}
            <Html position={[0, -2, 0]} center>
                <div className="flex gap-4 font-mono font-bold text-xs bg-black/80 px-4 py-2 rounded-full border border-white/20">
                    <span className="text-blue-400">Train: {splitRatio}%</span>
                    <span className="text-orange-400">Test: {100 - splitRatio}%</span>
                </div>
            </Html>
        </group>
    );
};

const ConfusionMatrixScene = () => {
    // 2x2 grid of boxes
    return (
        <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
            <Float speed={2} floatIntensity={0.2} rotationIntensity={0.1}>
                {/* True Positives (Green) */}
                <mesh position={[-1, 1, 0]}>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.4} />
                    <Html position={[0, 0, 0]} center>
                        <div className="text-white font-bold text-center">TP<br /><span className="text-xs opacity-70">Correct Yes</span></div>
                    </Html>
                </mesh>

                {/* False Positives (Red) */}
                <mesh position={[1, 1, 0]}>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
                    <Html position={[0, 0, 0]} center>
                        <div className="text-white font-bold text-center">FP<br /><span className="text-xs opacity-70">Type I Error</span></div>
                    </Html>
                </mesh>

                {/* False Negatives (Orange) */}
                <mesh position={[-1, -1, 0]}>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.4} />
                    <Html position={[0, 0, 0]} center>
                        <div className="text-white font-bold text-center">FN<br /><span className="text-xs opacity-70">Type II Error</span></div>
                    </Html>
                </mesh>

                {/* True Negatives (Blue) */}
                <mesh position={[1, -1, 0]}>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
                    <Html position={[0, 0, 0]} center>
                        <div className="text-white font-bold text-center">TN<br /><span className="text-xs opacity-70">Correct No</span></div>
                    </Html>
                </mesh>
            </Float>
        </group>
    );
};

const ThresholdScene = ({ threshold }: { threshold: number }) => {
    // Random sorted points on X axis
    const points = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => {
            const val = i; // 0 to 39
            const isActualPositive = val > 20 || (val > 15 && Math.random() > 0.5);
            return {
                x: (val - 20) * 0.2, // -4 to +4
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2,
                color: isActualPositive ? "#22c55e" : "#ef4444" // Green=Actual +, Red=Actual -
            }
        });
    }, []);

    const planeRef = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (planeRef.current) {
            // map threshold 1-99 to x-pos -4 to 4
            const targetX = ((threshold / 100) * 8) - 4;
            planeRef.current.position.x = THREE.MathUtils.lerp(planeRef.current.position.x, targetX, 0.1);
        }
    });

    return (
        <group>
            {/* The Classification Plane */}
            <mesh ref={planeRef} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[5, 5]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={0.4} side={2} />
            </mesh>

            <Html position={[0, -3, 0]} center>
                <div className="flex gap-8 font-mono text-xs bg-black/80 px-4 py-2 rounded border border-white/20">
                    <span className="text-white">Predicted Negatives &lt;</span>
                    <span className="text-purple-400 font-bold border-b border-purple-500">Threshold</span>
                    <span className="text-white">&gt; Predicted Positives</span>
                </div>
            </Html>

            {/* Data Points */}
            {points.map((p, i) => (
                <mesh key={i} position={[p.x, p.y, p.z]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.4} />
                </mesh>
            ))}
        </group>
    );
};

const BiasVarianceScene = ({ complexity }: { complexity: number }) => {
    // Base noisy sine wave data points
    const points = useMemo(() => {
        const arr = [];
        for (let x = -4; x <= 4; x += 0.4) {
            const y = Math.sin(x) + (Math.random() - 0.5) * 1.5;
            arr.push(new THREE.Vector3(x, y, 0));
        }
        return arr;
    }, []);

    // generating the line based on complexity
    const linePoints = useMemo(() => {
        const arr = [];
        if (complexity === 1) {
            // Underfit (straight line)
            arr.push(new THREE.Vector3(-4, -0.5, 0), new THREE.Vector3(4, 0.5, 0));
        } else if (complexity === 2) {
            // Optimal (smooth sine)
            for (let x = -4; x <= 4; x += 0.1) arr.push(new THREE.Vector3(x, Math.sin(x), 0));
        } else {
            // Overfit (jagged connects every dot exactly plus noise)
            points.forEach(p => {
                arr.push(new THREE.Vector3(p.x, p.y + 0.1, 0)); // touch exactly
            });
        }
        return arr;
    }, [complexity, points]);

    return (
        <group>
            {/* Grid */}
            <gridHelper args={[10, 10, '#334155', '#1e293b']} rotation={[Math.PI / 2, 0, 0]} />

            {/* Data Points */}
            {points.map((p, i) => (
                <mesh key={i} position={p}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="#94a3b8" />
                </mesh>
            ))}

            {/* Model Prediction Line */}
            <Line points={linePoints} color={complexity === 2 ? "#22c55e" : (complexity === 1 ? "#3b82f6" : "#ef4444")} lineWidth={5} />

            <Html position={[0, -3.5, 0]} center>
                <div className={`font-mono text-sm font-bold px-4 py-2 rounded-full border bg-black/80 ${complexity === 1 ? 'text-blue-400 border-blue-500' : (complexity === 2 ? 'text-green-400 border-green-500' : 'text-red-400 border-red-500')}`}>
                    {complexity === 1 ? "Underfitting (High Bias)" : (complexity === 2 ? "Optimal Balance" : "Overfitting (High Variance)")}
                </div>
            </Html>
        </group>
    );
};

const BarChartScene = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    });

    return (
        <group ref={groupRef} position={[0, -1, 0]}>
            <mesh position={[-2, 1, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 2, 0]}>
                <boxGeometry args={[1, 4, 1]} />
                <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[2, 1.5, 0]}>
                <boxGeometry args={[1, 3, 1]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.4} />
            </mesh>

            <gridHelper args={[10, 10, '#334155', '#1e293b']} position={[0, 0, 0]} />
        </group>
    );
};

// --- MAIN COMPONENT ---

export default function ModelEvalMasterclassContent() {
    const [activePhase, setActivePhase] = useState(1);

    // Phase specific states
    const [splitRatio, setSplitRatio] = useState(80);
    const [threshold, setThreshold] = useState(50);
    const [complexity, setComplexity] = useState(2);

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
                    prompt: `You are an AI Tutor for Machine Learning Model Evaluation. The student is currently studying: "${phases[activePhase - 1].title}". Their question is: "${userQuestion}". Explain the concepts using standard markdown without KaTeX math formatting. Keep it informative and explain the underlying reasoning.`
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
        <div className="flex h-screen bg-[#050302] text-gray-200 font-sans overflow-hidden">

            {/* Pane 1: Sidebar (20%) */}
            <div className="w-[20%] border-r border-orange-900/40 bg-[#0A0502] p-6 flex flex-col overflow-y-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                </Link>
                <h2 className="text-sm font-bold tracking-widest text-[#f97316] mb-6 uppercase leading-tight flex items-center gap-2">
                    <Target className="w-4 h-4" /> Evaluation Metrics
                </h2>
                <div className="space-y-2">
                    {phases.map((phase) => {
                        const isActive = activePhase === phase.id;
                        return (
                            <button
                                key={phase.id}
                                onClick={() => setActivePhase(phase.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${isActive
                                        ? "bg-orange-900/50 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] text-white"
                                        : "hover:bg-orange-900/20 text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-[#f97316] text-black" : "bg-gray-800"}`}>
                                    {phase.id}
                                </div>
                                <span className="text-sm font-medium leading-tight truncate">{phase.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pane 2: Theory & 2D Controls (40%) */}
            <div className="w-[40%] flex flex-col border-r border-orange-900/40 overflow-y-auto bg-gradient-to-b from-[#0F0703] to-[#050302]">
                <div className="p-10 flex-grow">
                    <span className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-4 block">Evaluation Phase {activePhase} / 12</span>

                    <div className="prose prose-invert prose-orange max-w-none text-sm/relaxed mb-10">
                        <ReactMarkdown>{phaseContent[activePhase]}</ReactMarkdown>
                    </div>

                    {/* 2D Interactive Controls */}
                    <div className="bg-[#0A0502] border border-orange-900/50 rounded-2xl p-6 mb-8 shadow-inner relative overflow-hidden">
                        <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">Metrics Terminal</h3>

                        {activePhase === 2 ? (
                            <div className="space-y-4">
                                <label className="text-sm text-orange-400 font-mono block font-bold">Train Ratio: {splitRatio}% | Test Ratio: {100 - splitRatio}%</label>
                                <input
                                    type="range"
                                    min="50" max="90" step="10"
                                    value={splitRatio}
                                    onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
                                    className="w-full accent-orange-500"
                                />
                            </div>
                        ) : (activePhase === 4 || activePhase === 5) ? (
                            <div className="space-y-4">
                                <label className="text-sm text-orange-400 font-mono block font-bold">Decision Threshold: {(threshold / 100).toFixed(2)}</label>
                                <input
                                    type="range"
                                    min="1" max="99" step="1"
                                    value={threshold}
                                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                    className="w-full accent-orange-500"
                                />
                            </div>
                        ) : activePhase === 9 ? (
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-mono text-orange-400 font-bold mb-2">
                                    <span>Underfit (1)</span>
                                    <span>Optimal (2)</span>
                                    <span>Overfit (3)</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="3" step="1"
                                    value={complexity}
                                    onChange={(e) => setComplexity(parseFloat(e.target.value))}
                                    className="w-full accent-orange-500"
                                />
                            </div>
                        ) : (
                            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono p-3 rounded flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                Evaluation Engine Active
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Tutor Chat */}
                <div className="p-8 bg-[#050302] border-t border-orange-900/40">
                    <div className="flex items-center gap-2 mb-4 text-[#f97316] font-semibold text-sm">
                        <Sparkles size={16} /> Ask Your AI Tutor
                    </div>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder={`Ask about ${phases[activePhase - 1].title}...`}
                            className="flex-1 bg-[#0A0502] border border-orange-900/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-white placeholder-gray-600 transition-colors"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAskAI(); }}
                        />
                        <button
                            onClick={handleAskAI}
                            disabled={isGenerating || !userQuestion.trim()}
                            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                        >
                            Ask
                        </button>
                    </div>
                    {isGenerating && (
                        <div className="text-orange-400 text-sm font-mono animate-pulse">Evaluating metrics...</div>
                    )}
                    {aiResponse && !isGenerating && (
                        <div className="bg-orange-900/20 border border-orange-500/20 p-5 rounded-xl text-sm/relaxed text-gray-300 prose prose-invert prose-orange">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-[40%] relative bg-[#020101]">
                <div className="absolute top-6 right-6 z-10 bg-black/60 border border-orange-500/30 px-3 py-1.5 rounded-full text-[10px] font-mono text-orange-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-[ping_1.5s_ease-in-out_infinite]"></div>
                    METRICS VISUALIZER
                </div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-orange-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full"></div>
                </div>

                <Canvas camera={{ position: [5, 4, 7], fov: 45 }}>
                    <color attach="background" args={["#020101"]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />
                    <OrbitControls enableZoom={true} />

                    {activePhase === 2 && <TrainTestSplitScene splitRatio={splitRatio} />}
                    {activePhase === 4 && <ConfusionMatrixScene />}
                    {activePhase === 5 && <ThresholdScene threshold={threshold} />}
                    {activePhase === 9 && <BiasVarianceScene complexity={complexity} />}

                    {![2, 4, 5, 9].includes(activePhase) && <BarChartScene />}

                </Canvas>
            </div>

        </div>
    );
}
