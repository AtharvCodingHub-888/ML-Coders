"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    GraduationCap,
    Map,
    Gamepad2,
    PlayCircle,
    Info,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/SidebarContext";

// ── Sidebar menu items ──────────────────────────────────────────────────
const menuLinks = [
    { name: "My Journey", href: "/dashboard", icon: Map, accent: "cyan" },
    { name: "Gamified Algorithm", href: "/dashboard/gamified", icon: Gamepad2, accent: "purple" },
    { name: "Code Playground", href: "/dashboard/playground", icon: PlayCircle, accent: "pink" },
    { name: "About Us", href: "/about", icon: Info, accent: "amber" },
];

// ── Accent color lookup ──────────────────────────────────────────────────
const accentMap: Record<string, { text: string; glow: string; bar: string; bg: string; shadow: string }> = {
    cyan: {
        text: "text-cyan-400",
        glow: "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
        bar: "bg-cyan-400",
        bg: "bg-cyan-400/10",
        shadow: "shadow-[0_0_20px_rgba(34,211,238,0.6)]",
    },
    purple: {
        text: "text-purple-400",
        glow: "drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]",
        bar: "bg-purple-400",
        bg: "bg-purple-400/10",
        shadow: "shadow-[0_0_20px_rgba(168,85,247,0.6)]",
    },
    pink: {
        text: "text-pink-400",
        glow: "drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]",
        bar: "bg-pink-400",
        bg: "bg-pink-400/10",
        shadow: "shadow-[0_0_20px_rgba(236,72,153,0.6)]",
    },
    amber: {
        text: "text-yellow-400",
        glow: "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
        bar: "bg-yellow-400",
        bg: "bg-yellow-400/10",
        shadow: "shadow-[0_0_20px_rgba(250,204,21,0.6)]",
    },
};

// ── Item hover wave animation ────────────────────────────────────────────
const itemFloat = {
    rest: { x: 0, scale: 1 },
    hover: {
        x: [0, 4, 0, 2, 0],
        scale: 1.04,
        transition: {
            x: { duration: 0.7, ease: "easeInOut" },
            scale: { duration: 0.2 },
        },
    },
};

export default function UniversalSidebar() {
    const pathname = usePathname();
    const { expanded, setExpanded } = useSidebar();

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className={`fixed left-0 top-0 h-full z-50 flex flex-col border-r border-white/10 bg-[#060610]/70 backdrop-blur-2xl transition-all duration-300 ${expanded ? "w-64" : "w-20"
                }`}
        >
            {/* ── Logo ───────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-3 group p-6 pb-4">
                <GraduationCap className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <AnimatePresence>
                    {expanded && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden"
                        >
                            ELEARN ML
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* ── Collapse / Expand Toggle ────────────────────── */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0a0a18] border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-cyan-400/50 transition-all z-50 cursor-pointer"
            >
                {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* ── Navigation ──────────────────────────────────── */}
            <nav className="flex flex-col gap-1.5 px-3 mt-6">
                {menuLinks.map((link) => {
                    const isActive =
                        pathname === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href));
                    const colors = accentMap[link.accent];

                    return (
                        <motion.div
                            key={link.name}
                            variants={itemFloat}
                            initial="rest"
                            whileHover="hover"
                        >
                            <Link
                                href={link.href}
                                className={`relative flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                                        ? `text-white ${colors.bg}`
                                        : "text-white/55 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                                title={!expanded ? link.name : undefined}
                            >
                                {/* Wave glow overlay on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-transparent rounded-xl pointer-events-none" />

                                {/* Icon */}
                                <link.icon
                                    className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActive
                                            ? `${colors.text} ${colors.glow}`
                                            : "text-white/50 group-hover:text-white group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                                        }`}
                                />

                                {/* Label */}
                                <AnimatePresence>
                                    {expanded && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {link.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Active glow bar (left edge) */}
                                {isActive && (
                                    <>
                                        <div
                                            className={`absolute left-0 w-[3px] h-7 rounded-r-full ${colors.bar} ${colors.shadow}`}
                                        />
                                        <motion.div
                                            className={`absolute left-0 w-4 h-4 rounded-full ${colors.bar} opacity-20 blur-md`}
                                        />
                                        {expanded && (
                                            <motion.div
                                                className={`ml-auto w-2 h-2 rounded-full ${colors.bar} shrink-0`}
                                                animate={{
                                                    scale: [1, 1.5, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* ── Bottom Progress Card ────────────────────────── */}
            <div className="mt-auto p-4">
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.05] transition-colors"
                        >
                            <p className="text-xs text-white/40 mb-2">Current Progress</p>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "68%" }}
                                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                                />
                            </div>
                            <p className="text-[10px] text-cyan-400/80 mt-2 font-medium">
                                68% of Intro Course
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.aside>
    );
}
