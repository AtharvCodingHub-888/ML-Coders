import React, { useState, useEffect } from 'react';
import { Html, Box } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { CHALLENGES } from '../../data/challenges';
import progressService from '../../services/progressService';
import TheoryOverlay from '../../components/TheoryOverlay';

const STAGES = { GAME: 'GAME', PYTHON: 'PYTHON', ML: 'ML', XP_AWARD: 'XP_AWARD' };

const Loops = ({ onComplete, onAriaUpdate }) => {
    const [stage, setStage] = useState(STAGES.GAME);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [iterations, setIterations] = useState(0);
    const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [startTime] = useState(Date.now());
    const [showHint, setShowHint] = useState(false);
    const [failures, setFailures] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [shake, setShake] = useState(0);

    const challenges = CHALLENGES.loops;
    const currentChallenge = challenges[challengeIndex];
    const { target: targetIterations, t1, t2, intro, hint } = currentChallenge;
    const isValidType = t1 === t2;

    useEffect(() => {
        if (stage === STAGES.GAME) {
            onAriaUpdate(`Round ${challengeIndex + 1}/${challenges.length}: Read the code carefully. Predict iterations and type safety.`);
            setIterations(0);
            setShowHint(false);
            setFeedback(null);
        }
    }, [stage, challengeIndex, onAriaUpdate, challenges.length]);

    const checkMastery = (userCount, userTypeValid) => {
        const countCorrect = userCount === targetIterations;
        const typeCorrect = userTypeValid === isValidType;

        if (countCorrect && typeCorrect) {
            const newSuccesses = consecutiveSuccesses + 1;
            setConsecutiveSuccesses(newSuccesses);
            setFeedback({ correct: true, msg: `✅ Perfect! ${targetIterations} iterations, type ${isValidType ? 'SAFE' : 'MISMATCH'} — Correct!` });
            if (newSuccesses >= challenges.length) {
                setTimeout(() => setStage(STAGES.PYTHON), 1200);
            } else {
                setTimeout(() => {
                    setChallengeIndex(c => c + 1);
                    setFeedback(null);
                }, 1200);
            }
        } else {
            const newFails = failures + 1;
            setFailures(newFails);
            setConsecutiveSuccesses(0);
            setShake(s => s + 1);
            const issue = !countCorrect ? `Iterations wrong (got ${userCount}, need ${targetIterations}).` : `Type safety wrong (should be ${isValidType ? 'SAFE' : 'MISMATCH'}).`;
            setFeedback({ correct: false, msg: issue });
            if (newFails >= 2) setShowHint(true);
        }
    };

    return (
        <>
            <gridHelper args={[20, 20, '#1a1a2e', '#0d0d1a']} position={[0, -0.5, 0]} />
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 5, 0]} intensity={1} color="#00ffff" />

            {/* Visual iteration blocks */}
            <group position={[-Math.min(iterations, 8) / 2, 0, 0]}>
                <AnimatePresence>
                    {Array.from({ length: Math.min(iterations, 15) }).map((_, i) => (
                        <motion.group
                            key={`iter-${i}`}
                            position={[i, 0, 0]}
                            initial={{ scale: 0, y: 1 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0 }}
                        >
                            <Box args={[0.7, 0.7, 0.7]}>
                                <meshStandardMaterial
                                    color={isValidType ? '#00ffaa' : '#ff4444'}
                                    emissive={isValidType ? '#00ffaa' : '#ff4444'}
                                    emissiveIntensity={0.6} transparent opacity={0.85}
                                />
                            </Box>
                        </motion.group>
                    ))}
                </AnimatePresence>
            </group>

            {stage === STAGES.GAME && (
                <>
                    {/* Code to Analyze */}
                    <Html position={[5, 2, 0]}>
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            style={{ fontFamily: 'monospace', background: 'rgba(0,5,15,0.95)', border: '1px solid var(--neon-cyan)', borderRadius: '8px', padding: '16px', width: '260px' }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '10px', color: 'var(--neon-cyan)', letterSpacing: '2px' }}>INSPECT CODE</span>
                                <span style={{ fontSize: '10px', color: '#555' }}>Round {challengeIndex + 1}/{challenges.length}</span>
                            </div>
                            {/* Intro */}
                            <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px', lineHeight: '1.5', borderLeft: '2px solid #333', paddingLeft: '8px' }}>
                                {intro}
                            </p>
                            {/* Code block */}
                            <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#00ffaa', border: '1px solid #222', lineHeight: '1.7', margin: 0 }}>
                                <code>{`for i in range(${targetIterations}):\n    x: ${t1} = 10\n    x = ${t2 === "string" ? '"text"' : "20"}  # ${t2}`}</code>
                            </pre>
                            <div style={{ marginTop: '10px', display: 'flex', gap: '6px', fontSize: '10px' }}>
                                <div style={{ flex: 1, padding: '6px', background: 'rgba(0,255,170,0.05)', border: '1px solid #1a4a2a', borderRadius: '4px', color: '#00ffaa' }}>
                                    🔢 {t1}
                                </div>
                                <div style={{ flex: 1, padding: '6px', background: `rgba(${t1 === t2 ? '0,255,170' : '255,50,50'},0.05)`, border: `1px solid ${t1 === t2 ? '#1a4a2a' : '#4a1a1a'}`, borderRadius: '4px', color: t1 === t2 ? '#00ffaa' : '#ff6666' }}>
                                    🔁 {t2}
                                </div>
                            </div>
                        </motion.div>
                    </Html>

                    {/* Answer Panel */}
                    <Html position={[-7, 0, 0]}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                x: shake ? [0, -5, 5, -5, 5, 0] : 0
                            }}
                            transition={{ duration: shake ? 0.4 : 0.6 }}
                            style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.9)', border: '1px solid #333', borderRadius: '8px', padding: '16px', width: '220px', pointerEvents: 'auto' }}
                        >
                            <h4 style={{ color: '#fff', fontSize: '11px', marginBottom: '12px', letterSpacing: '2px' }}>YOUR PREDICTION</h4>

                            {/* Iteration slider */}
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginBottom: '6px' }}>
                                    <span>ITERATION COUNT</span>
                                    <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{iterations}</span>
                                </div>
                                <input type="range" min="0" max="15" step="1" value={iterations} onChange={(e) => setIterations(parseInt(e.target.value))} style={{ width: '100%' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#555', marginTop: '2px' }}>
                                    <span>0</span><span>15</span>
                                </div>
                            </div>

                            {/* Type safety buttons */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ fontSize: '10px', color: '#888', marginBottom: '8px' }}>TYPE INTEGRITY:</div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => checkMastery(iterations, true)}
                                        style={{ flex: 1, padding: '8px 4px', borderRadius: '4px', border: '1px solid #00ffaa', background: 'rgba(0,255,170,0.1)', color: '#00ffaa', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace' }}
                                    >
                                        ✅ SAFE
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => checkMastery(iterations, false)}
                                        style={{ flex: 1, padding: '8px 4px', borderRadius: '4px', border: '1px solid #ff4444', background: 'rgba(255,68,68,0.1)', color: '#ff6666', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace' }}
                                    >
                                        ❌ MISMATCH
                                    </motion.button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ padding: '8px', borderRadius: '4px', fontSize: '10px', background: feedback.correct ? 'rgba(0,255,170,0.1)' : 'rgba(255,0,0,0.1)', border: `1px solid ${feedback.correct ? '#00ffaa' : '#ff4444'}`, color: feedback.correct ? '#00ffaa' : '#ff6666', marginBottom: '10px' }}
                                    >
                                        {feedback.msg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button onClick={() => setShowHint(h => !h)} style={{ width: '100%', padding: '6px', background: 'rgba(255,200,0,0.05)', border: '1px solid #444', color: '#ffcc00', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontFamily: 'monospace' }}>
                                {showHint ? '▼ HIDE' : '💡 HINT'}
                            </button>
                            {showHint && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ marginTop: '8px', padding: '10px', background: 'rgba(255,200,0,0.05)', borderRadius: '6px', border: '1px solid rgba(255,200,0,0.2)', fontSize: '10px', color: '#ffcc00', lineHeight: '1.6' }}>
                                    💡 {hint}
                                </motion.div>
                            )}
                        </motion.div>
                    </Html>
                </>
            )}

            {stage === STAGES.PYTHON && (
                <TheoryOverlay
                    type="CODE"
                    title="PYTHON: FOR LOOPS"
                    code={`# Iteration pattern for ML:\nfor epoch in range(100):\n    for batch in dataloader:\n        pred = model(batch.x)\n        loss = criterion(pred, batch.y)\n        loss.backward()   # backprop\n        optimizer.step()  # update weights\n\n# Type discipline matters:\ncount: int = 0\ncount = "oops"  # ❌ TypeError\ncount = 1.5     # ❌ Float ≠ int`}
                    onAction={() => setStage(STAGES.ML)}
                    actionLabel="SEE ML CONNECTION →"
                />
            )}

            {stage === STAGES.ML && (
                <TheoryOverlay
                    type="THEORY"
                    title="ML CONNECTION: TRAINING LOOPS"
                    description={
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', lineHeight: '1.9', fontSize: '13px' }}>
                            <li>🔄 <strong>Epochs:</strong> One full pass over all training data. Most models need 10–1000 epochs.</li>
                            <li>📦 <strong>Mini-Batches:</strong> Divides data into smaller chunks — faster convergence, less memory.</li>
                            <li>⚡ <strong>Backprop Loop:</strong> Each iteration: forward pass → compute loss → backward pass → update parameters.</li>
                            <li>🛡️ <strong>Type Safety:</strong> In PyTorch, mixing float32 and float64 tensors causes silent errors or crashes.</li>
                        </ul>
                    }
                    onAction={() => {
                        const timeTaken = (Date.now() - startTime) / 1000;
                        const xp = Math.round(55 + Math.max(0, 45 - timeTaken) + consecutiveSuccesses * 5);
                        setXpEarned(xp);
                        progressService.addXP(xp);
                        progressService.markMastery('loops');
                        setStage(STAGES.XP_AWARD);
                    }}
                    actionLabel="MISSION COMPLETE — CLAIM XP"
                />
            )}

            {stage === STAGES.XP_AWARD && (
                <TheoryOverlay
                    type="SUCCESS"
                    title="LOOP LOGIC MASTERED"
                    subtitle="ITERATION ENGINE ONLINE"
                    xp={xpEarned}
                    onAction={onComplete}
                    actionLabel="NEXT MISSION →"
                />
            )}
        </>
    );
};

export default Loops;
