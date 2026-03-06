"use client";
import dynamic from "next/dynamic";

const PythonMasterclass = dynamic(() => import("./PythonMasterclassContent"), { ssr: false });

export default function Page() {
    return <PythonMasterclass />;
}
