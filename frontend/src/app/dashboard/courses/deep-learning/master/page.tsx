"use client";

import dynamic from "next/dynamic";

const DeepLearningMasterclass = dynamic(() => import("./DeepLearningMasterclassContent"), {
    ssr: false,
    loading: () => <div className="flex h-screen items-center justify-center bg-[#0a0510] text-purple-400 font-mono animate-pulse">Constructing Deep Architectures...</div>
});

export default function Page() {
    return <DeepLearningMasterclass />;
}
