"use client";

import Link from "next/link";
import TopNav from "@/components/TopNav";
import { Eye, Gamepad2, Cpu } from "lucide-react";
import { motion } from "framer-motion";

// ── Pillar card data ────────────────────────────────────────────────────
const pillars = [
    {
        icon: Eye,
        color: "cyan",
        title: "Visual Sandbox",
        description:
            "See the math unfold. Watch tensors multiply and clusters form in real-time WebGL.",
        borderBase: "border-cyan-500/30",
        borderHover: "hover:border-cyan-400",
        iconColor: "text-cyan-400",
        glowShadow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
        href: "/dashboard/playground",
    },
    {
        icon: Gamepad2,
        color: "purple",
        title: "Gamified Progression",
        description:
            "Earn XP, level up, and unlock advanced neural network architectures as you learn.",
        borderBase: "border-purple-500/30",
        borderHover: "hover:border-purple-400",
        iconColor: "text-purple-400",
        glowShadow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
        href: "/dashboard/gamified",
    },
    {
        icon: Cpu,
        color: "pink",
        title: "Built for Engineers",
        description:
            "No abstracted fluff. Learn the underlying calculus, linear algebra, and pure Python.",
        borderBase: "border-pink-500/30",
        borderHover: "hover:border-pink-400",
        iconColor: "text-pink-400",
        glowShadow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
        href: "/dashboard",
    },
];

// ── Framer Motion variants ──────────────────────────────────────────────
const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut", delay: i * 0.15 },
    }),
};

const gridContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.6 },
    },
};

const cardVariant = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const ctaVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut", delay: 1.2 },
    },
};

// ── Page Component ──────────────────────────────────────────────────────
export default function AboutPage() {
    return (
        <div className="min-h-screen relative w-full overflow-y-auto text-white">
            {/* ── Background layers ──────────────────────────────── */}
            <div className="absolute inset-0 -z-10 bg-[url('/about-bg.png')] bg-cover bg-center opacity-40 mix-blend-screen fixed" />
            <div className="absolute inset-0 -z-10 bg-black/60 fixed" />

            {/* ── Navigation ─────────────────────────────────────── */}
            <TopNav />

            {/* ═══════════════════════════════════════════════════════
                1. HERO — The Vision
            ═══════════════════════════════════════════════════════ */}
            <section className="max-w-5xl mx-auto px-8 pt-28 pb-12 flex flex-col items-center text-center">
                <motion.h1
                    custom={0}
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tight mb-6"
                >
                    REDEFINING ML EDUCATION
                </motion.h1>

                <motion.p
                    custom={1}
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-xl text-white/60 max-w-2xl font-light leading-relaxed"
                >
                    We believe complex mathematical models shouldn&apos;t be
                    hidden in flat textbooks. ELEARN ML brings algorithms to
                    life in interactive, real-time 3D environments.
                </motion.p>

                {/* Decorative gradient line */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="w-32 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full mt-10 mb-16"
                />
            </section>

            {/* ═══════════════════════════════════════════════════════
                2. THREE PILLARS
            ═══════════════════════════════════════════════════════ */}
            <motion.section
                variants={gridContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-8 mb-24"
            >
                {pillars.map((pillar) => (
                    <motion.div
                        key={pillar.title}
                        variants={cardVariant}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="cursor-pointer"
                    >
                        <Link href={pillar.href}>
                            <div
                                className={`group bg-white/[0.02] backdrop-blur-3xl border ${pillar.borderBase} ${pillar.borderHover} rounded-3xl p-8 flex flex-col items-start gap-4 transition-all duration-500 hover:bg-white/[0.05] ${pillar.glowShadow} h-full`}
                            >
                                {/* Icon container */}
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center ${pillar.iconColor} group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <pillar.icon size={28} />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white tracking-tight">
                                    {pillar.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-white/50 leading-relaxed">
                                    {pillar.description}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.section>

            {/* ═══════════════════════════════════════════════════════
                3. CTA — Join the Mission
            ═══════════════════════════════════════════════════════ */}
            <motion.section
                variants={ctaVariant}
                initial="hidden"
                animate="visible"
                className="max-w-5xl mx-auto px-8 mb-20"
            >
                <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between backdrop-blur-xl gap-8">
                    {/* Left text */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            Ready to change how you learn?
                        </h2>
                        <p className="text-white/50 text-sm">
                            Join our open-source community or discord.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <motion.a
                        href="https://discord.gg/FGRcCgsk"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow shrink-0 cursor-pointer"
                    >
                        Join Discord 🚀
                    </motion.a>
                </div>
            </motion.section>

            {/* ── Footer ─────────────────────────────────────────── */}
            <footer className="max-w-5xl mx-auto px-8 pb-12 pt-4 border-t border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
                    <p className="text-xs">
                        © 2026 ELEARN ML — Premium Educational Experience
                    </p>
                    <div className="flex gap-6 text-xs uppercase tracking-widest font-bold">
                        <a
                            href="#"
                            className="hover:text-cyan-400 transition-colors"
                        >
                            Documentation
                        </a>
                        <a
                            href="#"
                            className="hover:text-cyan-400 transition-colors"
                        >
                            Support
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
