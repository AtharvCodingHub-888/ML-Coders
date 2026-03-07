"use client";

import React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkCompleteButtonProps {
    isCompleted: boolean;
    isMarkingComplete: boolean;
    onClick: () => void;
    accentColor?: "cyan" | "purple" | "green" | "orange" | "rose";
}

export function MarkCompleteButton({
    isCompleted,
    isMarkingComplete,
    onClick,
    accentColor = "cyan",
}: MarkCompleteButtonProps) {
    const colorMap = {
        cyan: "bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        purple: "bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
        green: "bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
        orange: "bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]",
        rose: "bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    };

    return (
        <button
            onClick={onClick}
            disabled={isCompleted || isMarkingComplete}
            className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm w-full",
                isCompleted
                    ? "bg-green-600/20 border border-green-500/30 text-green-400 cursor-default"
                    : `${colorMap[accentColor]} text-white disabled:opacity-50`
            )}
        >
            {isMarkingComplete ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isCompleted ? (
                <>
                    <CheckCircle2 className="w-4 h-4" />
                    Phase Completed
                </>
            ) : (
                "Mark Phase as Complete ✓"
            )}
        </button>
    );
}
