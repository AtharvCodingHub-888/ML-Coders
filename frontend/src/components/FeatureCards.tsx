"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Box, Target } from "lucide-react";

interface FeatureCard {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag: string;
    color: "cyan" | "pink" | "purple";
    href?: string;
}

const cards: FeatureCard[] = [
    {
        icon: <GraduationCap className="w-8 h-8 text-cyan-400" />,
        title: "Structured Engineering Path",
        description:
            "Follow a carefully designed curriculum from linear algebra to neural networks, built for engineering minds.",
        tag: "Lv.1 Math",
        color: "cyan",
    },
    {
        icon: <Box className="w-8 h-8 text-pink-500" />,
        title: "Interactive 3D Sandboxes",
        description:
            "Manipulate models, visualize data flows, and experiment with algorithms in real-time 3D environments.",
        tag: "Lv.2 Models",
        color: "pink",
        href: "/dashboard/playground",
    },
    {
        icon: <Target className="w-8 h-8 text-purple-500" />,
        title: "Gamified Progression",
        description:
            "Earn XP, unlock challenges, and track mastery across core ML concepts with achievement milestones.",
        tag: "Lv.3 Mastery",
        color: "purple",
        href: "/dashboard/gamified",
    },
];

const colorMap = {
    cyan: {
        border: "border-cyan-400/50",
        hoverBorder: "hover:border-cyan-400",
        hoverShadow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]",
        tagBg: "bg-cyan-900/50",
        tagText: "text-cyan-300",
    },
    pink: {
        border: "border-pink-500/50",
        hoverBorder: "hover:border-pink-500",
        hoverShadow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
        tagBg: "bg-pink-900/50",
        tagText: "text-pink-300",
    },
    purple: {
        border: "border-purple-500/50",
        hoverBorder: "hover:border-purple-500",
        hoverShadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
        tagBg: "bg-purple-900/50",
        tagText: "text-purple-300",
    },
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 1.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export default function FeatureCards() {
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-20 px-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl pb-16"
        >
            {cards.map((card) => {
                const colors = colorMap[card.color];
                const Wrapper = card.href ? Link : 'div';
                const wrapperProps = card.href ? { href: card.href } : {};
                return (
                    <motion.div
                        key={card.title}
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="cursor-pointer"
                    >
                        <Wrapper {...wrapperProps as any}>
                            <div
                                className={`w-full bg-[#05050A]/60 backdrop-blur-xl rounded-2xl p-6 text-left transition-all duration-300 border ${colors.border} ${colors.hoverBorder} ${colors.hoverShadow}`}
                            >
                                {/* Icon */}
                                <div className="mb-4">{card.icon}</div>

                                {/* Title */}
                                <h3 className="text-white font-semibold text-lg mb-2">
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {card.description}
                                </p>

                                {/* Tag */}
                                <span
                                    className={`${colors.tagBg} ${colors.tagText} text-xs px-2 py-1 rounded font-medium`}
                                >
                                    {card.tag}
                                </span>
                            </div>
                        </Wrapper>
                    </motion.div>
                );
            })}
        </motion.section>
    );
}
