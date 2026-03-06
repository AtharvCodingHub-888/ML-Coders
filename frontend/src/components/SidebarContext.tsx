"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
    expanded: boolean;
    setExpanded: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    expanded: true,
    setExpanded: () => { },
});

export function useSidebar() {
    return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [expanded, setExpanded] = useState(true);
    return (
        <SidebarContext.Provider value={{ expanded, setExpanded }}>
            {children}
        </SidebarContext.Provider>
    );
}
