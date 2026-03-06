"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { ChevronLeft, Lock, Loader2, Sparkles, Network } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import * as THREE from "three";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';


const phases = [
    "Foundations",
    "Bayes Theorem",
    "Random Variables",
    "Distributions",
    "Expectation",
    "Covariance",
    "MLE",
    "CLT",
    "Hypothesis",
    "Info Theory"
];

const phaseContent: Record<number, string> = {
    1: "### Foundations of Probability\n\nThe **Sample Space ($\\Omega$)** is the set of all possible outcomes. \n\n**Classical Probability:**\n$$ P(A) = \\frac{\\text{Favorable Outcomes}}{\\text{Total Outcomes}} $$\n\nIn ML, probability helps models quantify uncertainty instead of giving absolute Yes/No answers.",
    2: "### Bayes Theorem\n\nBayes Theorem updates our beliefs based on new evidence. It is the foundation of models like Naive Bayes.\n\n**The Formula:**\n$$ P(A|B) = \\frac{P(B|A)P(A)}{P(B)} $$\n\n* **$P(A)$**: Prior probability\n* **$P(B|A)$**: Likelihood\n* **$P(A|B)$**: Posterior probability",
    3: "### Random Variables\n\nA **Random Variable** maps outcomes to real numbers. \n\n* **Discrete:** Countable values (e.g., Dice roll, Spam/Not Spam).\n* **Continuous:** Infinite spectrum (e.g., House price, exact temperature).",
    4: "### Gaussian Distribution\n\nThe normal distribution forms a symmetrical bell curve defined by Mean ($\\mu$) and Variance ($\\sigma^2$).\n\n$$ f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2} $$",
    5: "### Expectation & Variance\n\n* **Expectation $E[X]$:** The long-run average or mean ($\\mu$).\n* **Variance $Var(X)$:** How much the data spreads out from the mean. $$ Var(X) = E[(X-\\mu)^2] $$",
    6: "### Covariance & Correlation\n\nCovariance and Correlation measure how two variables move together. In Machine Learning, this is crucial for Feature Selection and Dimensionality Reduction (like PCA).\n\n**Covariance:** The direction of the linear relationship.\n$$ Cov(X,Y) = E[(X-\\mu_x)(Y-\\mu_y)] $$\n\n**Correlation ($\\rho$):** The normalized strength of the relationship, scaled strictly between -1 and 1.\n$$ \\rho = \\frac{Cov(X,Y)}{\\sigma_x\\sigma_y} $$",
    7: "### Maximum Likelihood Estimation (MLE)\n\nMLE is fundamentally how Machine Learning models \"learn\" from data. It is an optimization process that finds the parameters ($\\theta$) that make the observed training data most probable.\n\n**The Likelihood Function:**\n$$ L(\\theta | x) = P(x | \\theta) $$\n\n**Log-Likelihood:** In ML, multiplying thousands of tiny probabilities causes computer systems to underflow to zero. To fix this, we maximize the sum of their logarithms instead:\n$$ \\hat{\\theta}_{MLE} = \\arg\\max_{\\theta} \\log L(\\theta | x) $$",
    8: "### Central Limit Theorem (CLT)\n\nThe Central Limit Theorem states that the sum (or average) of a large number of independent random variables will be approximately normally distributed, *regardless* of the original distribution.\n\n$$ \\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right) $$\n\n**Why it matters in ML:** This theorem is the mathematical justification for why the Gaussian (Normal) distribution appears everywhere in nature and algorithms, and it forms the basis for A/B testing.",
    9: "### Hypothesis Testing\n\nA rigorous framework for making statistical decisions using experimental data, heavily used when testing if a new ML model actually beats the baseline.\n\n* **Null Hypothesis ($H_0$):** The default assumption (e.g., \"The new model is no better than the old one\").\n* **Alternative ($H_1$):** What you are trying to prove.\n* **p-value:** The probability of seeing results this extreme if $H_0$ is true. If $p < 0.05$, we reject the null!\n\n$$ Z = \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} $$",
    10: "### Information Theory\n\nInformation theory quantifies uncertainty. It is the core mathematical engine behind modern Deep Learning, Transformers, and Large Language Models (LLMs).\n\n**Entropy ($H$):** Measures the unpredictability of a state.\n$$ H(X) = - \\sum p(x) \\log_2 p(x) $$\n\n**Cross-Entropy Loss:** The standard loss function for classification networks. It measures the difference between two probability distributions (what the model predicts versus the actual ground truth)."
};

// Phase 4 Gaussian Curve Component
function GaussianSurface({ mu, sigma }: { mu: number; sigma: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const geometryRef = useRef<THREE.PlaneGeometry>(null);

    useEffect(() => {
        if (!geometryRef.current) return;
        const positions = geometryRef.current.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = (1 / (2 * Math.PI * sigma * sigma)) *
                Math.exp(-(Math.pow(x - mu, 2) + Math.pow(y, 2)) / (2 * sigma * sigma));
            positions.setZ(i, z * 20);
        }
        geometryRef.current.attributes.position.needsUpdate = true;
        geometryRef.current.computeVertexNormals();
    }, [mu, sigma]);

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry ref={geometryRef} args={[15, 15, 100, 100]} />
            <meshStandardMaterial
                color="#22d3ee"
                emissive="#083344"
                wireframe={true}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
}

// Phase 6 Scatter Plot Component
function ScatterPlot({ correlation }: { correlation: number }) {
    const pointsRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const basePoints = useMemo(() => {
        return Array.from({ length: 150 }).map(() => ({
            u1: (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) * 2,
            u2: (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) * 2,
            z: (Math.random() - 0.5) * 4
        }));
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;

        basePoints.forEach((point, i) => {
            const x = point.u1;
            const y = correlation * x + Math.sqrt(1 - correlation * correlation) * point.u2;

            dummy.position.set(x * 2, y * 2, point.z);
            dummy.updateMatrix();
            pointsRef.current!.setMatrixAt(i, dummy.matrix);
        });
        pointsRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={pointsRef} args={[undefined, undefined, 150]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.5} />
        </instancedMesh>
    );
}

export default function ProbabilityStatisticsMasterclass() {
    const [activePhase, setActivePhase] = useState(1);

    const [prior, setPrior] = useState(0.01);
    const [likelihood, setLikelihood] = useState(0.95);
    const [marginalB, setMarginalB] = useState(0.05);

    const posterior = (likelihood * prior) / Math.max(0.0001, marginalB);

    const [mu, setMu] = useState(0);
    const [sigma, setSigma] = useState(1);
    const [correlation, setCorrelation] = useState(0.8);

    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResponse, setAiResponse] = useState("");
    const [userQuestion, setUserQuestion] = useState("");

    useEffect(() => {
        setAiResponse("");
        setUserQuestion("");
    }, [activePhase]);

    const handleGenerateAi = async () => {
        if (!userQuestion.trim()) return;
        setIsGenerating(true);
        setAiResponse("");
        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `I am a beginner studying Phase ${activePhase} of Probability in Machine Learning. Please answer this specific question: ${userQuestion}`
                })
            });
            const data = await res.json();
            if (data.text) {
                setAiResponse(data.text);
            } else {
                setAiResponse(data.error || "Failed to generate AI response.");
            }
        } catch (error) {
            setAiResponse("Network error: Could not connect to the Gemini API.");
        } finally {
            setIsGenerating(false);
            setUserQuestion("");
        }
    };

    return (
        <div className="h-screen w-full bg-[#05050B] text-white flex overflow-hidden font-sans">

            {/* Pane 1: The 10-Phase Sidebar (20%) */}
            <div className="w-[20%] border-r border-white/10 bg-black/40 p-6 flex flex-col z-20">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium w-fit mb-8">
                    <ChevronLeft className="w-4 h-4" />
                    Dashboard
                </Link>

                <h2 className="text-xl font-extrabold text-white mb-6 tracking-tight">Prob &amp; Stats Path</h2>

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
                                        ? "bg-purple-500/10 border border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.15)]"
                                        : isUnlocked
                                            ? "hover:bg-white/5 text-white/70 border border-transparent"
                                            : "opacity-40 cursor-not-allowed border border-transparent"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                    isActive ? "bg-purple-500/20 text-purple-400" : "bg-white/10"
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
            <div className="w-[40%] h-full overflow-y-auto p-12 flex flex-col justify-between relative bg-gradient-to-br from-[#0a0510] to-[#05050B] z-10 border-r border-white/5">
                <div className="max-w-xl mx-auto w-full flex flex-col gap-10">

                    {/* Header */}
                    <div className="flex flex-col gap-4">
                        <span className="text-xs uppercase tracking-widest text-purple-500 font-bold">Phase {activePhase}</span>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {phases[activePhase - 1]}
                        </h1>
                    </div>

                    {/* Content Switch */}
                    <div className="flex flex-col gap-8 flex-1">

                        <div className="prose prose-invert prose-purple max-w-none mb-8 text-sm/relaxed">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {phaseContent[activePhase] || "### Content coming soon..."}
                            </ReactMarkdown>
                        </div>

                        {activePhase === 2 && (
                            <>
                                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-6 relative mt-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-mono font-bold text-white">{(posterior * 100).toFixed(2)}%</div>
                                        <div className="text-white/40 text-sm mt-1">Posterior Probability</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-cyan-400 font-bold">Prior P(A)</span>
                                            <span className="font-mono text-white/80">{prior.toFixed(3)}</span>
                                        </div>
                                        <input type="range" min="0.001" max="1" step="0.001" value={prior} onChange={(e) => setPrior(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-purple-400 font-bold">Likelihood P(B|A)</span>
                                            <span className="font-mono text-white/80">{likelihood.toFixed(3)}</span>
                                        </div>
                                        <input type="range" min="0.001" max="1" step="0.001" value={likelihood} onChange={(e) => setLikelihood(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-yellow-400 font-bold">Marginal P(B)</span>
                                            <span className="font-mono text-white/80">{marginalB.toFixed(3)}</span>
                                        </div>
                                        <input type="range" min="0.001" max="1" step="0.001" value={marginalB} onChange={(e) => setMarginalB(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                                    </div>
                                </div>
                            </>
                        )}

                        {activePhase === 4 && (
                            <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-cyan-400 font-bold">Mean (μ)</span>
                                        <span className="font-mono text-white/80">{mu.toFixed(2)}</span>
                                    </div>
                                    <input type="range" min="-5" max="5" step="0.1" value={mu} onChange={(e) => setMu(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-400 font-bold">Standard Deviation (σ)</span>
                                        <span className="font-mono text-white/80">{sigma.toFixed(2)}</span>
                                    </div>
                                    <input type="range" min="0.1" max="3" step="0.1" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                </div>
                            </div>
                        )}

                        {activePhase === 6 && (
                            <div className="flex flex-col gap-6 bg-black/20 p-8 rounded-2xl border border-white/5 mt-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-400 font-bold">Correlation (ρ)</span>
                                        <span className="font-mono text-white/80">{correlation.toFixed(2)}</span>
                                    </div>
                                    <input type="range" min="-1" max="1" step="0.01" value={correlation} onChange={(e) => setCorrelation(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Gemini Component Hook */}
                    <div className="mt-8 border border-purple-500/30 bg-purple-900/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent group-hover:from-purple-500/20 transition-all pointer-events-none" />
                        <h3 className="text-white/80 font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            Ask Your AI Tutor
                        </h3>

                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={userQuestion}
                                    onChange={(e) => setUserQuestion(e.target.value)}
                                    placeholder={`Ask a question about Phase ${activePhase}...`}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleGenerateAi();
                                    }}
                                />
                                <button
                                    onClick={handleGenerateAi}
                                    disabled={isGenerating || !userQuestion.trim()}
                                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] text-white"
                                >
                                    Ask
                                </button>
                            </div>

                            {isGenerating && (
                                <div className="w-full p-8 border border-purple-500/30 bg-black/40 rounded-xl flex flex-col items-center justify-center gap-4 mt-2">
                                    <div className="relative">
                                        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                                    </div>
                                    <span className="text-purple-400 font-medium animate-pulse text-sm">Thinking...</span>
                                </div>
                            )}

                            {aiResponse && !isGenerating && (
                                <div className="w-full p-6 bg-black/40 rounded-xl border border-purple-500/30 relative flex flex-col gap-3 mt-2">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-1">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Gemini Response</span>
                                    </div>
                                    <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                                        <div className="prose prose-invert prose-purple max-w-none text-sm/relaxed">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {aiResponse}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pane 3: 3D Canvas (40%) */}
            <div className="w-[40%] h-full sticky top-0 bg-black/60 relative border-l border-white/10">
                <div className="absolute top-6 right-6 z-10 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-mono text-white/60">
                    Interact: Drag to rotate, scroll to zoom
                </div>

                <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

                    <gridHelper args={[20, 20, '#333333', '#111111']} />
                    <axesHelper args={[10]} />

                    {activePhase === 2 && (
                        <group>
                            <mesh position={[-1, 0, 0]}>
                                <sphereGeometry args={[2, 32, 32]} />
                                <meshPhysicalMaterial color="#22d3ee" transparent opacity={0.4} transmission={0.5} roughness={0.1} />
                            </mesh>
                            <mesh position={[1, 0, 0]}>
                                <sphereGeometry args={[2, 32, 32]} />
                                <meshPhysicalMaterial color="#c084fc" transparent opacity={0.4} transmission={0.5} roughness={0.1} />
                            </mesh>

                            <Html position={[0, -2.5, 0]} center>
                                <div className="text-white/60 font-serif text-sm px-2 py-1 bg-black/50 rounded-lg whitespace-nowrap">
                                    P(A &cap; B)
                                </div>
                            </Html>
                        </group>
                    )}

                    {activePhase === 4 && (
                        <GaussianSurface mu={mu} sigma={sigma} />
                    )}

                    {activePhase === 6 && (
                        <ScatterPlot correlation={correlation} />
                    )}

                    {![2, 4, 6].includes(activePhase) && (
                        <Html center>
                            <div className="text-white/40 font-mono text-sm whitespace-nowrap bg-black/80 px-4 py-2 rounded-xl border border-white/10">
                                3D Visualization Placeholder
                            </div>
                        </Html>
                    )}
                </Canvas>
            </div>
        </div>
    );
}
