import React, { useEffect, useState } from 'react';

const AriaTutor = ({ message }) => {
    const [displayed, setDisplayed] = useState('');
    const [visible, setVisible] = useState(false);
    const [key, setKey] = useState(0);

    // Typewriter effect whenever message changes
    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }

        setVisible(true);
        setDisplayed('');
        setKey(k => k + 1);

        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(message.slice(0, i + 1));
            i++;
            if (i >= message.length) clearInterval(interval);
        }, 18);

        return () => clearInterval(interval);
    }, [message]);

    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            gap: '14px',
            maxWidth: '680px',
            width: 'calc(100vw - 80px)',
            animation: visible ? 'ariaSlideUp 0.35s ease-out' : 'none',
            pointerEvents: 'none',
        }}>
            <style>{`
                @keyframes ariaSlideUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0);   }
                }
                @keyframes ariaPulse {
                    0%,100% { box-shadow: 0 0 8px #00ffff, 0 0 20px #00ffff44; }
                    50%     { box-shadow: 0 0 16px #00ffff, 0 0 40px #00ffff88; }
                }
            `}</style>

            {/* Avatar */}
            <div style={{
                flexShrink: 0,
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #001a1a, #002233)',
                border: '2px solid #00ffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                animation: 'ariaPulse 2.5s infinite',
            }}>
                🤖
            </div>

            {/* Speech bubble */}
            <div style={{
                flex: 1,
                background: 'rgba(0, 8, 20, 0.92)',
                border: '1px solid rgba(0, 255, 255, 0.4)',
                borderRadius: '12px 12px 12px 2px',
                padding: '12px 18px',
                backdropFilter: 'blur(12px)',
                position: 'relative',
            }}>
                {/* Name tag */}
                <div style={{
                    fontSize: '10px',
                    color: '#00ffff',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '5px',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffff', display: 'inline-block', boxShadow: '0 0 6px #00ffff' }} />
                    ARIA · AI Tutor
                </div>

                {/* Message with typewriter */}
                <p style={{
                    fontSize: '13px',
                    color: '#e0e0e0',
                    lineHeight: '1.6',
                    margin: 0,
                    fontFamily: 'monospace',
                    minHeight: '20px',
                }}>
                    {displayed}
                    <span style={{ opacity: displayed.length < (message?.length || 0) ? 1 : 0, color: '#00ffff' }}>▋</span>
                </p>

                {/* Bubble tail */}
                <div style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '-8px',
                    width: '0',
                    height: '0',
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderRight: '8px solid rgba(0,255,255,0.4)',
                }} />
            </div>
        </div>
    );
};

export default AriaTutor;
