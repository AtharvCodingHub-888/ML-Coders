'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, MousePointer2, Info } from 'lucide-react';

const SIZE = 400;
const HALF = SIZE / 2;
const SCALE = 35; // Pixels per unit

export default function DotProductMatrix() {
    const [vecA, setVecA] = useState({ x: 3, y: 1 });
    const [vecB, setVecB] = useState({ x: 1, y: 3 });
    const [activeVec, setActiveVec] = useState<'A' | 'B' | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const dotProduct = useMemo(() => vecA.x * vecB.x + vecA.y * vecB.y, [vecA, vecB]);
    const magA = useMemo(() => Math.sqrt(vecA.x ** 2 + vecA.y ** 2), [vecA]);
    const magB = useMemo(() => Math.sqrt(vecB.x ** 2 + vecB.y ** 2), [vecB]);
    const angleRad = useMemo(() => Math.acos(dotProduct / (magA * magB || 1)), [dotProduct, magA, magB]);
    const angleDeg = (angleRad * 180) / Math.PI;

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!activeVec || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const rawX = (clientX - rect.left - HALF) / SCALE;
        const rawY = (HALF - (clientY - rect.top)) / SCALE;

        const clampedX = Math.round(Math.max(-5, Math.min(5, rawX)) * 2) / 2;
        const clampedY = Math.round(Math.max(-5, Math.min(5, rawY)) * 2) / 2;

        if (activeVec === 'A') setVecA({ x: clampedX, y: clampedY });
        else setVecB({ x: clampedX, y: clampedY });
    };

    const stopDrag = () => setActiveVec(null);

    // Color based on dot product
    const getThemeColor = () => {
        if (Math.abs(dotProduct) < 0.1) return 'white';
        return dotProduct > 0 ? '#ff00ff' : '#00f0ff';
    };

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-between bg-[#050b14]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-8 relative overflow-hidden font-mono shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchMove={handleMouseMove}
            onTouchEnd={stopDrag}
        >
            {/* Background Heat Map */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-300"
                style={{
                    background: `radial-gradient(circle at center, ${getThemeColor()}22 0%, transparent 70%)`
                }}
            />

            {/* Header HUD */}
            <div className="w-full flex justify-between items-start relative z-20">
                <div className="space-y-4">
                    <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                        <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1 leading-none">Dot Product Result</div>
                        <div
                            className="text-4xl font-black tracking-tighter tabular-nums leading-none transition-colors duration-300"
                            style={{ color: getThemeColor() }}
                        >
                            {dotProduct.toFixed(2)}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40">
                            A: [{vecA.x}, {vecA.y}]
                        </div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40">
                            B: [{vecB.x}, {vecB.y}]
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col items-end">
                    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1 leading-none">Alignment Angle</div>
                    <div className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">
                        {angleDeg.toFixed(1)}°
                    </div>
                </div>
            </div>

            {/* Vector Arena */}
            <div className="relative flex-grow flex items-center justify-center py-8">
                <svg
                    ref={svgRef}
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    className="overflow-visible cursor-crosshair"
                >
                    {/* Grid */}
                    <g opacity="0.05">
                        {Array.from({ length: 11 }).map((_, i) => (
                            <React.Fragment key={i}>
                                <line x1={0} y1={i * SCALE + (HALF % SCALE)} x2={SIZE} y2={i * SCALE + (HALF % SCALE)} stroke="white" strokeWidth="1" />
                                <line x1={i * SCALE + (HALF % SCALE)} y1={0} x2={i * SCALE + (HALF % SCALE)} y2={SIZE} stroke="white" strokeWidth="1" />
                            </React.Fragment>
                        ))}
                    </g>

                    {/* Axes */}
                    <line x1={0} y1={HALF} x2={SIZE} y2={HALF} stroke="white" strokeWidth="2" opacity="0.2" />
                    <line x1={HALF} y1={0} x2={HALF} y2={SIZE} stroke="white" strokeWidth="2" opacity="0.2" />

                    {/* Vector Lines */}
                    <path
                        d={`M ${HALF} ${HALF} L ${HALF + vecA.x * SCALE} ${HALF - vecA.y * SCALE}`}
                        stroke="#ff00ff" strokeWidth="4" strokeLinecap="round" opacity="0.8"
                    />
                    <path
                        d={`M ${HALF} ${HALF} L ${HALF + vecB.x * SCALE} ${HALF - vecB.y * SCALE}`}
                        stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" opacity="0.8"
                    />

                    {/* Interactive Handles */}
                    <circle
                        cx={HALF + vecA.x * SCALE} cy={HALF - vecA.y * SCALE} r="12"
                        fill="#ff00ff"
                        className="cursor-pointer transition-transform hover:scale-125"
                        onMouseDown={() => setActiveVec('A')}
                        onTouchStart={() => setActiveVec('A')}
                    />
                    <circle
                        cx={HALF + vecB.x * SCALE} cy={HALF - vecB.y * SCALE} r="12"
                        fill="#00f0ff"
                        className="cursor-pointer transition-transform hover:scale-125"
                        onMouseDown={() => setActiveVec('B')}
                        onTouchStart={() => setActiveVec('B')}
                    />

                    {/* Origin Dot */}
                    <circle cx={HALF} cy={HALF} r="4" fill="white" />
                </svg>

                {/* Legend */}
                <div className="absolute bottom-0 right-0 p-4 flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-[#ff00ff]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff00ff]" /> Vector A
                    </div>
                    <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-[#00f0ff]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" /> Vector B
                    </div>
                </div>
            </div>

            {/* Instructional Footer */}
            <div className="w-full pt-8 border-t border-white/5 flex flex-col gap-4 relative z-20">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <Info size={16} className="text-white/40 shrink-0" />
                    <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
                        The dot product quantifies the alignment of two vectors.
                        Maximize by aligning vectors (Parallel), minimize by opposing directions.
                        Orthogonal (90°) vectors result in zero displacement.
                    </p>
                </div>

                <div className="flex justify-between items-center opacity-20">
                    <div className="flex items-center gap-2">
                        <MousePointer2 size={10} />
                        <span className="text-[8px] uppercase tracking-[0.2em]">Drag Terminals to Calibrate</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.2em]">Scale: 1:1 Matrix</span>
                </div>
            </div>
        </div>
    );
}
