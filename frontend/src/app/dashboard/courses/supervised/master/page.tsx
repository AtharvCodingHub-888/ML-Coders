"use client";
import dynamic from "next/dynamic";

const SupervisedMasterclass = dynamic(() => import("./SupervisedMasterclassContent"), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-[#0a0510] text-[#22d3ee] flex items-center justify-center text-lg font-mono animate-pulse">Loading Supervised Engine...</div>
});

export default function Page() {
    return <SupervisedMasterclass />;
}
