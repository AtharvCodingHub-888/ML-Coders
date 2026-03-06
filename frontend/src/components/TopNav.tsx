"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/SidebarContext";

export default function TopNav() {
    const { expanded } = useSidebar();

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 right-0 z-40 flex justify-between items-center px-8 py-4 bg-black/10 backdrop-blur-md border-b border-white/10 transition-all duration-300"
            style={{ left: expanded ? "256px" : "80px" }}
        >
            {/* Logo */}
            <Link
                href="/"
                className="flex items-center gap-2.5 cursor-pointer group"
            >
                <GraduationCap className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="text-white font-bold text-lg tracking-wider group-hover:text-cyan-100 transition-colors">
                    ELEARN ML
                </span>
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-medium tracking-wide">
                    Curriculum
                </Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-medium tracking-wide">
                    My Journey
                </Link>
                <Link href="/dashboard/gamified" className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-medium tracking-wide">
                    Gamified Algorithm
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-medium tracking-wide">
                    How It Works
                </Link>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-5">
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-medium">
                    Sign In
                </Link>
                <Link
                    href="/dashboard"
                    className="bg-cyan-400 text-black px-5 py-2 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:bg-cyan-300 transition-all cursor-pointer inline-block"
                >
                    Get Started
                </Link>
            </div>
        </motion.nav>
    );
}
