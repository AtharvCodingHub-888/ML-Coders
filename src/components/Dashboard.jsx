import React from 'react';

const Dashboard = ({ progress, onNodeClick }) => {
    const levels = [
        { id: 'variables', label: 'Lv.1: Python Basics', xp: 100, status: 'unlocked', color: 'var(--neon-cyan)' },
        { id: 'mean_variance', label: 'Lv.2: Statistical Mass', xp: 250, status: 'unlocked', color: '#ffcc00' },
        { id: 'vectors', label: 'Lv.3: Vector Math', xp: 450, status: 'unlocked', color: 'var(--neon-blue)' },
        { id: 'loops', label: 'Lv.4: Logic Loops', xp: 700, status: 'unlocked', color: 'var(--neon-magenta)' },
        { id: 'linear_regression', label: 'Lv.5: Predictive Fits', xp: 1000, status: 'unlocked', color: '#00ffaa' },
        { id: 'classification', label: 'Lv.6: Logical Boundaries', xp: 1400, status: 'unlocked', color: 'var(--neon-magenta)' },
        { id: 'neural_networks', label: 'Lv.7: Neural Core', xp: 1800, status: 'unlocked', color: '#ff0044' },
    ];

    return (
        <div className="roadmap-container">
            <h2 className="roadmap-title">Gamified Algorithm Track</h2>

            <div className="node-path">
                {levels.map((level, index) => (
                    <div
                        key={level.id}
                        className={`roadmap-node ${level.status}`}
                        onClick={() => level.status !== 'locked' && onNodeClick(level.id)}
                    >
                        <div className="node-circle" style={{ borderColor: level.color }}>
                            {level.status === 'locked' ? '🔒' : (index + 1)}
                        </div>
                        <div className="node-info">
                            <p style={{ fontWeight: '600', fontSize: '14px' }}>{level.label}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Requires {level.xp} XP</p>
                        </div>

                        {index < levels.length - 1 && (
                            <div style={{
                                position: 'absolute',
                                top: '40px',
                                left: '120px',
                                width: '40px',
                                height: '2px',
                                background: 'var(--glass-border)',
                                zIndex: -1
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <div className="progress-bar-footer glass-panel" style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ marginBottom: '10px' }}>Current XP: {progress.totalXP} / 1800</p>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${Math.min(100, (progress.totalXP / 1800) * 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta))',
                        boxShadow: '0 0 10px var(--neon-cyan)'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
