"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInset,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarFooter
} from '@/components/ui/sidebar';
import { Settings, LayoutDashboard, User2, LogOut, PencilRuler } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from '@/components/mode-toggle';

// Constants for routes since we don't have the cloned constants file
const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    DASHBOARD: '/dashboard',
    DASHBOARD_SETTINGS: '/dashboard/settings',
    PROFILE: '/profile',
    EDITOR: '/editor'
};

export const AppSidebar = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const getPageName = (pathname: string) => {
        if (!pathname) return '';
        switch (pathname) {
            case ROUTES.HOME: return 'Home';
            case ROUTES.ABOUT: return 'About';
            case ROUTES.DASHBOARD: return 'Dashboard';
            case ROUTES.DASHBOARD_SETTINGS: return 'Settings';
            case ROUTES.PROFILE: return 'Profile';
            default:
                if (pathname.startsWith('/editor/')) return 'Editor';
                const segment = pathname.split('/').filter(Boolean).pop();
                if (!segment) return '';
                return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        }
    };

    const navItems = [
        {
            title: 'Home',
            path: ROUTES.HOME,
            icon: <LayoutDashboard className="size-5 shrink-0" />
        },
        {
            title: 'About',
            path: ROUTES.ABOUT,
            icon: <User2 className="size-5 shrink-0" />
        },
        { title: 'Dashboard', path: ROUTES.DASHBOARD, icon: <LayoutDashboard className="size-5 shrink-0" /> },
        { title: 'Settings', path: ROUTES.DASHBOARD_SETTINGS, icon: <Settings className="size-5 shrink-0" /> }
    ];

    return (
        <SidebarProvider>
            <Sidebar variant="inset" collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            E
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold text-foreground">ELEARN ML</span>
                            <span className="truncate text-xs text-muted-foreground">v1.0.0</span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.path)}>
                                            <Link href={item.path}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                                            <User2 className="size-4" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">User</span>
                                            <span className="truncate text-xs">user@example.com</span>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" side="top">
                                    <DropdownMenuItem asChild>
                                        <Link href={ROUTES.PROFILE} className="flex items-center gap-2">
                                            <User2 className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

            </Sidebar>

            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 border-b px-4">
                    <div className="flex items-center gap-2 px-1">
                        <SidebarTrigger className="-ml-1" />
                        <span className="font-semibold text-sm">{getPageName(pathname ?? '')}</span>
                    </div>
                    <ModeToggle />
                </header>
                <main className="flex flex-1 flex-col overflow-auto bg-background focus:outline-none">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};
