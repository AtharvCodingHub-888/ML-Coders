"use client";

import { useState, useMemo } from "react";
import TopNav from "@/components/TopNav";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";

// ── Cluster color palette ───────────────────────────────────────────────
const CLUSTER_COLORS = ["#22d3ee", "#a855f7", "#ec4899", "#22c55e", "#eab308"];

// ── 3D Point interface ──────────────────────────────────────────────────
interface Point3D {
    x: number;
    y: number;
    z: number;
    cluster: number;
}

// ── Seeded random for cluster centers ───────────────────────────────────
function generatePoints(
    numPoints: number,
    clusters: number,
    spread: number
): Point3D[] {
    const points: Point3D[] = [];

    // Generate cluster centers
    const centers = Array.from({ length: clusters }, (_, i) => {
        const angle = (i / clusters) * Math.PI * 2;
        const radius = spread * 0.8;
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: (Math.random() - 0.5) * spread * 0.5,
        };
    });

    for (let i = 0; i < numPoints; i++) {
        const clusterIdx = i % clusters;
        const center = centers[clusterIdx];
        const gaussSpread = spread * 0.3;

        points.push({
            x: center.x + (Math.random() - 0.5) * gaussSpread * 2,
            y: center.y + (Math.random() - 0.5) * gaussSpread * 2,
            z: center.z + (Math.random() - 0.5) * gaussSpread * 2,
            cluster: clusterIdx,
        });
    }

    return points;
}

// ── Individual Data Sphere Component ────────────────────────────────────
function DataSphere({ position, color }: { position: [number, number, number]; color: string }) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
                emissive={color}
                emissiveIntensity={0.8}
                color={color}
                toneMapped={false}
            />
        </mesh>
    );
}

// ── Slider Component ────────────────────────────────────────────────────
function GlassSlider({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className="text-sm font-bold text-cyan-400 tabular-nums">
                    {value}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-cyan-400
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-cyan-400
                    [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(34,211,238,0.6)]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-white/30
                    [&::-webkit-slider-thumb]:transition-shadow
                    [&::-webkit-slider-thumb]:hover:shadow-[0_0_25px_rgba(34,211,238,0.9)]
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-cyan-400
                    [&::-moz-range-thumb]:shadow-[0_0_15px_rgba(34,211,238,0.6)]
                    [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white/30
                    [&::-moz-range-track]:bg-white/10
                    [&::-moz-range-track]:rounded-full
                    [&::-moz-range-track]:h-2"
            />
        </div>
    );
}

// ── Main Page ───────────────────────────────────────────────────────────
export default function PlaygroundPage() {
    const [numPoints, setNumPoints] = useState(200);
    const [clusters, setClusters] = useState(3);
    const [spread, setSpread] = useState(5);

    // Memoize the 3D points so they only regenerate when params change
    const points = useMemo(
        () => generatePoints(numPoints, clusters, spread),
        [numPoints, clusters, spread]
    );

    // Compute centroids (average position) for each cluster
    const centroids = useMemo(() => {
        const sums: { x: number; y: number; z: number; count: number }[] = Array.from(
            { length: clusters },
            () => ({ x: 0, y: 0, z: 0, count: 0 })
        );
        for (const p of points) {
            sums[p.cluster].x += p.x;
            sums[p.cluster].y += p.y;
            sums[p.cluster].z += p.z;
            sums[p.cluster].count += 1;
        }
        return sums.map((s) => ({
            x: s.count ? s.x / s.count : 0,
            y: s.count ? s.y / s.count : 0,
            z: s.count ? s.z / s.count : 0,
            count: s.count,
        }));
    }, [points, clusters]);

    return (
        <div className="min-h-screen bg-[#05050B] text-white overflow-hidden">
            {/* Top Navigation */}
            <TopNav />

            {/* Split Layout — below TopNav */}
            <div className="flex h-[calc(100vh-64px)] mt-16">
                {/* ── LEFT: Control Panel ────────────────────────── */}
                <motion.div
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="w-[30%] min-w-[320px] flex flex-col gap-6 p-6 h-full border-r border-white/10 bg-black/20 backdrop-blur-xl z-10 overflow-y-auto"
                >
                    {/* Title */}
                    <div>
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                            3D Sandbox: K-Means Clustering
                        </h2>
                        <p className="text-xs text-white/40 mt-1">
                            Adjust parameters to visualize clustering in real-time
                        </p>
                    </div>

                    {/* Python Console */}
                    <div className="bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-xs leading-relaxed">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            <span className="text-white/30 ml-2 text-[10px]">
                                python console
                            </span>
                        </div>
                        <code className="text-cyan-300">
                            <span className="text-purple-400">from</span>{" "}
                            sklearn.cluster{" "}
                            <span className="text-purple-400">import</span>{" "}
                            KMeans
                            <br />
                            <span className="text-purple-400">import</span>{" "}
                            numpy{" "}
                            <span className="text-purple-400">as</span> np
                            <br />
                            <br />
                            <span className="text-gray-500"># Generate data</span>
                            <br />
                            X = np.random.randn(
                            <span className="text-yellow-300">{numPoints}</span>,{" "}
                            <span className="text-yellow-300">3</span>) *{" "}
                            <span className="text-yellow-300">{spread}</span>
                            <br />
                            <br />
                            <span className="text-gray-500"># Fit model</span>
                            <br />
                            model = KMeans(
                            <br />
                            {"    "}n_clusters=
                            <span className="text-yellow-300">{clusters}</span>,
                            <br />
                            {"    "}n_init=
                            <span className="text-yellow-300">10</span>
                            <br />
                            )
                            <br />
                            model.fit(X)
                            <br />
                            <br />
                            <span className="text-gray-500"># Results</span>
                            <br />
                            <span className="text-green-400">
                                ✓ {numPoints} points clustered
                            </span>
                            <br />
                            <span className="text-green-400">
                                ✓ {clusters} centroids found
                            </span>
                            <br />
                            <span className="text-green-400">
                                ✓ Spread factor: {spread}
                            </span>
                        </code>
                    </div>

                    {/* Sliders */}
                    <div className="flex flex-col gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                        <GlassSlider
                            label="Number of Points"
                            value={numPoints}
                            min={50}
                            max={500}
                            onChange={setNumPoints}
                        />
                        <GlassSlider
                            label="Clusters"
                            value={clusters}
                            min={2}
                            max={5}
                            onChange={setClusters}
                        />
                        <GlassSlider
                            label="Spread"
                            value={spread}
                            min={1}
                            max={10}
                            onChange={setSpread}
                        />
                    </div>

                    {/* Legend */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                        <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wider">
                            Cluster Legend
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {Array.from({ length: clusters }, (_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: CLUSTER_COLORS[i],
                                            boxShadow: `0 0 10px ${CLUSTER_COLORS[i]}80`,
                                        }}
                                    />
                                    <span className="text-xs text-gray-300">
                                        Cluster {i + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-auto p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/10">
                        <p className="text-[11px] text-cyan-300/60 leading-relaxed">
                            💡 <strong>Tip:</strong> Drag to rotate the 3D view.
                            Scroll to zoom. The canvas auto-rotates — click
                            and hold to pause.
                        </p>
                    </div>
                </motion.div>

                {/* ── RIGHT: 3D Canvas ───────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    className="relative flex-1 h-full w-full"
                >
                    {/* Subtle grid overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03)_0%,transparent_70%)] pointer-events-none z-10" />

                    <Canvas
                        camera={{ position: [0, 0, 15], fov: 60 }}
                        gl={{ antialias: true, alpha: true }}
                        style={{ background: "transparent" }}
                    >
                        <ambientLight intensity={0.5} />
                        <pointLight
                            position={[10, 10, 10]}
                            intensity={1}
                            color="#ffffff"
                        />
                        <pointLight
                            position={[-10, -10, 5]}
                            intensity={0.3}
                            color="#22d3ee"
                        />

                        <OrbitControls
                            makeDefault
                            autoRotate
                            autoRotateSpeed={0.5}
                            enableDamping
                            dampingFactor={0.05}
                        />

                        {/* Data Cloud */}
                        {points.map((point, i) => (
                            <DataSphere
                                key={`${numPoints}-${clusters}-${spread}-${i}`}
                                position={[point.x, point.y, point.z]}
                                color={CLUSTER_COLORS[point.cluster]}
                            />
                        ))}

                        {/* Floating Centroid Labels */}
                        {centroids.map((c, i) => (
                            <Html
                                key={`centroid-${i}`}
                                position={[c.x, c.y + 1.2, c.z]}
                                center
                                zIndexRange={[100, 0]}
                                style={{ pointerEvents: "none" }}
                            >
                                <div className="bg-[#0A0A12]/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap flex flex-col items-center">
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor: CLUSTER_COLORS[i],
                                                boxShadow: `0 0 8px ${CLUSTER_COLORS[i]}`,
                                            }}
                                        />
                                        <span className="text-xs font-bold text-white">
                                            Cluster {i + 1}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-0.5">
                                        {c.count} points · centroid
                                    </span>
                                </div>
                            </Html>
                        ))}

                        {/* Subtle grid helper */}
                        <gridHelper
                            args={[20, 20, "#ffffff08", "#ffffff04"]}
                            rotation={[Math.PI / 2, 0, 0]}
                        />
                    </Canvas>

                    {/* Floating stats overlay */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute bottom-6 right-6 flex gap-4 z-20"
                    >
                        <div className="px-4 py-2 rounded-xl backdrop-blur-xl bg-black/50 border border-white/10 text-xs font-medium text-gray-300">
                            Points:{" "}
                            <span className="text-cyan-400 font-bold">
                                {numPoints}
                            </span>
                        </div>
                        <div className="px-4 py-2 rounded-xl backdrop-blur-xl bg-black/50 border border-white/10 text-xs font-medium text-gray-300">
                            Clusters:{" "}
                            <span className="text-purple-400 font-bold">
                                {clusters}
                            </span>
                        </div>
                        <div className="px-4 py-2 rounded-xl backdrop-blur-xl bg-black/50 border border-white/10 text-xs font-medium text-gray-300">
                            Spread:{" "}
                            <span className="text-pink-400 font-bold">
                                {spread}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
