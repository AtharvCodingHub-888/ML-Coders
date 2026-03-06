import React, { useState, useEffect, useRef } from 'react';
import { Html, Sphere, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useFrame } from '@react-three/fiber';
import { calculateMSE } from '../../utils/mathUtils';
import { CHALLENGES } from '../../data/challenges';
import progressService from '../../services/progressService';
import TheoryOverlay from '../../components/TheoryOverlay';

const STAGES = { GAME: 'GAME', PYTHON: 'PYTHON', ML: 'ML', XP_AWARD: 'XP_AWARD' };

const ShimmeringLine = ({ slope, intercept }) => {
    const lineRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (lineRef.current) {
            lineRef.current.material.opacity = 0.6 + Math.sin(t * 4) * 0.2;
            lineRef.current.material.lineWidth = 4 + Math.sin(t * 3) * 1;
        }
    });

    return (
        <Line
            ref={lineRef}
            points={[[-5, (slope * -2.5 + intercept) * 1.5, 0], [5, (slope * 2.5 + intercept) * 1.5, 0]]}
            color="var(--neon-magenta)"
            lineWidth={4}
            transparent
            opacity={0.8}
        />
    );
};

const LinearRegression = ({ onComplete, onAriaUpdate }) => {
    const [stage, setStage] = useState(STAGES.GAME);
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [slope, setSlope] = useState(0);
    const [intercept, setIntercept] = useState(0);
    const [mse, setMSE] = useState(0);
    const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [startTime] = useState(Date.now());
    const [failures, setFailures] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [shake, setShake] = useState(0);

    const challenges = CHALLENGES.linear_regression;
    const currentChallenge = challenges[challengeIndex];
    if (!currentChallenge) return null;
    const { points, intro, hint } = currentChallenge;

    useEffect(() => {
        const predictions = points.map(p => slope * p.x + intercept);
        const targets = points.map(p => p.y);
        setMSE(calculateMSE(predictions, targets));
    }, [slope, intercept, points]);

    useEffect(() => {
        if (stage === STAGES.GAME) {
            onAriaUpdate(`Round ${challengeIndex + 1}/${challenges.length} — ${intro}`);
            setSlope(0);
            setIntercept(0);
            setFeedback(null);
        }
    }, [stage, challengeIndex, onAriaUpdate, intro, challenges.length]);

    const checkMastery = () => {
        if (mse < 1.5) {
            const newSuccesses = consecutiveSuccesses + 1;
            setConsecutiveSuccesses(newSuccesses);
            setFeedback({ correct: true, msg: `✅ MSE = ${mse.toFixed(3)} — Excellent fit!` });
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
            setFeedback({ correct: false, msg: `❌ MSE = ${mse.toFixed(2)} — Need < 1.5` });
        }
    };

    const mseColor = mse < 1.5 ? '#00ffaa' : mse < 5 ? '#ffaa00' : '#ff4444';

    return (
        <>
            <gridHelper args={[20, 20, '#101020', '#050510']} position={[0, -0.1, 0]} />
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 5, 5]} intensity={1.5} color="#00ffff" />

            {/* Data Points */}
            <AnimatePresence mode="wait">
                <group key={`challenge-${challengeIndex}`}>
                    {points.map((p, i) => (
                        <motion.group
                            key={`p-${i}`}
                            initial={{ scale: 0, y: 2 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ delay: i * 0.08, type: 'spring', damping: 12 }}
                        >
                            <Sphere position={[p.x * 2, p.y * 1.5, 0]} args={[0.22, 16, 16]}>
                                <meshStandardMaterial
                                    color="var(--neon-cyan)"
                                    emissive="var(--neon-cyan)"
                                    emissiveIntensity={1}
                                    transparent
                                    opacity={0.9}
                                />
                            </Sphere>
                        </motion.group>
                    ))}
                </group>
            </AnimatePresence>

            {/* Shimmering Regression Line */}
            <ShimmeringLine slope={slope} intercept={intercept} />

            {/* Residual error lines */}
            {points.map((p, i) => {
                const px = p.x * 2;
                const py = p.y * 1.5;
                const predY = (slope * p.x + intercept) * 1.5;
                return (
                    <Line
                        key={`r${i}`}
                        points={[[px, py, 0], [px, predY, 0]]}
                        color={mseColor}
                        lineWidth={1}
                        transparent
                        opacity={0.3}
                    />
                );
            })}

            {stage === STAGES.GAME && (
                <>
                    <Html position={[0, 5.5, 0]} center>
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#888', letterSpacing: '3px', marginBottom: '10px' }}>ROUND {challengeIndex + 1} / {challenges.length}</div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                {challenges.map((_, i) => (
                                    <div
                                        key={i}
                                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < challengeIndex ? '#00ffaa' : i === challengeIndex ? '#ffcc00' : '#222', boxShadow: i === challengeIndex ? '0 0 10px #ffcc00' : 'none' }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </Html>

                    <Html position={[-8, 0, 0]}>
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{
                                x: shake ? [0, -5, 5, -5, 5, 0] : 0,
                                opacity: 1
                            }}
                            transition={{ duration: shake ? 0.4 : 0.6 }}
                            style={{ fontFamily: 'monospace', background: 'rgba(5,10,25,0.95)', border: '1px solid #1a3a5a', borderRadius: '12px', padding: '20px', width: '260px', pointerEvents: 'auto', boxShadow: '0 0 30px rgba(0,255,255,0.1)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ color: '#00ffff', fontSize: '10px', letterSpacing: '2px' }}>GRADIENCE_FIT</span>
                                <span style={{ color: '#444', fontSize: '10px' }}>{mse.toFixed(2)} MSE</span>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                                    <span>SLOPE</span><span style={{ color: 'var(--neon-magenta)' }}>{slope.toFixed(2)}</span>
                                </div>
                                <input type="range" min="-3" max="3" step="0.05" value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--neon-magenta)' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', margin: '15px 0 8px' }}>
                                    <span>BIAS</span><span style={{ color: '#ffaa00' }}>{intercept.toFixed(2)}</span>
                                </div>
                                <input type="range" min="-3" max="3" step="0.05" value={intercept} onChange={(e) => setIntercept(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#ffaa00' }} />
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
                                {mse < 1.5 ? 'PROCEED TO CALIBRATION' : 'OPTIMIZE ERROR'}
                            </motion.button>
                        </motion.div>
                    </Html>
                </>
            )}

            {stage === STAGES.PYTHON && (
                <TheoryOverlay
                    type="CODE"
                    title="PYTHON: LINEAR REGRESSION"
                    code={`from sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Your data points became training tensors:\nX = np.array([-2, -1, 0, 1, 2]).reshape(-1, 1)\ny = np.array([-2, -1, 0, 1, 2])\n\nmodel = LinearRegression().fit(X, y)\n\nprint(f"Slope (w): {model.coef_[0]}")\nprint(f"Bias  (b): {model.intercept_}")`}
                    onAction={() => setStage(STAGES.ML)}
                    actionLabel="SEE ML CONNECTION →"
                />
            )}

            {stage === STAGES.ML && (
                <TheoryOverlay
                    type="THEORY"
                    title="ML CONNECTION: GRADIENT DESCENT"
                    description={
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', lineHeight: '1.9', fontSize: '13px' }}>
                            <li>📉 <strong>Loss Function:</strong> MSE (Mean Squared Error) measures the vertical distance from points to the line.</li>
                            <li>🌊 <strong>The Gradient:</strong> It's the mathematical "slope" that tells the model which way to nudge weights to reduce error.</li>
                            <li>🏠 <strong>Applications:</strong> House price prediction, demand forecasting, and foundation of Neural Net training.</li>
                            <li>🧠 <strong>Optimization:</strong> Large models use variants like 'Adam' to fly down the surface of high-dimensional loss landscapes.</li>
                        </ul>
                    }
                    onAction={() => {
                        const timeTaken = (Date.now() - startTime) / 1000;
                        const xp = Math.round(100 + Math.max(0, 50 - timeTaken));
                        setXpEarned(xp);
                        progressService.addXP(xp);
                        progressService.markMastery('linear_regression');
                        setStage(STAGES.XP_AWARD);
                    }}
                    actionLabel="MISSION COMPLETE — CLAIM XP"
                />
            )}

            {stage === STAGES.XP_AWARD && (
                <TheoryOverlay
                    type="SUCCESS"
                    title="REGRESSION MODEL COMMITTED"
                    subtitle="GRADIENT VECTOR STABILIZED"
                    xp={xpEarned}
                    onAction={onComplete}
                    actionLabel="RETURN TO HUB"
                />
            )}
        </>
    );
};

export default LinearRegression;
