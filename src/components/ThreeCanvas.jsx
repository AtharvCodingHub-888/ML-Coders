import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingCamera = () => {
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        state.camera.position.x = 5 + Math.sin(t / 4) * 0.5;
        state.camera.position.y = 5 + Math.cos(t / 3) * 0.5;
        state.camera.lookAt(0, 0, 0);
    });
    return null;
};

const BackgroundParticles = () => {
    const pointsRef = useRef();
    const particleCount = 1500;

    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return pos;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = t / 25;
        pointsRef.current.rotation.x = t / 35;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#00ffff"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.3}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const ThreeCanvas = ({ children }) => {
    return (
        <div style={{ width: '100vw', height: '100vh', background: '#020205', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
            <Canvas
                camera={{ position: [5, 5, 10], fov: 45 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={['#020205']} />
                <fog attach="fog" args={['#020205', 10, 50]} />

                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
                <pointLight position={[-10, -5, -10]} intensity={0.6} color="#ff00ff" />

                <Suspense fallback={null}>
                    <BackgroundParticles />
                    <FloatingCamera />
                    {children}
                </Suspense>

                <OrbitControls makeDefault enablePan={false} maxDistance={25} minDistance={4} />
            </Canvas>
        </div>
    );
};

export default ThreeCanvas;
