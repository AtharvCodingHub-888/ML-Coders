"use client";

import { motion } from "framer-motion";
import { ChevronRight, Atom, Code, Database, BrainCircuit, Sigma, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MotionLink = motion.create ? motion.create(Link) : (motion as any)(Link);

type Subtopic = {
    title: string;
    icon: any;
    href?: string;
    isLocked?: boolean;
};

type CourseCardProps = {
    title: string;
    color: "blue" | "green" | "purple";
    subtopics: Subtopic[];
    progress?: number; // 0 to 100
};

const colorConfig = {
    blue: {
        border: "border-blue-500/30",
        hoverBorder: "hover:border-blue-500/60",
        shadow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
        text: "text-blue-400",
        buttonBg: "bg-gradient-to-r from-blue-600/20 to-blue-500/10 backdrop-blur-md",
        buttonBorder: "border-blue-400/30",
        buttonHoverBg: "hover:from-blue-500/40 hover:to-blue-400/30",
        buttonHoverBorder: "hover:border-blue-300/60",
        baseGlow: "rgba(59,130,246,0.6)",
        glowColor: "rgba(96,165,250,1)",
        iconBg: "bg-blue-500/20",
        iconHoverBg: "group-hover:bg-blue-400/40",
        textColor: "text-blue-200",
    },
    green: {
        border: "border-green-500/30",
        hoverBorder: "hover:border-green-500/60",
        shadow: "hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]",
        text: "text-green-400",
        buttonBg: "bg-gradient-to-r from-green-600/20 to-green-500/10 backdrop-blur-md",
        buttonBorder: "border-green-400/30",
        buttonHoverBg: "hover:from-green-500/40 hover:to-green-400/30",
        buttonHoverBorder: "hover:border-green-300/60",
        baseGlow: "rgba(34,197,94,0.6)",
        glowColor: "rgba(74,222,128,1)",
        iconBg: "bg-green-500/20",
        iconHoverBg: "group-hover:bg-green-400/40",
        textColor: "text-green-200",
    },
    purple: {
        border: "border-purple-500/30",
        hoverBorder: "hover:border-purple-500/60",
        shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
        text: "text-purple-400",
        buttonBg: "bg-gradient-to-r from-purple-600/20 to-purple-500/10 backdrop-blur-md",
        buttonBorder: "border-purple-400/30",
        buttonHoverBg: "hover:from-purple-500/40 hover:to-purple-400/30",
        buttonHoverBorder: "hover:border-purple-300/60",
        baseGlow: "rgba(168,85,247,0.6)",
        glowColor: "rgba(192,132,252,1)",
        iconBg: "bg-purple-500/20",
        iconHoverBg: "group-hover:bg-purple-400/40",
        textColor: "text-purple-200",
    },
};

export default function CourseCard({ title, color, subtopics, progress = 0 }: CourseCardProps) {
    const config = colorConfig[color];

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
                "relative p-8 rounded-[2rem] backdrop-blur-3xl bg-white/[0.02] border transition-all duration-500",
                config.border,
                config.hoverBorder,
                config.shadow
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                    <h2 className={cn("text-2xl font-bold tracking-tight", config.text)}>
                        {title}
                    </h2>
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 mt-1">
                        <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn("h-full rounded-full", color === 'blue' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : color === 'green' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]')}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-white/40 tabular-nums">{progress}% COMPLETE</span>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/60">
                    {progress > 0 ? "In Progress" : "Path Active"}
                </div>
            </div>

            {/* Subtopics List */}
            <div className="flex flex-col gap-1">
                {subtopics.map((topic, index) => {
                    const ButtonContent = () => (
                        <>
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-2.5 rounded-xl transition-colors duration-300",
                                    topic.isLocked ? "bg-white/5 text-white/20" : cn(config.iconBg, config.iconHoverBg, config.textColor)
                                )}>
                                    {topic.isLocked ? <Lock className="w-5 h-5" /> : <topic.icon className="w-5 h-5" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-[15px] font-bold transition-colors",
                                        topic.isLocked ? "text-white/30" : cn(config.textColor, "group-hover:text-white")
                                    )}>
                                        {topic.title}
                                    </span>
                                    {topic.isLocked && <span className="text-[10px] uppercase tracking-tighter text-white/20 font-bold">Coming Soon</span>}
                                </div>
                            </div>
                            {!topic.isLocked && <ChevronRight className={cn("w-5 h-5 group-hover:translate-x-1 transition-all", config.textColor)} />}
                        </>
                    );

                    const buttonClasses = cn(
                        "group flex items-center justify-between p-4 mb-3 rounded-2xl border transition-all duration-300 w-full text-left",
                        topic.isLocked
                            ? "bg-white/[0.02] border-white/5 cursor-not-allowed opacity-60"
                            : cn("cursor-pointer", config.buttonBg, config.buttonBorder, config.buttonHoverBg, config.buttonHoverBorder)
                    );

                    const motionProps = {
                        animate: {
                            boxShadow: [
                                `0 0 15px ${config.baseGlow}`,
                                `0 0 35px ${config.glowColor}`,
                                `0 0 15px ${config.baseGlow}`
                            ]
                        },
                        transition: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.15
                        },
                        whileHover: {
                            scale: 1.02,
                            boxShadow: `0 0 50px ${config.glowColor}`,
                            transition: { duration: 0.2 }
                        }
                    };

                    if (topic.href && !topic.isLocked) {
                        return (
                            <MotionLink
                                href={topic.href}
                                key={topic.title}
                                {...(motionProps as any)}
                                className={buttonClasses}
                            >
                                <ButtonContent />
                            </MotionLink>
                        );
                    }

                    return (
                        <motion.button
                            key={topic.title}
                            {...(topic.isLocked ? {} : motionProps) as any}
                            className={buttonClasses}
                        >
                            <ButtonContent />
                        </motion.button>
                    );
                })}
            </div>

            {/* Subtle bottom glow */}
            <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px blur-[2px]", color === 'blue' ? 'bg-blue-400/50' : color === 'green' ? 'bg-green-400/50' : 'bg-purple-400/50')} />
        </motion.div>
    );
}
