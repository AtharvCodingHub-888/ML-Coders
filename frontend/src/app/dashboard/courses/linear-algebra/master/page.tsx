"use client";
import dynamic from "next/dynamic";

const LinearAlgebraMasterclass = dynamic(() => import("./LinearAlgebraContent"), { ssr: false });

export default function Page() {
    return <LinearAlgebraMasterclass />;
}
