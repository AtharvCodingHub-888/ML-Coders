import React, { useState, useEffect, useMemo } from 'react';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { getVectorMagnitude, getAngleDifference, degToRad } from '../../utils/mathUtils';
import { CHALLENGES } from '../../data/challenges';
import progressService from '../../services/progressService';
import TheoryOverlay from '../../components/TheoryOverlay';

const STAGES = {
    GAME: 'GAME',
    PYTHON: 'PYTHON',
    ML: 'ML',
    XP_AWARD: 'XP_AWARD',
};

const VectorArrow = ({ vector, color = '#ff0066', label = 'V' }) => {
    const dir = useMemo(() => new THREE.Vector3(vector.x, vector.y, vector.z).normalize(), [vector]);
    const length = useMemo(() => getVectorMagnitude(vector), [vector]);
    return (
        <group>
            <primitive object={new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color, 0.5, 0.2)} />
            <Html position={[vector.x, vector.y + 0.5, vector.z]} distanceFactor={10}>
                <div style={{ color, background: 'rgba(0,0,0,0.8)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', whiteSpace: 'nowrap', border: `1px solid ${color}`, pointerEvents: 'none' }}>
                    {label}: {length.toFixed(1)}u
                </div>
            </Html>
        </group>
    );
};

const Vectors = ({ onComplete, onAriaUpdate }) => {
    const [stage, setStage] = useState(STAGES.GAME);
    const [userVector, setUserVector] = useState({ mag: 5, angle: 45 });
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0);
    const [failures, setFailures] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [startTime] = useState(Date.now());
    const [shake, setShake] = useState(0);
    const [lastFeedback, setLastFeedback] = useState({ mag: 'none', angle: 'none' });

    const currentChallenge = CHALLENGES.vectors[challengeIndex];
    const targetVector = useMemo(() => currentChallenge.target, [currentChallenge]);

    const user3D = useMemo(() => ({
        x: userVector.mag * Math.cos(degToRad(userVector.angle)),
        y: userVector.mag * Math.sin(degToRad(userVector.angle)),
        z: 0
    }), [userVector]);

    const target3D = useMemo(() => ({
        x: targetVector.mag * Math.cos(degToRad(targetVector.angle)),
        y: targetVector.mag * Math.sin(degToRad(targetVector.angle)),
        z: 0
    }), [targetVector]);

    useEffect(() => {
        if (stage === STAGES.GAME) {
            onAriaUpdate("Match the CYAN vector to the MAGENTA target. Adjust magnitude and angle. 3 consecutive successes to win!");
            setLastFeedback({ mag: 'none', angle: 'none' });
        }
        if (stage === STAGES.PYTHON) onAriaUpdate("Perfect! Now see how vectors are represented and computed in Python.");
        if (stage === STAGES.ML) onAriaUpdate("Let's see why vectors are the backbone of Machine Learning.");
    }, [stage, onAriaUpdate]);

    const checkMastery = () => {
        const angleErr = getAngleDifference(userVector.angle, targetVector.angle);
        const magErr = Math.abs(userVector.mag - targetVector.mag);

        const newFeedback = {
            mag: magErr < 0.5 ? 'correct' : magErr < 1.5 ? 'present' : 'absent',
            angle: angleErr < 5 ? 'correct' : angleErr < 15 ? 'present' : 'absent'
        };
        setLastFeedback(newFeedback);

        if (angleErr < 5 && magErr < 0.5) {
            const newSuccesses = consecutiveSuccesses + 1;
            setConsecutiveSuccesses(newSuccesses);
            onAriaUpdate(`Perfect alignment! ${newSuccesses}/3`);
            if (newSuccesses >= 3) {
                setTimeout(() => {
                    onAriaUpdate("All targets hit! Reviewing Python implementation...");
                    setStage(STAGES.PYTHON);
                }, 800);
            } else {
                setTimeout(() => {
                    setChallengeIndex((prev) => (prev + 1) % CHALLENGES.vectors.length);
                    setLastFeedback({ mag: 'none', angle: 'none' });
                }, 1000);
            }
        } else {
            setConsecutiveSuccesses(0);
            const newFailures = failures + 1;
            setFailures(newFailures);
            setShake(prev => prev + 1);
            onAriaUpdate(`Off target. Angle err: ${angleErr.toFixed(1)}°, Mag err: ${magErr.toFixed(1)}`);
        }
    };

    const getTileColor = (status) => {
        switch (status) {
            case 'correct': return '#00ffaa';
            case 'present': return '#ffcc00';
            case 'absent': return '#444';
            default: return 'rgba(255,255,255,0.05)';
        }
    };

    return (
        <>
            <gridHelper args={[20, 20, '#444', '#111']} position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]} />
            <VectorArrow vector={user3D} color="var(--neon-cyan)" label="USER" />
            <AnimatePresence>
                {stage === STAGES.GAME && (
                    <motion.group
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <VectorArrow vector={target3D} color="var(--neon-magenta)" label="TARGET" />
                    </motion.group>
                )}
            </AnimatePresence>

            {stage === STAGES.GAME && (
                <Html position={[-9, 5, 0]}>
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1, x: shake ? [0, -5, 5, -5, 5, 0] : 0 }}
                        transition={{ duration: shake ? 0.4 : 0.5 }}
                        className="glass-panel"
                        style={{ width: '260px', padding: '25px', pointerEvents: 'auto', border: '1px solid rgba(0,255,255,0.2)' }}
                    >
                        <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '20px', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px' }}>Sensor Sync</h4>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                            <motion.div
                                animate={lastFeedback.mag !== 'none' ? { rotateY: 360 } : {}}
                                style={{ width: '50px', height: '50px', background: getTileColor(lastFeedback.mag), border: '1px solid #666', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' }}
                            >
                                <span style={{ color: '#fff' }}>MAG</span>
                            </motion.div>
                            <motion.div
                                animate={lastFeedback.angle !== 'none' ? { rotateY: 360 } : {}}
                                transition={{ delay: 0.1 }}
                                style={{ width: '50px', height: '50px', background: getTileColor(lastFeedback.angle), border: '1px solid #666', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' }}
                            >
                                <span style={{ color: '#fff' }}>ANG</span>
                            </motion.div>
                        </div>

                        <div className="slider-group" style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                <span>MAGNITUDE</span><span>{userVector.mag.toFixed(1)}u</span>
                            </div>
                            <input type="range" min="1" max="10" step="0.1" value={userVector.mag} onChange={(e) => setUserVector({ ...userVector, mag: parseFloat(e.target.value) })} />
                        </div>
                        <div className="slider-group" style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                <span>AZIMUTH ANGLE</span><span>{userVector.angle.toFixed(1)}°</span>
                            </div>
                            <input type="range" min="0" max="360" value={userVector.angle} onChange={(e) => setUserVector({ ...userVector, angle: parseFloat(e.target.value) })} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>STABILITY LOCK</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: consecutiveSuccesses >= i ? 'var(--neon-cyan)' : '#222', border: '1px solid #444' }} />
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={checkMastery}
                            className="neon-button"
                            style={{ width: '100%' }}
                        >
                            CONFIRM ALIGNMENT
                        </motion.button>
                    </motion.div>
                </Html>
            )}

            {stage === STAGES.PYTHON && (
                <TheoryOverlay
                    type="CODE"
                    title="PYTHON: VECTOR MATH"
                    code={`import numpy as np\nimport math\n\n# Define vector by magnitude + angle\nmag   = ${userVector.mag.toFixed(1)}\nangle = ${userVector.angle.toFixed(1)}  # degrees\n\n# Convert to Cartesian (x, y)\nrad = math.radians(angle)\nx   = mag * math.cos(rad)  # ${user3D.x.toFixed(2)}\ny   = mag * math.sin(rad)  # ${user3D.y.toFixed(2)}\n\nvec = np.array([x, y])  # NumPy vector`}
                    onAction={() => setStage(STAGES.ML)}
                    actionLabel="SEE ML CONNECTION →"
                />
            )}

            {stage === STAGES.ML && (
                <TheoryOverlay
                    type="THEORY"
                    title="ML CONNECTION: VECTORS"
                    description={
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>🧬 <strong>Feature Vectors</strong>: Each training sample is a vector where each dimension is a feature (e.g., height, weight, age).</li>
                            <li>🔗 <strong>Word Embeddings</strong>: Words in NLP are mapped to high-dimensional vectors (Word2Vec, GloVe). Similar words cluster close together.</li>
                            <li>⚖️ <strong>Weight Vectors</strong>: Neural network weights are vectors that transform input signals into predictions via dot products.</li>
                        </ul>
                    }
                    onAction={() => {
                        const timeTaken = (Date.now() - startTime) / 1000;
                        const totalXP = Math.round(50 + Math.max(0, 50 - timeTaken) + 20);
                        setXpEarned(totalXP);
                        progressService.addXP(totalXP);
                        progressService.markMastery('vectors');
                        setStage(STAGES.XP_AWARD);
                    }}
                    actionLabel="MISSION COMPLETE — CLAIM XP"
                />
            )}

            {stage === STAGES.XP_AWARD && (
                <TheoryOverlay
                    type="SUCCESS"
                    title="NAVIGATION ONLINE"
                    subtitle="SPATIAL INTEL ACQUIRED"
                    xp={xpEarned}
                    onAction={onComplete}
                    actionLabel="RE-ENTRY & EXIT"
                />
            )}
        </>
    );
};

export default Vectors;
