import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Html, Sphere, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHALLENGES } from '../../data/challenges';
import progressService from '../../services/progressService';
import TheoryOverlay from '../../components/TheoryOverlay';

const STAGES = { GAME: 'GAME', PYTHON: 'PYTHON', ML: 'ML', XP_AWARD: 'XP_AWARD' };

const GlowingBoundary = ({ points }) => {
    const lineRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (lineRef.current) {
            lineRef.current.material.opacity = 0.7 + Math.sin(t * 3) * 0.2;
            lineRef.current.material.lineWidth = 4 + Math.sin(t * 2) * 1.5;
        }
    });

    return (
        <Line
            ref={lineRef}
            points={points}
            color="#ffffff"
            lineWidth={4}
            transparent
            opacity={0.8}
        />
    );
};

const Classification = ({ onComplete, onAriaUpdate }) => {
    const [stage, setStage] = useState(STAGES.GAME);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [lineAngle, setLineAngle] = useState(0);
    const [lineOffset, setLineOffset] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [startTime] = useState(Date.now());
    const [showHint, setShowHint] = useState(false);
    const [failures, setFailures] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [shake, setShake] = useState(0);

    const challenges = CHALLENGES.classification;
    const currentChallenge = challenges[challengeIndex];
    if (!currentChallenge) return null;
    const { points, intro, hint } = currentChallenge;

    const normal = useMemo(() => new THREE.Vector2(Math.cos(lineAngle), Math.sin(lineAngle)), [lineAngle]);

    useEffect(() => {
        if (!points || points.length === 0) return;
        let correct = 0;
        points.forEach(p => {
            const dist = (p.x * normal.x + p.y * normal.y) - lineOffset;
            if ((dist > 0 ? 'A' : 'B') === p.label) correct++;
        });
        setAccuracy((correct / points.length) * 100);
    }, [normal, lineOffset, points]);

    useEffect(() => {
        if (stage === STAGES.GAME) {
            onAriaUpdate(`Round ${challengeIndex + 1}/${challenges.length} — ${intro}`);
            setLineAngle(0);
            setLineOffset(0);
            setShowHint(false);
            setFeedback(null);
        }
    }, [stage, challengeIndex, onAriaUpdate, intro, challenges.length]);

    const checkMastery = () => {
        if (accuracy >= 90) {
            const newSuccesses = consecutiveSuccesses + 1;
            setConsecutiveSuccesses(newSuccesses);
            setFeedback({ correct: true, msg: `✅ ${accuracy.toFixed(1)}% Accuracy! Boundary Stabilized.` });

            if (challengeIndex === challenges.length - 1) {
                setTimeout(() => setStage(STAGES.PYTHON), 1200);
            } else {
                setTimeout(() => {
                    setChallengeIndex(c => c + 1);
                    setFeedback(null);
                }, 1200);
            }
        } else {
            setFailures(f => f + 1);
            setShake(s => s + 1);
            setFeedback({ correct: false, msg: `❌ ${accuracy.toFixed(1)}% — Need 90%+ Precision.` });
            if (failures >= 1) setShowHint(true);
        }
    };

    const linePoints = useMemo(() => {
        const dir = new THREE.Vector2(-Math.sin(lineAngle), Math.cos(lineAngle));
        const center = normal.clone().multiplyScalar(lineOffset);
        return [
            [center.x + dir.x * 12, center.y + dir.y * 12, 0],
            [center.x - dir.x * 12, center.y - dir.y * 12, 0]
        ];
    }, [lineAngle, lineOffset, normal]);

    const accuracyColor = accuracy >= 90 ? '#00ffaa' : accuracy >= 70 ? '#ffaa00' : '#ff4444';

    return (
        <>
            <gridHelper args={[20, 20, '#101020', '#050510']} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]} />
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 5, 5]} intensity={1.5} color="#00ffff" />

            {/* Data points with Scanning Effect */}
            <AnimatePresence mode="wait">
                <group key={`challenge-${challengeIndex}`}>
                    {points.map((p, i) => (
                        <motion.group
                            key={`p-${i}`}
                            initial={{ scale: 0, x: -10, opacity: 0 }}
                            animate={{ scale: 1, x: p.x, opacity: 1 }}
                            transition={{ delay: i * 0.05, type: 'spring', damping: 15 }}
                        >
                            <Sphere position={[0, p.y, 0]} args={[0.25, 16, 16]}>
                                <meshStandardMaterial
                                    color={p.label === 'A' ? '#00ffff' : '#ff00ff'}
                                    emissive={p.label === 'A' ? '#00ffff' : '#ff00ff'}
                                    emissiveIntensity={1}
                                    transparent
                                    opacity={0.9}
                                />
                            </Sphere>
                        </motion.group>
                    ))}
                </group>
            </AnimatePresence>

            {/* Decision Boundary with Glow */}
            <GlowingBoundary points={linePoints} />

            {stage === STAGES.GAME && (
                <>
                    <Html position={[8, 4, 0]}>
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            style={{ fontFamily: 'monospace', width: '240px', background: 'rgba(5,10,25,0.95)', border: '1px solid #1a3a5a', borderRadius: '12px', padding: '20px', pointerEvents: 'auto', boxShadow: '0 0 30px rgba(0,255,255,0.1)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontSize: '10px', color: '#00ffff', letterSpacing: '2px' }}>BOUND_SCAN</span>
                                <span style={{ fontSize: '10px', color: '#444' }}>EP_{challengeIndex + 1}</span>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '11px', color: '#ddd', lineHeight: '1.6', marginBottom: '12px' }}>{intro}</p>

                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '5px' }}>
                                        <span style={{ color: '#888' }}>CONFIDENCE</span>
                                        <span style={{ color: accuracyColor, fontWeight: 'bold' }}>{accuracy.toFixed(1)}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#111', borderRadius: '3px', border: '1px solid #333', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${accuracy}%`, background: accuracyColor }}
                                            style={{ height: '100%' }}
                                        />
                                    </div>
                                </div>

                                {showHint && (
                                    <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,200,0,0.05)', borderRadius: '6px', border: '1px solid rgba(255,200,0,0.2)', fontSize: '9px', color: '#ffcc00', lineHeight: '1.6' }}>
                                        💡 {hint}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </Html>

                    <Html position={[-8, -2, 0]}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{
                                x: shake ? [0, -5, 5, -5, 5, 0] : 0,
                                opacity: 1
                            }}
                            transition={{ duration: shake ? 0.4 : 0.6 }}
                            style={{ fontFamily: 'monospace', background: 'rgba(5,10,25,0.95)', border: '1px solid #1a3a5a', borderRadius: '12px', padding: '20px', width: '260px', pointerEvents: 'auto', boxShadow: '0 0 30px rgba(0,255,255,0.1)' }}
                        >
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                                    <span>VECTOR_ANGLE</span>
                                    <span style={{ color: '#00ffff' }}>{lineAngle.toFixed(2)} rad</span>
                                </div>
                                <input type="range" min="0" max={Math.PI} step="0.01" value={lineAngle} onChange={(e) => setLineAngle(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#00ffff' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                                    <span>ORTHOGONAL_SHIFT</span>
                                    <span style={{ color: '#ff00ff' }}>{lineOffset.toFixed(2)}</span>
                                </div>
                                <input type="range" min="-8" max="8" step="0.1" value={lineOffset} onChange={(e) => setLineOffset(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#ff00ff' }} />
                            </div>

                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{ padding: '12px', borderRadius: '6px', fontSize: '10px', background: feedback.correct ? 'rgba(0,255,170,0.1)' : 'rgba(255,50,50,0.1)', border: `1px solid ${feedback.correct ? '#00ffaa' : '#ff3333'}`, color: feedback.correct ? '#00ffaa' : '#ff6666', marginBottom: '15px' }}
                                    >
                                        {feedback.msg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(0,255,255,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={checkMastery}
                                style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #00ffff', color: '#00ffff', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px' }}
                            >
                                {accuracy >= 90 ? 'LOCK BOUNDARY' : 'CALIBRATE DECISION'}
                            </motion.button>
                        </motion.div>
                    </Html>
                </>
            )}

            {stage === STAGES.PYTHON && (
                <TheoryOverlay
                    type="CODE"
                    title="PYTHON: LOGISTIC REGRESSION"
                    code={`from sklearn.linear_model import LogisticRegression\n\n# Binary Classification boundary:\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\n\n# Predict probabilities for each point:\nprobs = model.predict_proba(X_test)\n\n# Accuracy measures separation quality:\nscore = model.score(X_test, y_test)`}
                    onAction={() => setStage(STAGES.ML)}
                    actionLabel="SEE ML CONNECTION →"
                />
            )}

            {stage === STAGES.ML && (
                <TheoryOverlay
                    type="THEORY"
                    title="ML CONNECTION: DECISION SURFACES"
                    description={
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', lineHeight: '1.9', fontSize: '13px' }}>
                            <li>⚖️ <strong>The Hyperplane:</strong> In n-dimensions, classification is about finding a surface that slices the space into classes.</li>
                            <li>🔍 <strong>Overfitting:</strong> If you try to wiggle the boundary too much to fit every point, the model loses sight of the "big picture".</li>
                            <li>🔄 <strong>Entropy:</strong> Models use 'Cross-Entropy' to measure how "surprised" they are by incorrect labels — training is minimizing this surprise.</li>
                            <li>⚔️ <strong>SVMs vs Logistic:</strong> SVMs maximize the margin (the gap), while Logistic Regression maximizes the probability of the right answer.</li>
                        </ul>
                    }
                    onAction={() => {
                        const timeTaken = (Date.now() - startTime) / 1000;
                        const xp = Math.round(120 + Math.max(0, 50 - timeTaken));
                        setXpEarned(xp);
                        progressService.addXP(xp);
                        progressService.markMastery('classification');
                        setStage(STAGES.XP_AWARD);
                    }}
                    actionLabel="MISSION COMPLETE — CLAIM XP"
                />
            )}

            {stage === STAGES.XP_AWARD && (
                <TheoryOverlay
                    type="SUCCESS"
                    title="CLASSIFIER ENGINE MASTERED"
                    subtitle="BOUNDARY PARAMETERS COMMITTED"
                    xp={xpEarned}
                    onAction={onComplete}
                    actionLabel="RETURN TO HUB"
                />
            )}
        </>
    );
};

export default Classification;
