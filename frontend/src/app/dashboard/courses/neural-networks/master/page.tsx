"use client";
import dynamic from "next/dynamic";

const NeuralNetworksMasterclass = dynamic(() => import("./NeuralNetworksContent"), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-[#0a0510] text-[#f43f5e] flex items-center justify-center text-lg font-mono animate-pulse">Loading Neural Architecture Search...</div>
});

export default function Page() {
    return <NeuralNetworksMasterclass />;
}
