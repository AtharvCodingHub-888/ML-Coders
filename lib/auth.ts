import GoogleProvider from "next-auth/providers/google";
import { createServerClient } from "@/lib/supabase";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user }) {
            // Upsert profile into Supabase on every sign-in
            try {
                const supabase = createServerClient();
                if (supabase && user.email) {
                    const { error } = await supabase
                        .from("profiles")
                        .upsert(
                            {
                                id: user.id!,
                                email: user.email,
                                name: user.name ?? null,
                                avatar_url: user.image ?? null,
                            },
                            { onConflict: "id" }
                        );
                    if (error) {
                        console.error("Supabase profile sync error during login:", error.message);
                    }
                }
            } catch (err: any) {
                console.error("Critical error syncing auth profile to Supabase:", err.message);
            }
            // Always return true to allow login even if database sync fails
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET ?? "elearn-ml-dev-secret-change-in-prod",
};
