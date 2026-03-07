"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, Volume2, VolumeX } from "lucide-react";

export default function SplashScreen() {
    const [showSplash, setShowSplash] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user has already seen the intro
        const hasSeenSplash = localStorage.getItem("hasSeenSplash");
        if (hasSeenSplash === "true") {
            setShowSplash(false);
        }
        setIsLoading(false);
    }, []);

    const handleComplete = () => {
        setShowSplash(false);
        localStorage.setItem("hasSeenSplash", "true");
    };

    if (isLoading) {
        // Return a blank backdrop so we don't flash the underlying content
        // before we've verified localStorage.
        return <div className="fixed inset-0 z-[100] bg-black" />;
    }

    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                >
                    <video
                        src="/intro.mp4"
                        autoPlay
                        muted={isMuted}
                        playsInline
                        onEnded={handleComplete}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Overlay controls */}
                    <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10 group cursor-pointer"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? (
                                <VolumeX className="w-4 h-4 md:w-5 md:h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <Volume2 className="w-4 h-4 md:w-5 md:h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                            )}
                        </button>

                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 md:px-5 md:py-3 rounded-full backdrop-blur-md transition-all border border-white/20 group uppercase tracking-widest text-xs md:text-sm font-semibold cursor-pointer"
                        >
                            <span>Skip Intro</span>
                            <SkipForward className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
