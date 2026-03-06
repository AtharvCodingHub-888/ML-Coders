"use client";

import dynamic from "next/dynamic";

const ModelEvalMasterclass = dynamic(() => import("./ModelEvalMasterclassContent"), {
    ssr: false,
    loading: () => <div className="flex h-screen items-center justify-center bg-[#0a0510] text-[#f97316] font-mono animate-pulse">Loading Evaluation Matrix...</div>
});

export default function Page() {
    return <ModelEvalMasterclass />;
}
