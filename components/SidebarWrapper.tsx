"use client";

import dynamic from "next/dynamic";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";
import { ReactNode } from "react";

const UniversalSidebar = dynamic(() => import("@/components/UniversalSidebar"), {
    ssr: false,
});

function ContentShift({ children }: { children: ReactNode }) {
    const { expanded } = useSidebar();
    return (
        <div
            className="transition-all duration-300 min-h-screen"
            style={{ marginLeft: expanded ? "256px" : "80px" }}
        >
            {children}
        </div>
    );
}

export default function SidebarLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <UniversalSidebar />
            <ContentShift>{children}</ContentShift>
        </SidebarProvider>
    );
}
