"use client";
import dynamic from "next/dynamic";

// Dynamically import the content file we just created, disabling server-side rendering
const OOPMasterclass = dynamic(() => import("./OOPMasterclassContent"), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-[#0a0510] text-purple-400 flex items-center justify-center text-lg font-mono animate-pulse">Loading 3D Object Factory...</div>
});

export default function Page() {
    return <OOPMasterclass />;
}
