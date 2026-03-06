import React, { useState, useEffect } from 'react';
import { Html, Sphere, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { CHALLENGES } from '../../data/challenges';
import progressService from '../../services/progressService';
import TheoryOverlay from '../../components/TheoryOverlay';

const STAGES = { GAME: 'GAME', PYTHON: 'PYTHON', ML: 'ML', XP_AWARD: 'XP_AWARD' };

const Neuron = ({ position, type, isActive, label, value }) => {
    const color = type === 'input' ? '#00ffff' : type === 'hidden' ? '#ff00ff' : '#00ffaa';

    return (
        <motion.group
            position={position}
            initial={{ scale: 0 }}
            animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
            }}
            transition={{
                scale: { repeat: isActive ? Infinity : 0, duration: 1.5 }
            }}
        >
            <Sphere args={[0.3, 32, 32]}>
                <meshStandardMaterial
                    color={isActive ? color : '#222'}
                    emissive={color}
                    emissiveIntensity={isActive ? 1.5 : 0.2}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
            <Html distanceFactor={8} position={[0, -0.6, 0]} center>
                <div style={{ color: isActive ? color : '#555', fontFamily: 'monospace', fontSize: '10px', whiteSpace: 'nowrap', textShadow: isActive ? `0 0 5px ${color}` : 'none' }}>
                    {label}
                </div>
                {value !== undefined && <div style={{ color: '#fff', fontSize: '9px', marginTop: '2px', opacity: isActive ? 1 : 0.5 }}>{value.toFixed(2)}</div>}
            </Html>
        </motion.group>
    );
};

const Synapse = ({ start, end, strength, isActive }) => {
    const color = strength > 0.5 ? '#00ffff' : '#ff00ff';
    const opacity = Math.max(0.2, Math.min(Math.abs(strength) * 0.8, 0.9));

    return (
        <Line
            points={[new THREE.Vector3(...start), new THREE.Vector3(...end)]}
            color={color}
            lineWidth={isActive ? 3 : 1}
            transparent
            opacity={isActive ? 1 : opacity}
        />
    );
};

const NeuralNetworks = ({ onComplete, onAriaUpdate }) => {
    const [stage, setStage] = useState(STAGES.GAME);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [weights, setWeights] = useState([0.5, 0.5, 0.5, 0.5]); // 4 weights: W1, W2 (to H1) and W3, W4 (H1 to O1, O2)
    const [bias, setBias] = useState(0.1);
    const [xpEarned, setXpEarned] = useState(0);
    const [streak, setStreak] = useState(0);
    const [failures, setFailures] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shake, setShake] = useState(0);
    const [startTime] = useState(Date.now());

    const challenges = CHALLENGES.neural_networks;
    const currentChallenge = challenges[challengeIndex];
    if (!currentChallenge) return null;

    const { inputs, target, intro, hint } = currentChallenge;

    // 2-1-2 Architecture Forward Pass
    // Layer 1: Inputs to Hidden
    const hiddenSum = inputs[0] * weights[0] + inputs[1] * weights[1] + bias;
    const hiddenOutput = 1 / (1 + Math.exp(-hiddenSum * 5)); // Scaled sigmoid for sharper thresholding

    // Layer 2: Hidden to Outputs
    const o1Sum = hiddenOutput * weights[2] * 5; // scaled
    const o2Sum = hiddenOutput * weights[3] * 5; // scaled
    const output1 = 1 / (1 + Math.exp(-o1Sum + 2.5)); // biased for calibration puzzle
    const output2 = 1 / (1 + Math.exp(-o2Sum + 2.5));

    const outputs = [output1, output2];
    const avgError = (Math.abs(output1 - target[0]) + Math.abs(output2 - target[1])) / 2;

    useEffect(() => {
        if (stage === STAGES.GAME) {
            onAriaUpdate(`Round ${challengeIndex + 1}/${challenges.length}: ${intro}`);
            setFeedback(null);
        }
    }, [stage, challengeIndex, onAriaUpdate, intro, challenges.length]);

    const handlePredict = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            if (avgError < 0.25) { // Lenient for calibration puzzles
                setStreak(s => s + 1);
                setFeedback({ correct: true, msg: `✅ Mission Successful! Synaptic path confirmed.` });
                if (challengeIndex === challenges.length - 1) {
                    setTimeout(() => setStage(STAGES.PYTHON), 1500);
                } else {
                    setTimeout(() => {
                        setChallengeIndex(c => c + 1);
                        setFeedback(null);
                        setWeights([0.5, 0.5, 0.5, 0.5]);
                        setBias(0.1);
                    }, 1500);
                }
            } else {
                setStreak(0);
                setFailures(f => f + 1);
                setShake(s => s + 1);
                setFeedback({ correct: false, msg: `❌ Output mismatch! Error: ${avgError.toFixed(2)}. Adjust the weights.` });
                if (failures >= 1) setShowHint(true);
            }
        }, 800);
    };

    const handleWeightChange = (index, val) => {
        const newWeights = [...weights];
        newWeights[index] = val;
        setWeights(newWeights);
    };

    return (
        <>
            <gridHelper args={[20, 20, '#101020', '#050510']} position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, 5]} intensity={1} color="#00ffff" />

            {/* Network Architecture Rendering */}
            <group position={[0, 0, 0]}>
                {/* Inputs */}
                <Neuron position={[-4, 1.5, 0]} type="input" label="IN_1" value={inputs[0]} isActive={isProcessing} />
                <Neuron position={[-4, -1.5, 0]} type="input" label="IN_2" value={inputs[1]} isActive={isProcessing} />

                {/* Hidden Layer */}
                <Neuron position={[0, 0, 0]} type="hidden" label="HIDDEN_1" value={hiddenOutput} isActive={isProcessing && hiddenOutput > 0.5} />

                {/* Outputs */}
                <Neuron position={[4, 1.5, 0]} type="output" label="OUT_1" value={output1} isActive={isProcessing && output1 > 0.5} />
                <Neuron position={[4, -1.5, 0]} type="output" label="OUT_2" value={output2} isActive={isProcessing && output2 > 0.5} />

                {/* Synapses (Connections) */}
                {/* In -> Hidden */}
                <Synapse start={[-3.7, 1.5, 0]} end={[-0.3, 0, 0]} strength={weights[0]} isActive={isProcessing} />
                <Synapse start={[-3.7, -1.5, 0]} end={[-0.3, 0, 0]} strength={weights[1]} isActive={isProcessing} />

                {/* Hidden -> Out */}
                <Synapse start={[0.3, 0, 0]} end={[3.7, 1.5, 0]} strength={weights[2]} isActive={isProcessing && hiddenOutput > 0.5} />
                <Synapse start={[0.3, 0, 0]} end={[3.7, -1.5, 0]} strength={weights[3]} isActive={isProcessing && hiddenOutput > 0.5} />
            </group>

            {stage === STAGES.GAME && (
                <>
                    <Html position={[-8.5, 2.5, 0]}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{
                                x: shake ? [0, -5, 5, -5, 5, 0] : 0,
                                opacity: 1
                            }}
                            transition={{ duration: shake ? 0.4 : 0.6 }}
                            style={{ fontFamily: 'monospace', background: 'rgba(5,10,25,0.95)', border: '1px solid #1a3a5a', borderRadius: '12px', padding: '20px', width: '300px', pointerEvents: 'auto', boxShadow: '0 0 30px rgba(0,255,255,0.1)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ color: '#00ffff', fontSize: '10px', letterSpacing: '2px' }}>NEURAL_CALIBRATION</span>
                                <span style={{ color: '#444', fontSize: '10px' }}>EP_{challengeIndex + 1}</span>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                {[
                                    { label: 'W0: IN_1 → H1', color: '#00ffff' },
                                    { label: 'W1: IN_2 → H1', color: '#00ffff' },
                                    { label: 'W2: H1 → O1', color: '#ff00ff' },
                                    { label: 'W3: H1 → O2', color: '#ff00ff' }
                                ].map((w, i) => (
                                    <div key={i} style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginBottom: '4px' }}>
                                            <span>{w.label}</span><span style={{ color: w.color }}>{weights[i].toFixed(2)}</span>
                                        </div>
                                        <input type="range" min="0" max="1" step="0.05" value={weights[i]} onChange={(e) => handleWeightChange(i, parseFloat(e.target.value))} style={{ width: '100%', accentColor: w.color }} />
                                    </div>
                                ))}

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', margin: '14px 0 4px' }}>
                                    <span>BIAS (H1)</span><span style={{ color: '#00ffaa' }}>{bias.toFixed(2)}</span>
                                </div>
                                <input type="range" min="-1" max="1" step="0.05" value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#00ffaa' }} />
                            </div>

                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{ padding: '10px', borderRadius: '6px', fontSize: '10px', background: feedback.correct ? 'rgba(0,255,170,0.1)' : 'rgba(255,50,50,0.1)', border: `1px solid ${feedback.correct ? '#00ffaa' : '#ff3333'}`, color: feedback.correct ? '#00ffaa' : '#ff6666', marginBottom: '15px' }}
                                    >
                                        {feedback.msg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(0,255,255,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePredict}
                                disabled={isProcessing}
                                style={{ width: '100%', padding: '12px', background: isProcessing ? '#111' : 'transparent', border: '1px solid #00ffff', color: '#00ffff', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', opacity: isProcessing ? 0.5 : 1 }}
                            >
                                {isProcessing ? 'PROPAGATING...' : 'TEST SIGNAL'}
                            </motion.button>
                        </motion.div>
                    </Html>

                    <Html position={[6, 0, 0]}>
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            style={{ fontFamily: 'monospace', background: 'rgba(5,10,25,0.95)', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '220px' }}
                        >
                            <div style={{ fontSize: '10px', color: '#888', marginBottom: '15px' }}>TARGET_STATE</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <span style={{ fontSize: '10px', color: '#ff00ff' }}>OUT_1</span>
                                <div style={{ width: '100px', height: '12px', background: '#111', borderRadius: '6px', border: '1px solid #333', overflow: 'hidden' }}>
                                    <div style={{ width: `${target[0] * 100}%`, height: '100%', background: '#ff00ff' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontSize: '10px', color: '#ff00ff' }}>OUT_2</span>
                                <div style={{ width: '100px', height: '12px', background: '#111', borderRadius: '6px', border: '1px solid #333', overflow: 'hidden' }}>
                                    <div style={{ width: `${target[1] * 100}%`, height: '100%', background: '#ff00ff' }} />
                                </div>
                            </div>

                            <div style={{ fontSize: '9px', color: '#555', lineHeight: '1.5', borderTop: '1px solid #222', paddingTop: '10px' }}>
                                {intro}
                            </div>

                            {showHint && (
                                <div style={{ marginTop: '12px', fontSize: '9px', color: '#ffaa00', borderTop: '1px dashed #444', paddingTop: '8px' }}>
                                    💡 {hint}
                                </div>
                            )}
                        </motion.div>
                    </Html>
                </>
            )}

            {stage === STAGES.PYTHON && (
                <TheoryOverlay
                    type="CODE"
                    title="PYTHON: NEURAL ARCHITECTURE"
                    code={`import torch\nimport torch.nn as nn\n\n# Architecture: IN(2) -> HIDDEN(1) -> OUT(2)\nclass CalibrationNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.hidden = nn.Linear(2, 1) # weights W0, W1\n        self.output = nn.Linear(1, 2) # weights W2, W3\n\n    def forward(self, x):\n        h = torch.sigmoid(self.hidden(x))\n        return torch.sigmoid(self.output(h))\n\n# Calibrating weights creates \n# specific routing behavior!`}
                    onAction={() => setStage(STAGES.ML)}
                    actionLabel="SEE ML CONNECTION →"
                />
            )}

            {stage === STAGES.ML && (
                <TheoryOverlay
                    type="THEORY"
                    title="ML CONNECTION: NEURAL ROUTING"
                    description={
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', lineHeight: '1.9', fontSize: '13px' }}>
                            <li>🏗️ <strong>Hidden Layers:</strong> These are the "feature extractors" — H1 learns a specific combination of inputs.</li>
                            <li>🧬 <strong>Weights as Gates:</strong> Higher weights allow more signal through. In binary logic nets, weights act like filters.</li>
                            <li>🌊 <strong>Gradient Descent:</strong> This is the math that automatically slides those weights to minimize the error you just saw.</li>
                            <li>🧠 <strong>Deep Learning:</strong> By stacking millions of these simple nodes, models like GPT learn to "think" in highly abstract high-dimensional spaces.</li>
                        </ul>
                    }
                    onAction={() => {
                        const timeTaken = (Date.now() - startTime) / 1000;
                        const xp = Math.round(150 + Math.max(0, 60 - timeTaken));
                        setXpEarned(xp);
                        progressService.addXP(xp);
                        progressService.markMastery('neural_networks');
                        setStage(STAGES.XP_AWARD);
                    }}
                    actionLabel="MISSION COMPLETE — CLAIM XP"
                />
            )}

            {stage === STAGES.XP_AWARD && (
                <TheoryOverlay
                    type="SUCCESS"
                    title="NEURAL CORE MASTERED"
                    subtitle="SYNAPTIC ARCHITECTURE COMMITTED"
                    xp={xpEarned}
                    onAction={onComplete}
                    actionLabel="RETURN TO HUB"
                />
            )}
        </>
    );
};

export default NeuralNetworks;
