import React from 'react';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TheoryOverlay
 * A reusable UI component for Protocol intros and Code Previews within 3D levels.
 */
const TheoryOverlay = ({
    type = 'INTRO', // 'INTRO', 'CODE', 'SUCCESS'
    title,
    subtitle,
    description,
    code,
    onAction,
    actionLabel,
    xp,
    accuracy,
    successCount,
    successTarget = 3
}) => {
    const overlayVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 300 }
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    const containerStyle = { pointerEvents: 'auto', zIndex: 1000 };

    return (
        <AnimatePresence mode="wait">
            {type === 'INTRO' && (
                <Html center key="intro">
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="ui-panel glass-panel scanline-container"
                        style={{ ...containerStyle, width: '420px', textAlign: 'center' }}
                    >
                        <h2 className="glitch-text" style={{ color: 'var(--neon-cyan)', fontSize: '28px', marginBottom: '10px', textTransform: 'uppercase' }}>{title}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '12px' }}>{subtitle}</p>
                        <div style={{ marginBottom: '30px', fontSize: '14px', lineHeight: '1.6', color: '#888' }}>
                            {description}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 255, 255, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onAction}
                            className="neon-button"
                            style={{ width: '100%', padding: '15px' }}
                        >
                            {actionLabel || 'INITIALIZE'}
                        </motion.button>
                    </motion.div>
                </Html>
            )}

            {type === 'CODE' && (
                <Html position={[6, 3, 0]} key="code">
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="glass-panel"
                        style={{ ...containerStyle, width: '280px', padding: '20px' }}
                    >
                        <h4 style={{ color: 'var(--neon-magenta)', marginBottom: '15px', fontSize: '12px', textTransform: 'uppercase' }}>{title || 'LOGIC_DEBUGGER'}</h4>
                        {code && (
                            <pre style={{
                                background: 'rgba(0,0,0,0.5)',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                color: '#00ffaa',
                                border: '1px solid #333',
                                fontFamily: 'monospace',
                                marginBottom: onAction ? '15px' : '0'
                            }}>
                                <code>{code}</code>
                            </pre>
                        )}
                        {accuracy !== undefined && (
                            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ACCURACY</span>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: accuracy >= 90 ? '#00ffaa' : '#ff4444' }}>{accuracy.toFixed(1)}%</span>
                            </div>
                        )}
                        {onAction && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onAction}
                                className="neon-button"
                                style={{ width: '100%' }}
                            >
                                {actionLabel || 'EXECUTE'}
                            </motion.button>
                        )}
                    </motion.div>
                </Html>
            )}

            {type === 'THEORY' && (
                <Html center key="theory">
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="ui-panel glass-panel scanline-container"
                        style={{ ...containerStyle, width: '400px', textAlign: 'center', border: '1px solid var(--neon-cyan)' }}
                    >
                        <h2 style={{ color: 'var(--neon-cyan)', fontSize: '24px', marginBottom: '15px', textTransform: 'uppercase' }}>{title || 'ML_CONTEXT'}</h2>
                        <div style={{ marginBottom: '25px', fontSize: '14px', lineHeight: '1.6', color: '#ccc', textAlign: 'left' }}>
                            {description}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onAction}
                            className="neon-button"
                            style={{ width: '100%' }}
                        >
                            {actionLabel || 'FINALIZE MISSION'}
                        </motion.button>
                    </motion.div>
                </Html>
            )}

            {type === 'SUCCESS' && (
                <Html center key="success">
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="ui-panel glass-panel scanline-container"
                        style={{ ...containerStyle, width: '380px', textAlign: 'center' }}
                    >
                        <h2 style={{ color: '#ffcc00', letterSpacing: '4px', textTransform: 'uppercase' }}>{title || 'MISSION_COMPLETE'}</h2>
                        <div style={{ margin: '30px 0' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{subtitle || 'EXPERIENCE HARVESTED'}</div>
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="glitch-text"
                                style={{ fontSize: '48px', fontWeight: 'bold', color: '#ffcc00' }}
                            >
                                +{xp} XP
                            </motion.div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onAction}
                            className="neon-button"
                            style={{ width: '100%' }}
                        >
                            {actionLabel || 'EXIT'}
                        </motion.button>
                    </motion.div>
                </Html>
            )}
        </AnimatePresence>
    );
};

export default TheoryOverlay;
