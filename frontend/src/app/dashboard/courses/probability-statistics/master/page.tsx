"use client";
import dynamic from "next/dynamic";

const ProbabilityStatisticsMasterclass = dynamic(() => import("./ProbabilityStatisticsContent"), { ssr: false });

export default function Page() {
    return <ProbabilityStatisticsMasterclass />;
}
