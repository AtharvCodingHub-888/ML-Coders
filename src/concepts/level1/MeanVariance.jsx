import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { CHALLENGES } from '../../data/challenges';
import progressService from '../../services/progressService';
import TheoryOverlay from '../../components/TheoryOverlay';

const STAGES = { GAME: 'GAME', PYTHON: 'PYTHON', ML: 'ML', XP_AWARD: 'XP_AWARD' };

const DataPoint = ({ position, color = '#ffcc00', index = 0 }) => (
    <motion.mesh
        position={position}
        initial={{ scale: 0, y: 2 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: index * 0.03, type: 'spring' }}
    >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} transparent opacity={0.9} />
    </motion.mesh>
);


const MeanVariance = ({ onComplete, onAriaUpdate }) => {
    const [stage, setStage] = useState(STAGES.GAME);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [userMean, setUserMean] = useState(0);
    const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0);
    const [failures, setFailures] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [startTime] = useState(Date.now());
    const [selectedVarianceType, setSelectedVarianceType] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [shake, setShake] = useState(0);

    const challenges = CHALLENGES.mean_variance;
    const currentChallenge = challenges[challengeIndex];
    const { points: dataPoints, trueMean, variance, varianceLabel, intro, hint } = currentChallenge;

    const meanError = Math.abs(userMean - trueMean);

    useEffect(() => {
        if (stage === STAGES.GAME) {
            onAriaUpdate(`Round ${challengeIndex + 1}/${challenges.length}: ${intro}. Drag the magenta line to the mean and classify the variance.`);
            setSelectedVarianceType(null);
            setShowHint(false);
            setFeedback(null);
            setUserMean(0);
        }
    }, [stage, challengeIndex, onAriaUpdate, intro, challenges.length]);

    const checkMastery = () => {
        const meanOk = meanError <= 3;
        const varianceOk = selectedVarianceType === varianceLabel;

        if (meanOk && varianceOk) {
            const newSuccesses = consecutiveSuccesses + 1;
            setConsecutiveSuccesses(newSuccesses);
            setFeedback({ correct: true, msg: `✅ Mean error: ${meanError.toFixed(1)}, Variance: ${varianceLabel} — Correct!` });
            if (newSuccesses >= challenges.length) {
                setTimeout(() => setStage(STAGES.PYTHON), 1200);
            } else {
                setTimeout(() => {
                    setChallengeIndex(c => c + 1);
                    setFeedback(null);
                }, 1200);
            }
        } else {
            const newFailures = failures + 1;
            setFailures(newFailures);
            setConsecutiveSuccesses(0);
            setShake(s => s + 1);
            const issue = !meanOk ? `Mean is off by ${meanError.toFixed(1)} units.` : `Variance classification is wrong (should be ${varianceLabel}).`;
            setFeedback({ correct: false, msg: `❌ ${issue}` });
            if (newFailures >= 2) setShowHint(true);
        }
    };

    return (
        <>
            <gridHelper args={[20, 20, '#1a1a2e', '#0d0d1a']} position={[0, -0.1, 0]} />
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 5, 0]} intensity={1} color="#00ffff" />

            {/* Data Points */}
            <group>
                <AnimatePresence mode="popLayout">
                    {dataPoints.map((p, i) => (
                        <DataPoint key={`${challengeIndex}-${i}`} position={[p, 0, 0]} color="var(--neon-cyan)" index={i} />
                    ))}
                </AnimatePresence>
            </group>

            {/* User Mean Line */}
            <mesh position={[userMean, 0, 0]}>
                <boxGeometry args={[0.08, 4, 0.08]} />
                <meshStandardMaterial color="var(--neon-magenta)" emissive="var(--neon-magenta)" emissiveIntensity={0.8} transparent opacity={0.9} />
            </mesh>

            {/* Round progress */}
            {stage === STAGES.GAME && (
                <Html position={[0, 5, 0]} center>
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#888', letterSpacing: '3px', marginBottom: '6px' }}>ROUND {challengeIndex + 1} / {challenges.length}</div>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            {challenges.map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={i === challengeIndex ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < challengeIndex ? '#00ffaa' : i === challengeIndex ? '#ffcc00' : '#222', boxShadow: i === challengeIndex ? '0 0 8px #ffcc00' : 'none' }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </Html>
            )}

            {/* Controls */}
            {stage === STAGES.GAME && (
                <Html position={[0, -3, 0]} center>
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            x: shake ? [0, -5, 5, -5, 5, 0] : 0
                        }}
                        transition={{ duration: shake ? 0.4 : 0.6 }}
                        style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.9)', border: '1px solid #333', borderRadius: '8px', padding: '16px 20px', minWidth: '340px', pointerEvents: 'auto' }}
                    >
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginBottom: '6px' }}>
                                <span>MEAN POSITION</span><span style={{ color: 'var(--neon-magenta)' }}>{userMean.toFixed(1)}</span>
                            </div>
                            <input type="range" min="-10" max="10" step="0.1" value={userMean} onChange={(e) => setUserMean(parseFloat(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '10px', color: '#888', marginBottom: '8px' }}>SCATTER CLASSIFICATION:</div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['Low', 'High'].map(v => (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={v}
                                        onClick={() => setSelectedVarianceType(v)}
                                        style={{ flex: 1, padding: '8px', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer', borderRadius: '4px', background: selectedVarianceType === v ? (v === 'Low' ? 'rgba(0,255,170,0.2)' : 'rgba(255,68,68,0.2)') : 'transparent', border: `1px solid ${selectedVarianceType === v ? (v === 'Low' ? '#00ffaa' : '#ff4444') : '#444'}`, color: selectedVarianceType === v ? (v === 'Low' ? '#00ffaa' : '#ff4444') : '#888' }}
                                    >
                                        {v.toUpperCase()} VARIANCE
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ padding: '8px', marginBottom: '10px', borderRadius: '4px', fontSize: '11px', background: feedback.correct ? 'rgba(0,255,170,0.1)' : 'rgba(255,0,0,0.1)', border: `1px solid ${feedback.correct ? '#00ffaa' : '#ff4444'}`, color: feedback.correct ? '#00ffaa' : '#ff6666' }}
                                >
                                    {feedback.msg}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={checkMastery}
                            disabled={!selectedVarianceType}
                            style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', borderRadius: '4px', cursor: selectedVarianceType ? 'pointer' : 'not-allowed', fontFamily: 'monospace', letterSpacing: '2px', fontSize: '11px', opacity: selectedVarianceType ? 1 : 0.5 }}
                        >
                            SUBMIT DENSITY SCAN
                        </motion.button>
                    </motion.div>
                </Html>
            )}

            {stage === STAGES.PYTHON && (
                <TheoryOverlay
                    type="CODE"
                    title="PYTHON: STATISTICS"
                    code={`import numpy as np\n\ndata = ${JSON.stringify(challenges[0].points)}\n\n# Mean: sum / count\nmean = np.mean(data)     # ${challenges[0].trueMean}\n\n# Variance: avg squared deviation from mean\nvariance = np.var(data)  # measures spread\n\n# Std Dev: sqrt(variance) — same unit as data\nstd = np.std(data)\n\nprint(f"mean={mean}, spread={std:.2f}")`}
                    onAction={() => setStage(STAGES.ML)}
                    actionLabel="SEE ML CONNECTION →"
                />
            )}

            {stage === STAGES.ML && (
                <TheoryOverlay
                    type="THEORY"
                    title="ML CONNECTION: STATISTICS"
                    description={
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', lineHeight: '1.9', fontSize: '13px' }}>
                            <li>📐 <strong>Standardization:</strong> <code>z = (x - mean) / std</code> — required before most ML algorithms (SVM, Neural Nets, KNN).</li>
                            <li>🔍 <strong>Anomaly Detection:</strong> Points with z-score {'>'} 3 are outliers — flagged in fraud detection and sensor monitoring.</li>
                            <li>📊 <strong>Gaussian NB:</strong> Directly uses mean & variance to estimate probability of class membership.</li>
                            <li>❗ <strong>High Variance Features</strong> dominate distance-based models — feature scaling prevents this.</li>
                        </ul>
                    }
                    onAction={() => {
                        const timeTaken = (Date.now() - startTime) / 1000;
                        const xp = Math.round(60 + Math.max(0, 40 - timeTaken) + consecutiveSuccesses * 5);
                        setXpEarned(xp);
                        progressService.addXP(xp);
                        progressService.markMastery('mean_variance');
                        setStage(STAGES.XP_AWARD);
                    }}
                    actionLabel="MISSION COMPLETE — CLAIM XP"
                />
            )}

            {stage === STAGES.XP_AWARD && (
                <TheoryOverlay
                    type="SUCCESS"
                    title="STATISTICS MASTERED"
                    subtitle="DISTRIBUTION MODEL COMMITTED"
                    xp={xpEarned}
                    onAction={onComplete}
                    actionLabel="NEXT MISSION →"
                />
            )}
        </>
    );
};

export default MeanVariance;
