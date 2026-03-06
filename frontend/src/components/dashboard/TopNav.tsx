"use client";

import { Search, ChevronDown, LogOut } from "lucide-react";

export default function TopNav() {
    return (
        <header className="fixed top-0 right-0 left-64 h-20 px-8 flex justify-between items-center border-b border-white/10 bg-black/10 backdrop-blur-md z-40">
            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                    type="search"
                    placeholder="Search topics, tutorials..."
                    className="bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2 w-96 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-white/10 transition-all"
                />
            </div>

            {/* Right Elements */}
            <div className="flex items-center gap-8">
                {/* Progress Stats */}
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-yellow-400 font-bold tracking-tight">1,240 XP</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Rank #12</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-white/80 font-semibold tracking-tight">Level 14</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Pathfinder</span>
                    </div>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative group">
                    <button className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 border border-white/20 p-px">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="User Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#0A0A12]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-white/5">
                            <p className="text-xs font-semibold text-white">Felix Anderson</p>
                            <p className="text-[10px] text-white/40">felix@elearnml.edu</p>
                        </div>
                        <div className="p-1">
                            <button className="flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-xl w-full text-left transition-colors">
                                Dashboard Settings
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl w-full text-left transition-colors">
                                <LogOut className="w-3.5 h-3.5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
