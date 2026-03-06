"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative max-w-2xl mt-32 px-8">
            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-bold text-white leading-tight"
            >
                Master Machine
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
                    Learning
                </span>{" "}
                in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    3D
                </span>
                <span className="text-cyan-400">.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="text-gray-300 text-lg mt-6 max-w-lg leading-relaxed"
            >
                A structured, visual sandbox for engineering students. From Math
                foundations to Deep Learning application.
            </motion.p>

            {/* CTA Button */}
            <Link href="/dashboard">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-8 px-6 py-3 bg-cyan-400 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] hover:bg-cyan-300 transition-all cursor-pointer text-base"
                >
                    Explore the Curriculum 🚀
                </motion.button>
            </Link>
        </section>
    );
}
