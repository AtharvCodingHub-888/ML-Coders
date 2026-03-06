"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Line, Html, Float } from '@react-three/drei';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ChevronLeft, Activity } from 'lucide-react';
import Link from 'next/link';
import * as THREE from 'three';

const phases = [
    { id: 1, title: "Intro to Neural Networks" },
    { id: 2, title: "Perceptron Model" },
    { id: 3, title: "Activation Functions" },
    { id: 4, title: "Network Architecture" },
    { id: 5, title: "Forward Propagation" },
    { id: 6, title: "Loss Functions" },
    { id: 7, title: "Gradient Descent" },
    { id: 8, title: "Backpropagation" },
    { id: 9, title: "Optimization Algorithms" },
    { id: 10, title: "Regularization" },
    { id: 11, title: "Training Pipeline" },
    { id: 12, title: "Implementation Workflow" }
];

const phaseContent: Record<number, string> = {
    1: "### 1. Introduction to Neural Networks\n\nBiological inspiration translated to math. A neural network learns a complex nonlinear mapping from input features to a target variable.\n\n**Key Idea:**\nA neural network learns a function `y = f(x)`.\n\n**Example uses:** Image recognition, speech recognition, language models.",
    2: "### 2. Perceptron Model\n\nThe fundamental building block: A single neuron model. It computes a weighted sum and applies a step function to create a linear decision boundary.\n\n**Equation:**\n`y = w1*x1 + w2*x2 + b`\n\n**Limitations:** Cannot solve nonlinear problems (e.g., XOR) alone.",
    3: "### 3. Activation Functions\n\nActivations introduce nonlinearity so networks can learn complex, curved patterns instead of just straight lines.\n\n**Common Activations:**\n* **Sigmoid:** Squashes between 0 and 1 (good for probability)\n* **Tanh:** Squashes between -1 and 1\n* **ReLU:** Returns `max(0, x)` (solves vanishing gradient)\n* **Softmax:** Turns a vector of values into probabilities that sum to 1.",
    4: "### 4. Neural Network Architecture\n\nLayering perceptrons together creates a **Multilayer Perceptron (MLP)**.\n\n**Structure:**\n1. **Input Layer:** Raw data features.\n2. **Hidden Layers:** Where the magic happens. Depth (layers) vs Width (neurons).\n3. **Output Layer:** Final prediction/classification.",
    5: "### 5. Forward Propagation\n\nThe process of pushing data through the network to generate a prediction.\n\n**Layer-by-Layer Computation:**\n`z = W*x + b` (Weighted sum)\n`a = f(z)` (Activation application)\n\nData moves strictly forward: Input -> Hidden -> Output.",
    6: "### 6. Loss Functions\n\nHow wrong was the prediction? The loss function measures the difference between our prediction and the true value.\n\n**Common Losses:**\n* **Mean Squared Error (MSE):** For regression.\n* **Cross Entropy:** For classification. Punishes confident wrong answers heavily.\n\n**Goal:** Minimize this number.",
    7: "### 7. Gradient Descent\n\nThe optimization strategy. Imagine standing on a foggy mountain (the loss landscape) and taking steps downhill until you reach the valley (minimum loss).\n\n**Update Rule:**\n`w = w - learning_rate * gradient(Loss)`",
    8: "### 8. Backpropagation Algorithm\n\n*The core of deep learning.* We calculate how much each weight contributed to the error, and pass that blame backward through the network using the Chain Rule of Calculus.\n\n`Error -> Output Layer -> Hidden Layers -> Input Layer`",
    9: "### 9. Optimization Algorithms\n\nVanilla gradient descent is slow. Modern deep learning uses smarter hill-climbing.\n\n* **SGD:** Takes small, erratic steps.\n* **Momentum:** Builds up speed in consistent directions.\n* **Adam:** The industry standard. Adapts the learning rate for every single weight individually.",
    10: "### 10. Regularization Techniques\n\nA massive network can memorize the training data (Overfitting) and fail in the real world. We force it to generalize.\n\n**Techniques:**\n* **L1/L2 Regularization:** Punishes massive weights.\n* **Dropout:** Randomly turn off neurons during training so they don't form cliques.\n* **Early Stopping:** Stop training when validation loss rises.",
    11: "### 11. Neural Network Training Pipeline\n\nThe full lifecycle required to train a deep learning model.\n\n1. Initialize random weights.\n2. **Forward prop:** Predict.\n3. **Compute Loss:** Check error.\n4. **Backprop:** Find gradients.\n5. **Update weights** (Optimizer).\n6. Repeat for `N` epochs.",
    12: "### 12. Practical Implementation\n\nNobody writes backprop by hand anymore. We use frameworks that handle the math via Autograd (Automatic Differentiation).\n\n**Libraries:**\n* **PyTorch** (Industry/Research standard)\n* **TensorFlow / Keras**\n\nThe real work is data engineering and hyperparameter tuning."
};

// --- 3D SCENE COMPONENTS ---

const NetworkBase = ({
    forwardColor = "#334155",
    backwardColor = "#334155",
    nodeColor = "#cbd5e1",
    activeLayer = -1,
    showDropout = false
}) => {
    const layers = [3, 5, 5, 2];
    const spacingX = 3;
    const spacingY = 1.2;

    const nodes: any[] = [];
    const links: any[] = [];

    let startX = -(layers.length - 1) * spacingX / 2;

    layers.forEach((count, lIdx) => {
        let startY = -(count - 1) * spacingY / 2;
        for (let pos = 0; pos < count; pos++) {
            // Dropout logic: random chance to drop node if not input/output and dropout is active
            const isDropped = showDropout && lIdx > 0 && lIdx < layers.length - 1 && Math.random() > 0.6;
            nodes.push({ layer: lIdx, id: `${lIdx}-${pos}`, x: startX, y: startY + pos * spacingY, z: 0, dropped: isDropped });
        }
        startX += spacingX;
    });

    // Create connections
    for (let i = 0; i < layers.length - 1; i++) {
        const layer1Nodes = nodes.filter(n => n.layer === i);
        const layer2Nodes = nodes.filter(n => n.layer === i + 1);

        layer1Nodes.forEach(n1 => {
            layer2Nodes.forEach(n2 => {
                if (!n1.dropped && !n2.dropped) {
                    links.push({ start: [n1.x, n1.y, 0], end: [n2.x, n2.y, 0] });
                }
            });
        });
    }

    return (
        <group>
            {links.map((link, i) => (
                <Line
                    key={`link-${i}`}
                    points={[new THREE.Vector3(...link.start), new THREE.Vector3(...link.end)]}
                    color={activeLayer === 5 ? forwardColor : (activeLayer === 8 ? backwardColor : "#334155")}
                    lineWidth={1}
                    transparent opacity={activeLayer === 5 || activeLayer === 8 ? 0.3 : 0.15}
                />
            ))}

            {nodes.map((node, i) => {
                const isActive = activeLayer === node.layer;
                const isFired = activeLayer === 5 || activeLayer === 8;

                return (
                    <Sphere key={`node-${i}`} position={[node.x, node.y, node.z]} args={[0.25, 16, 16]}>
                        <meshStandardMaterial
                            color={node.dropped ? "#1e293b" : (isActive ? "#eab308" : nodeColor)}
                            emissive={node.dropped ? "#000000" : (isActive ? "#eab308" : (isFired ? nodeColor : "#000000"))}
                            emissiveIntensity={isActive ? 1 : (isFired ? 0.5 : 0)}
                            transparent={node.dropped}
                            opacity={node.dropped ? 0.2 : 1}
                        />
                    </Sphere>
                )
            })}
        </group>
    );
};

const ForwardBackpropAnimation = ({ isBackprop }: { isBackprop: boolean }) => {
    const pulseRef = useRef<THREE.Group>(null);
    const pulsePositions = isBackprop ? [4.5, 1.5, -1.5, -4.5] : [-4.5, -1.5, 1.5, 4.5];
    const color = isBackprop ? "#ef4444" : "#22c55e"; // Red error vs Green activations

    useFrame((state) => {
        if (pulseRef.current) {
            const time = state.clock.elapsedTime * 2;
            const currentIdx = Math.floor(time) % 4;
            pulseRef.current.position.x = THREE.MathUtils.lerp(
                pulseRef.current.position.x,
                pulsePositions[currentIdx],
                0.2
            );
        }
    });

    return (
        <group>
            <NetworkBase activeLayer={isBackprop ? 8 : 5} />
            <group ref={pulseRef} position={[pulsePositions[0], 0, 0]}>
                <Sphere args={[0.5, 32, 32]}>
                    <meshBasicMaterial color={color} transparent opacity={0.4} />
                </Sphere>
                <pointLight color={color} intensity={5} distance={5} />
            </group>
        </group>
    );
};

const ActivationGraph = ({ actType }: { actType: string }) => {
    // Math functions driving the 3D line
    const points = useMemo(() => {
        const pts = [];
        for (let x = -5; x <= 5; x += 0.2) {
            let y = 0;
            switch (actType) {
                case 'relu': y = Math.max(0, x); break;
                case 'sigmoid': y = 1 / (1 + Math.exp(-x)) * 4 - 2; break; // Scaled for visual
                case 'tanh': y = Math.tanh(x) * 3; break;
                default: y = Math.max(0, x);
            }
            pts.push(new THREE.Vector3(x, y, 0));
        }
        return pts;
    }, [actType]);

    return (
        <group>
            <gridHelper args={[10, 10, '#334155', '#1e293b']} rotation={[Math.PI / 2, 0, 0]} />
            <Line points={points} color="#eab308" lineWidth={4} />
            {/* Axis Lines */}
            <Line points={[[-5, 0, 0], [5, 0, 0]]} color="#ffffff" lineWidth={1} />
            <Line points={[[0, -5, 0], [0, 5, 0]]} color="#ffffff" lineWidth={1} />
        </group>
    );
}

const LossLandscape = ({ optimizer }: { optimizer: string }) => {
    // Create a terrain-like mesh
    const planeRef = useRef<any>(null);
    const ballRef = useRef<THREE.Group>(null);
    const trailRef = useRef<any>(null);

    const [trailPoints, setTrailPoints] = useState<THREE.Vector3[]>([]);

    useEffect(() => {
        setTrailPoints([new THREE.Vector3(4, 3, 4)]);
    }, [optimizer]);

    useFrame((state) => {
        if (planeRef.current) {
            const time = state.clock.elapsedTime * 0.5;
            planeRef.current.rotation.y = time * 0.2;
        }

        if (ballRef.current && trailPoints.length < 50) {
            const lastP = trailPoints[trailPoints.length - 1];
            if (!lastP) return; // Guard to prevent reading undefined
            // Simulate gradient descent steps
            const nextX = lastP.x * (optimizer === 'sgd' ? 0.9 : 0.95) + (Math.random() - 0.5) * (optimizer === 'sgd' ? 1.5 : 0.2);
            const nextZ = lastP.z * (optimizer === 'sgd' ? 0.9 : 0.95) + (Math.random() - 0.5) * (optimizer === 'sgd' ? 1.5 : 0.2);
            const nextY = (nextX * nextX + nextZ * nextZ) * 0.05; // Bowl shape

            if (Math.abs(nextX) > 0.1 || Math.abs(nextZ) > 0.1) {
                const newP = new THREE.Vector3(nextX, nextY, nextZ);
                ballRef.current.position.copy(newP);
                setTrailPoints([...trailPoints, newP]);
            }
        }
    });

    return (
        <group ref={planeRef}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[10, 10, 32, 32]} />
                <meshStandardMaterial
                    color="#0f172a"
                    wireframe
                    transparent opacity={0.3}
                    displacementScale={2}
                />
            </mesh>

            {/* The bowl representation purely visual via math */}
            <group>
                {Array.from({ length: 400 }).map((_, i) => {
                    const x = (Math.random() - 0.5) * 10;
                    const z = (Math.random() - 0.5) * 10;
                    const y = (x * x + z * z) * 0.05; // Bowl function
                    return <Sphere key={i} position={[x, y - 0.2, z]} args={[0.05]}><meshBasicMaterial color={y < 0.5 ? "#22c55e" : "#ef4444"} transparent opacity={0.6} /></Sphere>
                })}
            </group>

            <group ref={ballRef} position={[4, 3, 4]}>
                <Sphere args={[0.3, 16, 16]}>
                    <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={1} />
                </Sphere>
                <pointLight color="#fcd34d" intensity={2} distance={5} />
            </group>

            {trailPoints.length > 1 && (
                <Line points={trailPoints} color="#fcd34d" lineWidth={2} transparent opacity={0.8} />
            )}
        </group>
    );
};


// --- MAIN COMPONENT ---

export default function NeuralNetworksContent() {
    const [activePhase, setActivePhase] = useState(1);

    // Phase specific states
    const [activation, setActivation] = useState("relu");
    const [optimizer, setOptimizer] = useState("adam");

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
                    prompt: `You are an AI Tutor for Deep Learning and Neural Networks. The student is currently studying: "${phases[activePhase - 1].title}". Their question is: "${userQuestion}". Explain the concepts using standard markdown without KaTeX math formatting. Keep it informative and explain the underlying mathematics simply if necessary.`
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
            <div className="w-[20%] border-r border-rose-900/30 bg-[#0A0507] p-6 flex flex-col overflow-y-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                </Link>
                <h2 className="text-sm font-bold tracking-widest text-[#f43f5e] mb-6 uppercase leading-tight flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Neural Networks
                </h2>
                <div className="space-y-2">
                    {phases.map((phase) => {
                        const isActive = activePhase === phase.id;
                        return (
                            <button
                                key={phase.id}
                                onClick={() => setActivePhase(phase.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${isActive
                                    ? "bg-rose-900/40 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] text-white"
                                    : "hover:bg-rose-900/20 text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-[#f43f5e] text-white" : "bg-gray-800"}`}>
                                    {phase.id}
                                </div>
                                <span className="text-sm font-medium leading-tight truncate">{phase.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pane 2: Theory & 2D Controls (40%) */}
            <div className="w-[40%] flex flex-col border-r border-rose-900/30 overflow-y-auto bg-gradient-to-b from-[#0F050A] to-[#05050A]">
                <div className="p-10 flex-grow">
                    <span className="text-xs uppercase tracking-widest text-rose-500 font-bold mb-4 block">Module {activePhase} / 12</span>

                    <div className="prose prose-invert prose-rose max-w-none text-sm/relaxed mb-10">
                        <ReactMarkdown>{phaseContent[activePhase]}</ReactMarkdown>
                    </div>

                    {/* 2D Interactive Controls */}
                    <div className="bg-[#0A0507] border border-rose-900/50 rounded-2xl p-6 mb-8 shadow-inner">
                        <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">Network Configuration</h3>

                        {activePhase === 3 ? (
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-mono text-rose-400 block mb-2">Activation Function: {activation.toUpperCase()}</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setActivation('relu')} className={`py-2 rounded text-xs font-bold ${activation === 'relu' ? 'bg-rose-600' : 'bg-rose-900/40 hover:bg-rose-800'}`}>ReLU</button>
                                    <button onClick={() => setActivation('sigmoid')} className={`py-2 rounded text-xs font-bold ${activation === 'sigmoid' ? 'bg-rose-600' : 'bg-rose-900/40 hover:bg-rose-800'}`}>Sigmoid</button>
                                    <button onClick={() => setActivation('tanh')} className={`py-2 rounded text-xs font-bold ${activation === 'tanh' ? 'bg-rose-600' : 'bg-rose-900/40 hover:bg-rose-800'}`}>Tanh</button>
                                </div>
                            </div>
                        ) : (activePhase === 7 || activePhase === 9) ? (
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-mono text-rose-400 block mb-2">Optimizer Protocol: {optimizer.toUpperCase()}</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setOptimizer('adam')} className={`py-2 rounded text-xs font-bold ${optimizer === 'adam' ? 'bg-rose-600' : 'bg-rose-900/40 hover:bg-rose-800'}`}>ADAM (Smooth)</button>
                                    <button onClick={() => setOptimizer('sgd')} className={`py-2 rounded text-xs font-bold ${optimizer === 'sgd' ? 'bg-rose-600' : 'bg-rose-900/40 hover:bg-rose-800'}`}>SGD (Jagged)</button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 hover:text-rose-400 transition-colors cursor-help">Notice how Adam takes a direct, smooth path to the minimum, while SGD bounces erratically.</p>
                            </div>
                        ) : activePhase === 10 ? (
                            <div className="bg-rose-900/30 border border-rose-500/50 text-rose-300 p-4 rounded-xl flex items-center justify-between">
                                <span className="font-mono text-xs">Dropout Layer Active [p=0.4]</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-4 bg-rose-500 animate-pulse"></div>
                                    <div className="w-2 h-4 bg-rose-900"></div>
                                    <div className="w-2 h-4 bg-rose-500 animate-pulse delay-75"></div>
                                    <div className="w-2 h-4 bg-rose-900"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono p-3 rounded flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                                Tensor Graph Active
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Tutor Chat */}
                <div className="p-8 bg-[#05050A] border-t border-rose-900/30">
                    <div className="flex items-center gap-2 mb-4 text-[#f43f5e] font-semibold text-sm">
                        <Sparkles size={16} /> Ask Your AI Tutor
                    </div>
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder={`Ask about ${phases[activePhase - 1].title}...`}
                            className="flex-1 bg-[#0A0507] border border-rose-900/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-rose-500 text-white placeholder-gray-600 transition-colors"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAskAI(); }}
                        />
                        <button
                            onClick={handleAskAI}
                            disabled={isGenerating || !userQuestion.trim()}
                            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        >
                            Ask
                        </button>
                    </div>
                    {isGenerating && (
                        <div className="text-rose-400 text-sm font-mono animate-pulse">Computing backprop gradients...</div>
                    )}
                    {aiResponse && !isGenerating && (
                        <div className="bg-rose-900/20 border border-rose-500/20 p-5 rounded-xl text-sm/relaxed text-gray-300 prose prose-invert prose-rose">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-[40%] relative bg-[#020102]">
                <div className="absolute top-6 right-6 z-10 bg-black/60 border border-rose-500/30 px-3 py-1.5 rounded-full text-[10px] font-mono text-rose-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-[ping_1.5s_ease-in-out_infinite]"></div>
                    COMPUTE GRAPH: LIVE
                </div>

                {/* Glow ambient effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-[20%] -left-[20%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full"></div>
                </div>

                <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                    <color attach="background" args={["#020102"]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />
                    <OrbitControls enableZoom={true} />

                    {(activePhase === 1 || activePhase === 2 || activePhase === 4 || activePhase > 10) && (
                        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                            <NetworkBase showDropout={false} />
                        </Float>
                    )}

                    {activePhase === 3 && <ActivationGraph actType={activation} />}

                    {activePhase === 5 && <ForwardBackpropAnimation isBackprop={false} />}
                    {activePhase === 8 && <ForwardBackpropAnimation isBackprop={true} />}

                    {(activePhase === 6 || activePhase === 7 || activePhase === 9) && <LossLandscape optimizer={optimizer} />}

                    {activePhase === 10 && (
                        <Float speed={1} rotationIntensity={0.1}>
                            <NetworkBase showDropout={true} />
                        </Float>
                    )}

                </Canvas>
            </div>

        </div>
    );
}
