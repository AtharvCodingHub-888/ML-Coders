import React, { useState, useEffect, lazy, Suspense } from 'react';
import ThreeCanvas from './ThreeCanvas';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AriaTutor from './AriaTutor';
import progressService from '../services/progressService';

// Lazy-load all heavy 3D level components — only loaded when user enters that level
const Variables = lazy(() => import('../concepts/level1/Variables'));
const MeanVariance = lazy(() => import('../concepts/level1/MeanVariance'));
const Vectors = lazy(() => import('../concepts/level1/Vectors'));
const Loops = lazy(() => import('../concepts/level2/Loops'));
const LinearRegression = lazy(() => import('../concepts/level3/LinearRegression'));
const Classification = lazy(() => import('../concepts/level3/Classification'));
const NeuralNetworks = lazy(() => import('../concepts/level4/NeuralNetworks'));

const LoadingLevel = () => (
    <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} wireframe />
    </mesh>
);

const GameContainer = () => {
    const [progress, setProgress] = useState(progressService.getProgress());
    const [activeView, setActiveView] = useState('dashboard');
    const [currentConcept, setCurrentConcept] = useState('variables');
    const [ariaMessage, setAriaMessage] = useState('');

    useEffect(() => {
        setProgress(progressService.getProgress());
    }, []);

    const handleLevelSelect = (levelId) => {
        setCurrentConcept(levelId);
        setAriaMessage('');
        setActiveView('game');
    };

    const handleComplete = () => {
        const updated = progressService.getProgress();
        setProgress(updated);
        setActiveView('dashboard');
        setAriaMessage('');
    };

    const renderGameContent = () => {
        const props = { onComplete: handleComplete, onAriaUpdate: setAriaMessage };
        switch (currentConcept) {
            case 'variables': return <Variables {...props} />;
            case 'mean_variance': return <MeanVariance {...props} />;
            case 'vectors': return <Vectors {...props} />;
            case 'loops': return <Loops {...props} />;
            case 'linear_regression': return <LinearRegression {...props} />;
            case 'classification': return <Classification {...props} />;
            case 'neural_networks': return <NeuralNetworks {...props} />;
            default: return <Variables {...props} />;
        }
    };

    return (
        <div className="app-container">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />

            <div className="main-content">
                {activeView === 'game' ? (
                    <div className="canvas-wrapper">
                        <ThreeCanvas>
                            <Suspense fallback={<LoadingLevel />}>
                                {renderGameContent()}
                            </Suspense>
                        </ThreeCanvas>
                        {/* UI overlays on top of canvas */}
                        <div className="global-game-ui" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                            <div style={{ position: 'absolute', top: '20px', left: '20px', pointerEvents: 'auto' }}>
                                <button
                                    onClick={() => setActiveView('dashboard')}
                                    className="neon-button"
                                    style={{ padding: '8px 15px', fontSize: '12px' }}
                                >
                                    ← Exit Mission
                                </button>
                            </div>
                            <AriaTutor message={ariaMessage} />
                        </div>
                    </div>
                ) : (
                    <div className="ui-content" style={{ zIndex: 1, padding: '40px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px' }}>
                                ELEARN ML / DASHBOARD
                            </div>
                            <div className="glass-panel" style={{ color: '#ffcc00', padding: '5px 15px', fontFamily: 'monospace' }}>
                                🔥 {progress.totalXP} XP
                            </div>
                        </div>

                        {activeView === 'dashboard' ? (
                            <Dashboard progress={progress} onNodeClick={handleLevelSelect} />
                        ) : (
                            <div className="glass-panel">
                                <h2>Coming Soon</h2>
                                <button onClick={() => setActiveView('dashboard')} className="neon-button">Back to Dashboard</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameContainer;
