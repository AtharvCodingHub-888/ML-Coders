"use client";
import dynamic from "next/dynamic";

const UnsupervisedMasterclass = dynamic(() => import("./UnsupervisedMasterclassContent"), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-[#0a0510] text-[#a855f7] flex items-center justify-center text-lg font-mono animate-pulse">Loading Unsupervised Engine...</div>
});

export default function Page() {
    return <UnsupervisedMasterclass />;
}
