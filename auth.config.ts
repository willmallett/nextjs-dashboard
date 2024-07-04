import type { NextAuthConfig } from 'next-auth';
import Credentials from "next-auth/providers/credentials";
import {z} from "zod";

// Configuration for next-auth
export const authConfig = {
    pages: {
        signIn: '/login', // URL to redirect to for sign in (overrides next-auth default)
    },
    callbacks: {
        // verify if request is authorized to access a page
        authorized({ auth, request: { nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;

                return false; // redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // redirect authenticated users to dashboard
                return Response.redirect(new URL('/dashboard', nextUrl))
            }

            return true;
        }
    },
    providers: [], // this gets overridden by the providers array in auth.ts
} satisfies NextAuthConfig;
