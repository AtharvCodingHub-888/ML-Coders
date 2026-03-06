"use client";

import Link from "next/link";
import { GraduationCap, Mail, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative w-full overflow-hidden text-white">
            {/* ── Background ──────────────────────────────────────── */}
            <div className="absolute inset-0 -z-10 bg-[url('/dashboard-bg.png')] bg-cover bg-center opacity-50 mix-blend-screen" />
            <div className="absolute inset-0 -z-10 bg-black/50" />

            {/* ── Glowing orb ─────────────────────────────────────── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* ═══════════════════════════════════════════════════════
                AUTH CARD
            ═══════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative w-full max-w-md p-8 sm:p-10 backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.1)] z-10"
            >
                {/* ── Header ──────────────────────────────────────── */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 200,
                            damping: 12,
                        }}
                        className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-5"
                    >
                        <GraduationCap className="w-7 h-7 text-cyan-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                        Welcome to ELEARN ML
                    </h1>
                    <p className="text-sm text-white/50 text-center">
                        Log in to continue your 3D learning journey.
                    </p>
                </div>

                {/* ── Form ────────────────────────────────────────── */}
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => e.preventDefault()}
                >
                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <a
                            href="#"
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    {/* Primary Login Button */}
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
                    >
                        Log In
                    </motion.button>

                    {/* ── Divider ──────────────────────────────────── */}
                    <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
                            or
                        </span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google Sign-In */}
                    <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        {/* Google "G" icon */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="text-sm font-medium">
                            Continue with Google
                        </span>
                    </motion.button>
                </form>

                {/* ── Footer ──────────────────────────────────────── */}
                <p className="text-sm text-white/40 text-center mt-8">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/login"
                        className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                    >
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
