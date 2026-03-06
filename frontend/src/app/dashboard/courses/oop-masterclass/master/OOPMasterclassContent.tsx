"use client";

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cone, Html, Line } from '@react-three/drei';
import ReactMarkdown from 'react-markdown';
import { Shield, ShieldOff, Cpu, Box as BoxIcon, Sparkles } from 'lucide-react';

// --- 3D SCENE COMPONENTS ---

const Phase1Scene = ({ isInstantiated }: { isInstantiated: boolean }) => {
    const meshRef = useRef<any>(null);
    useFrame(() => {
        if (meshRef.current) meshRef.current.rotation.y += 0.01;
    });

    return (
        <group>
            <Box ref={meshRef} args={[2, 2, 2]}>
                <meshStandardMaterial
                    color={isInstantiated ? "#a855f7" : "#4ade80"}
                    wireframe={!isInstantiated}
                    transparent={!isInstantiated}
                    opacity={isInstantiated ? 1 : 0.5}
                    metalness={isInstantiated ? 0.8 : 0}
                    roughness={0.2}
                />
            </Box>
            <Html position={[0, 1.5, 0]} center>
                <div className="bg-black/80 text-xs font-mono text-purple-400 px-2 py-1 rounded border border-purple-500/50">
                    {isInstantiated ? "Object: Memory Allocated" : "Class Blueprint"}
                </div>
            </Html>
        </group>
    );
};

const Phase2Scene = ({ shieldActive }: { shieldActive: boolean }) => {
    return (
        <group>
            {/* Inner Data Core */}
            <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="#f43f5e" />
            </Box>
            {/* Encapsulation Shield */}
            {shieldActive && (
                <Sphere args={[1.5, 32, 32]}>
                    <meshStandardMaterial
                        color="#22d3ee"
                        transparent
                        opacity={0.3}
                        roughness={0}
                        metalness={1}
                    />
                </Sphere>
            )}
            <Html position={[0, 2, 0]} center>
                <div className="bg-black/80 text-xs font-mono text-cyan-400 px-2 py-1 rounded border border-cyan-500/50">
                    self.__balance
                </div>
            </Html>
        </group>
    );
};

const Phase3Scene = ({ inheritedTraits }: { inheritedTraits: number }) => {
    const childScale = 0.5 + (inheritedTraits * 0.2);
    const colors = ["#4b5563", "#3b82f6", "#8b5cf6", "#ec4899"];
    const childColor = colors[inheritedTraits];

    return (
        <group>
            {/* Parent Class */}
            <Sphere position={[0, 2, 0]} args={[1, 32, 32]}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </Sphere>

            {/* Connecting Line */}
            <Line points={[[0, 1, 0], [0, -1, 0]]} color="#6b7280" lineWidth={2} />

            {/* Child Class */}
            <Sphere position={[0, -2, 0]} args={[childScale, 32, 32]}>
                <meshStandardMaterial color={childColor} />
            </Sphere>

            <Html position={[1.5, 2, 0]}>
                <div className="text-white text-xs font-mono">MLModel (Parent)</div>
            </Html>
            <Html position={[1.5, -2, 0]}>
                <div className="text-white text-xs font-mono">NeuralNet (Child)</div>
            </Html>
        </group>
    );
};

const Phase4Scene = ({ polyAction }: { polyAction: string }) => {
    const boxRef = useRef<any>(null);
    const sphereRef = useRef<any>(null);
    const coneRef = useRef<any>(null);

    useFrame((state) => {
        if (polyAction === "tree" && boxRef.current) {
            boxRef.current.rotation.x += 0.05;
            boxRef.current.rotation.y += 0.05;
        }
        if (polyAction === "net" && sphereRef.current) {
            sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.5;
        }
        if (polyAction === "svm" && coneRef.current) {
            coneRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.2);
        }
    });

    return (
        <group>
            <Box ref={boxRef} position={[-2, 0, 0]} args={[1, 1, 1]}>
                <meshStandardMaterial color="#22c55e" />
            </Box>
            <Sphere ref={sphereRef} position={[0, 0, 0]} args={[0.7, 32, 32]}>
                <meshStandardMaterial color="#3b82f6" />
            </Sphere>
            <Cone ref={coneRef} position={[2, 0, 0]} args={[0.7, 1.5, 32]}>
                <meshStandardMaterial color="#eab308" />
            </Cone>
        </group>
    );
};

// --- MAIN COMPONENT ---

export default function OOPMasterclassContent() {
    const [activePhase, setActivePhase] = useState(1);
    const [isInstantiated, setIsInstantiated] = useState(false);
    const [shieldActive, setShieldActive] = useState(true);
    const [inheritedTraits, setInheritedTraits] = useState(0);
    const [polyAction, setPolyAction] = useState("idle");

    const [userQuestion, setUserQuestion] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const phaseContent: Record<number, string> = {
        1: "### 1. Classes & Objects\n\nA **Class** is a blueprint. An **Object** is the actual thing built from that blueprint. In ML, a `RandomForestClassifier` is the class. When you assign it to `model = RandomForestClassifier()`, you instantiate an actual object into memory.\n\n```python\nclass Robot:\n    def __init__(self, name):\n        self.name = name\n\nmy_bot = Robot(\"Alpha\") # Instantiation\n```",
        2: "### 2. Encapsulation\n\nEncapsulation bundles data and methods together, and restricts outside access to prevent bugs. Think of it as putting a protective shield around your object's internal state.\n\n```python\nclass BankAccount:\n    def __init__(self):\n        self.__balance = 0  # Private variable (shielded)\n```",
        3: "### 3. Inheritance\n\nClasses can inherit properties and methods from parent classes. This creates a hierarchy and allows massive code reuse.\n\n```python\nclass MLModel: # Parent\n    def train(self): pass\n\nclass NeuralNet(MLModel): # Child\n    def backpropagate(self): pass\n```",
        4: "### 4. Polymorphism\n\nPolymorphism means 'many forms'. It allows different child classes to share the same method name, but execute it differently. \n\n```python\n# Both models have a predict() method, but do different math!\ntree.predict(data)\nneural_net.predict(data)\n```"
    };

    const phases = [
        { id: 1, title: "Classes & Objects" },
        { id: 2, title: "Encapsulation" },
        { id: 3, title: "Inheritance" },
        { id: 4, title: "Polymorphism" }
    ];

    const handleAskAI = () => {
        if (!userQuestion) return;
        setIsGenerating(true);
        setAiResponse("Let me analyze that concept for you...");
        setTimeout(() => {
            setAiResponse(`Based on Phase ${activePhase}, here is your answer: This is a simulated AI response. Hook up your Gemini API here!`);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="flex h-screen bg-[#0a0510] text-gray-200 font-sans overflow-hidden">

            {/* Pane 1: Sidebar (20%) */}
            <div className="w-1/5 border-r border-purple-900/30 bg-[#130b20] p-6 flex flex-col">
                <h2 className="text-sm font-bold tracking-widest text-purple-400 mb-8 uppercase">OOP Masterclass</h2>
                <div className="space-y-4">
                    {phases.map((phase) => (
                        <button
                            key={phase.id}
                            onClick={() => setActivePhase(phase.id)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${activePhase === phase.id
                                    ? "bg-purple-900/40 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white"
                                    : "hover:bg-purple-900/20 text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activePhase === phase.id ? "bg-purple-500 text-white" : "bg-gray-800"}`}>
                                {phase.id}
                            </div>
                            {phase.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pane 2: Theory & 2D Controls (40%) */}
            <div className="w-2/5 flex flex-col border-r border-purple-900/30 overflow-y-auto">
                <div className="p-8 flex-grow">
                    <div className="prose prose-invert prose-purple max-w-none text-sm/relaxed mb-8">
                        <ReactMarkdown>{phaseContent[activePhase]}</ReactMarkdown>
                    </div>

                    {/* 2D Interactive Controls */}
                    <div className="bg-[#1a0f2e] border border-purple-900/50 rounded-2xl p-6 mb-8">
                        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Python Engine Controls</h3>

                        {activePhase === 1 && (
                            <button
                                onClick={() => setIsInstantiated(!isInstantiated)}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <BoxIcon size={16} />
                                {isInstantiated ? "del model" : "model = RandomForest()"}
                            </button>
                        )}

                        {activePhase === 2 && (
                            <button
                                onClick={() => setShieldActive(!shieldActive)}
                                className={`w-full p-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-colors ${shieldActive ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`}
                            >
                                {shieldActive ? <Shield size={16} /> : <ShieldOff size={16} />}
                                {shieldActive ? "Shield Active: __balance" : "Shield Disabled: balance"}
                            </button>
                        )}

                        {activePhase === 3 && (
                            <button
                                onClick={() => setInheritedTraits(prev => prev < 3 ? prev + 1 : 0)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <Cpu size={16} />
                                super().inherit_trait({inheritedTraits + 1})
                            </button>
                        )}

                        {activePhase === 4 && (
                            <div className="flex gap-2">
                                <button onClick={() => setPolyAction("tree")} className="flex-1 bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg font-mono text-xs">tree.predict()</button>
                                <button onClick={() => setPolyAction("net")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg font-mono text-xs">net.predict()</button>
                                <button onClick={() => setPolyAction("svm")} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white p-2 rounded-lg font-mono text-xs">svm.predict()</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Tutor Chat */}
                <div className="p-6 bg-[#130b20] border-t border-purple-900/30">
                    <div className="flex items-center gap-2 mb-4 text-purple-400 font-semibold text-sm">
                        <Sparkles size={16} /> Ask Your AI Tutor
                    </div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder={`Ask a question about Phase ${activePhase}...`}
                            className="flex-1 bg-[#0a0510] border border-purple-900/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                        />
                        <button
                            onClick={handleAskAI}
                            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                        >
                            Ask
                        </button>
                    </div>
                    {aiResponse && (
                        <div className="bg-purple-900/20 border border-purple-500/20 p-4 rounded-lg text-sm text-gray-300">
                            {aiResponse}
                        </div>
                    )}
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-2/5 relative">
                <div className="absolute top-6 right-6 z-10 bg-black/60 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-mono text-purple-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    MEMORY VISUALIZER ACTIVE
                </div>
                <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <OrbitControls enableZoom={true} />

                    {activePhase === 1 && <Phase1Scene isInstantiated={isInstantiated} />}
                    {activePhase === 2 && <Phase2Scene shieldActive={shieldActive} />}
                    {activePhase === 3 && <Phase3Scene inheritedTraits={inheritedTraits} />}
                    {activePhase === 4 && <Phase4Scene polyAction={polyAction} />}

                    <gridHelper args={[20, 20, '#444', '#222']} position={[0, -3, 0]} />
                </Canvas>
            </div>

        </div>
    );
}
