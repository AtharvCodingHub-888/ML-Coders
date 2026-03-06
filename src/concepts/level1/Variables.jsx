import React, { useState, useEffect } from 'react';
import { Html, Box, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import progressService from '../../services/progressService';
import TheoryOverlay from '../../components/TheoryOverlay';
import { CHALLENGES } from '../../data/challenges';

const STAGES = { GAME: 'GAME', PYTHON: 'PYTHON', ML: 'ML', XP_AWARD: 'XP_AWARD' };

const TYPES = [
    { id: 'int', label: 'INT', value: '42', color: '#00ffff', mesh: 'Box' },
    { id: 'str', label: 'STR', value: '"Hello"', color: '#ff00ff', mesh: 'Box' },
    { id: 'bool', label: 'BOOL', value: 'True', color: '#00ffaa', mesh: 'Sphere' },
    { id: 'float', label: 'FLOAT', value: '3.14', color: '#ffaa00', mesh: 'Sphere' },
];

const Variables = ({ onComplete, onAriaUpdate }) => {
    const [stage, setStage] = useState(STAGES.GAME);
    const [roundIndex, setRoundIndex] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [startTime] = useState(Date.now());
    const [streak, setStreak] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [shakeId, setShakeId] = useState(null);

    const challenges = CHALLENGES.variables;
    const currentChallenge = challenges[roundIndex];
    const isLastRound = roundIndex === challenges.length - 1;

    useEffect(() => {
        if (stage === STAGES.GAME) {
            onAriaUpdate(`Round ${roundIndex + 1}/${challenges.length} — ${currentChallenge.question}  |  Hint: ${currentChallenge.hint}`);
            setFeedback(null);
            setShakeId(null);
        }
    }, [stage, roundIndex, onAriaUpdate, currentChallenge, challenges.length]);

    const handleTypeClick = (type) => {
        if (stage !== STAGES.GAME) return;
        if (type.id === currentChallenge.target) {
            setStreak(s => s + 1);
            setFeedback({ correct: true, label: type.label });
            setTimeout(() => {
                if (isLastRound) setStage(STAGES.PYTHON);
                else setRoundIndex(r => r + 1);
            }, 900);
        } else {
            setWrongAttempts(prev => prev + 1);
            setStreak(0);
            setFeedback({ correct: false, label: type.label });
            setShakeId(type.id);
            // Reset shake after animation
            setTimeout(() => setShakeId(null), 400);
        }
    };

    return (
        <>
            <gridHelper args={[20, 20, '#1a1a2e', '#0d0d1a']} position={[0, -1.5, 0]} />
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 6, 0]} intensity={1.2} color="#00ffff" />

            {/* Round progress — top center */}
            <Html position={[0, 4.5, 0]} center>
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontFamily: 'monospace', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#888', letterSpacing: '3px', marginBottom: '6px' }}>ROUND {roundIndex + 1} / {challenges.length}</div>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {challenges.map((_, i) => (
                            <motion.div
                                key={i}
                                animate={i === roundIndex ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < roundIndex ? '#00ffaa' : i === roundIndex ? '#ffcc00' : '#222', boxShadow: i === roundIndex ? '0 0 8px #ffcc00' : 'none' }}
                            />
                        ))}
                    </div>
                </motion.div>
            </Html>

            {/* 4 type blocks */}
            {stage === STAGES.GAME && (
                <AnimatePresence mode="popLayout">
                    {TYPES.map((t, i) => {
                        const positions = [[-4.5, 0, 0], [-1.5, 0, 0], [1.5, 0, 0], [4.5, 0, 0]];
                        const isTarget = t.id === currentChallenge?.target;
                        const feedbackThis = feedback?.label === t.label;
                        const isShaking = shakeId === t.id;

                        return (
                            <motion.group
                                key={t.id}
                                position={positions[i]}
                                onClick={() => handleTypeClick(t)}
                                initial={{ scale: 0, y: 5 }}
                                animate={{
                                    scale: 1,
                                    y: 0,
                                    x: isShaking ? [0, -0.2, 0.2, -0.2, 0.2, 0] : 0
                                }}
                                transition={{
                                    delay: i * 0.1,
                                    type: 'spring',
                                    x: { duration: 0.4 }
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {t.mesh === 'Box' ? (
                                    <Box args={[1.5, 1.5, 1.5]}>
                                        <meshStandardMaterial
                                            color={feedbackThis ? (feedback.correct ? '#00ff88' : '#ff3333') : t.color}
                                            emissive={t.color}
                                            emissiveIntensity={(isTarget && !feedback) || feedbackThis ? 0.8 : 0.3}
                                            transparent opacity={0.9}
                                        />
                                    </Box>
                                ) : (
                                    <Sphere args={[0.9, 32, 32]}>
                                        <meshStandardMaterial
                                            color={feedbackThis ? (feedback.correct ? '#00ff88' : '#ff3333') : t.color}
                                            emissive={t.color}
                                            emissiveIntensity={(isTarget && !feedback) || feedbackThis ? 0.8 : 0.3}
                                            transparent opacity={0.9}
                                        />
                                    </Sphere>
                                )}
                                <Html distanceFactor={10} position={[0, -1.6, 0]}>
                                    <div style={{ textAlign: 'center', fontFamily: 'monospace', padding: '5px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.85)', border: `1px solid ${t.color}`, color: t.color, fontSize: '12px', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                                        <div style={{ fontWeight: 'bold', letterSpacing: '1px' }}>{t.label}</div>
                                        <div style={{ color: '#777', fontSize: '10px', marginTop: '2px' }}>{t.value}</div>
                                    </div>
                                </Html>
                            </motion.group>
                        );
                    })}
                </AnimatePresence>
            )}

            {stage === STAGES.PYTHON && (
                <TheoryOverlay
                    type="CODE"
                    title="PYTHON: DATA TYPES"
                    code={`# The 4 core Python types:\nname   = "Aria"   # str   → text\nage    = 25       # int   → whole number\nalive  = True     # bool  → True or False\nlr     = 0.001    # float → decimal\n\n# Check at runtime:\nprint(type(name))  # <class 'str'>\nprint(type(lr))    # <class 'float'>`}
                    onAction={() => setStage(STAGES.ML)}
                    actionLabel="SEE ML CONNECTION →"
                />
            )}

            {stage === STAGES.ML && (
                <TheoryOverlay
                    type="THEORY"
                    title="ML: WHY TYPES MATTER"
                    description={
                        <ul style={{ textAlign: 'left', paddingLeft: '16px', lineHeight: '1.9', fontSize: '13px' }}>
                            <li>🧠 <strong>Tensors</strong> in PyTorch need consistent types — mix float32 and int64 → runtime error.</li>
                            <li>📊 <strong>Encoding</strong>: strings like "cat" must be label-encoded to 0 before a model can use them.</li>
                            <li>⚡ <strong>Learning Rate</strong> is always a <code>float</code> — 0.001, not 1.</li>
                        </ul>
                    }
                    onAction={() => {
                        const timeTaken = (Date.now() - startTime) / 1000;
                        const xp = Math.round(50 + Math.max(0, 40 - timeTaken) + streak * 5);
                        setXpEarned(xp);
                        progressService.addXP(xp);
                        progressService.markMastery('variables');
                        setStage(STAGES.XP_AWARD);
                    }}
                    actionLabel="CLAIM XP →"
                />
            )}

            {stage === STAGES.XP_AWARD && (
                <TheoryOverlay type="SUCCESS" title="DATA TYPES MASTERED" subtitle="FOUNDATION LOCKED IN" xp={xpEarned} onAction={onComplete} actionLabel="NEXT MISSION →" />
            )}
        </>
    );
};

export default Variables;
