import type { Metadata } from "next";
import "./globals.css";
import SidebarLayout from "@/components/SidebarWrapper";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
    title: "ELEARN ML — Master Machine Learning in 3D",
    description:
        "A structured, visual sandbox for engineering students. From Math foundations to Deep Learning application.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased min-h-screen">
                <AuthProvider>
                    <SidebarLayout>{children}</SidebarLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
