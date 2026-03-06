"use client";

import TopNav from "@/components/TopNav";
import { Gem } from "lucide-react";
import { motion } from "framer-motion";

// ── Level data ──────────────────────────────────────────────────────────
interface Level {
    id: number;
    label: string;
    title: string;
    xp: number;
    color: "cyan" | "purple";
    left: string;
    top: string;
}

const levels: Level[] = [
    { id: 1, label: "Lv.1", title: "Python Basics", xp: 100, color: "cyan", left: "10%", top: "60%" },
    { id: 2, label: "Lv.2", title: "Vector Math", xp: 250, color: "cyan", left: "30%", top: "40%" },
    { id: 3, label: "Lv.3", title: "Data Processing", xp: 500, color: "cyan", left: "50%", top: "48%" },
    { id: 4, label: "Lv.4", title: "Linear Regression", xp: 750, color: "purple", left: "70%", top: "35%" },
    { id: 5, label: "Lv.5", title: "Neural Networks", xp: 1300, color: "purple", left: "90%", top: "45%" },
];

// ── SVG curved-track path ───────────────────────────────────────────────
const TRACK_PATH =
    "M 80 240 C 200 360, 320 100, 480 200 S 760 100, 900 180 Q 980 220, 1100 200";

// ── Component ───────────────────────────────────────────────────────────
export default function GamifiedTrackPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden text-white">
            {/* ── Background layers ──────────────────────────────────── */}
            <div className="absolute inset-0 -z-10 bg-[url('/gamified-bg.jpeg')] bg-cover bg-center opacity-80" />
            <div className="absolute inset-0 -z-10 bg-black/40" />

            {/* ── Top Navigation ─────────────────────────────────────── */}
            <TopNav />

            {/* ── Page Title ─────────────────────────────────────────── */}
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 tracking-wide mt-28 mb-20 text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                GAMIFIED ALGORITHM TRACK
            </motion.h1>

            {/* ── Track Container (SVG + Nodes) ──────────────────────── */}
            <div className="relative w-full max-w-6xl mx-auto h-[400px]">
                {/* Curved glowing SVG line */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1200 400"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <filter id="glowFilter">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* glow shadow layer */}
                    <motion.path
                        d={TRACK_PATH}
                        stroke="url(#trackGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="none"
                        filter="url(#glowFilter)"
                        opacity={0.35}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                    />

                    {/* main line */}
                    <motion.path
                        d={TRACK_PATH}
                        stroke="url(#trackGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        filter="url(#glowFilter)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                </svg>

                {/* ── Level Nodes ───────────────────────────────────────── */}
                {levels.map((level, i) => {
                    const isCyan = level.color === "cyan";

                    return (
                        <motion.div
                            key={level.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                delay: 0.6 + i * 0.25,
                                duration: 0.5,
                                type: "spring",
                                stiffness: 180,
                                damping: 14,
                            }}
                            className="absolute flex flex-col items-center"
                            style={{
                                left: level.left,
                                top: level.top,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            {/* Diamond icon */}
                            <div
                                className={`w-16 h-16 rounded-xl rotate-45 backdrop-blur-md border-2 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 ${isCyan
                                    ? "border-cyan-400/50 bg-cyan-900/20 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                                    : "border-purple-500/50 bg-purple-900/20 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                                    }`}
                            >
                                <Gem
                                    size={28}
                                    className={`-rotate-45 ${isCyan ? "text-cyan-300" : "text-purple-300"
                                        }`}
                                />
                            </div>

                            {/* Label + Title */}
                            <span
                                className={`mt-3 text-xs font-bold tracking-widest uppercase ${isCyan ? "text-cyan-400" : "text-purple-400"
                                    }`}
                            >
                                {level.label}
                            </span>
                            <span
                                className={`text-sm font-semibold ${isCyan ? "text-cyan-100" : "text-purple-100"
                                    }`}
                            >
                                {level.title}
                            </span>

                            {/* XP Pill */}
                            <div
                                className={`mt-3 px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border text-sm font-semibold ${isCyan
                                    ? "border-cyan-400/30 text-cyan-300"
                                    : "border-purple-500/30 text-purple-300"
                                    }`}
                            >
                                {level.xp} XP
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Bottom Status Bar ─────────────────────────────────── */}
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-[#0A0A12]/80 border border-cyan-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(34,211,238,0.15)] mb-10 mt-16 z-20"
            >
                {/* Current Level */}
                <div className="flex items-baseline gap-2 shrink-0">
                    <span className="text-gray-300 text-sm font-medium">Current Level:</span>
                    <span className="text-3xl font-extrabold text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                        2
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative flex-1 w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "35%" }}
                        transition={{ delay: 2.6, duration: 1.2, ease: "easeOut" }}
                        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full rounded-full relative"
                    >
                        {/* Leading glow light */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 blur-md" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white" />
                    </motion.div>
                </div>

                {/* Total XP */}
                <div className="flex items-baseline gap-2 shrink-0">
                    <span className="text-gray-300 text-sm font-medium">Total XP:</span>
                    <span className="text-3xl font-extrabold text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
                        450
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
