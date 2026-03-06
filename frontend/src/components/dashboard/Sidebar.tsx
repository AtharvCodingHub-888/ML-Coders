"use client";

import Link from "next/link";
import { GraduationCap, Home, Map, Gamepad2, PlayCircle, Info } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My Journey", href: "/dashboard", icon: Map, active: true },
    { name: "Gamified Algorithm", href: "/dashboard/gamified", icon: Gamepad2 },
    { name: "Code Playground", href: "/dashboard/playground", icon: PlayCircle },
    { name: "About Us", href: "/about", icon: Info },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl p-6 flex flex-col z-50">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group mb-12">
                <GraduationCap className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold tracking-tight text-white">ELEARN ML</span>
            </Link>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                {links.map((link) => {
                    const isActive = link.active; // Hardcoded for now as per requirement for "My Journey"
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 py-3 px-2 rounded-xl transition-all duration-300 relative group",
                                isActive
                                    ? "text-white opacity-100"
                                    : "text-white/60 hover:text-white hover:opacity-100"
                            )}
                        >
                            <link.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-cyan-400" : "text-white/60 group-hover:text-white"
                            )} />
                            <span className="text-sm font-medium">{link.name}</span>

                            {isActive && (
                                <>
                                    <div className="absolute left-[-24px] w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                                    <div className="absolute left-[-24px] w-4 h-4 bg-cyan-400/20 blur-md rounded-full" />
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Spacer/Extra Info */}
            <div className="mt-auto">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 group cursor-pointer hover:bg-white/[0.05] transition-colors">
                    <p className="text-xs text-white/40 mb-1">Current Progress</p>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-cyan-400" />
                    </div>
                    <p className="text-[10px] text-cyan-400/80 mt-2 font-medium">68% of Intro Course</p>
                </div>
            </div>
        </aside>
    );
}
