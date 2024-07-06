import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import {z} from "zod";
import sql from "@/app/lib/db";
import {User} from "@/app/lib/definitions";
import bcrypt from 'bcrypt';

async function getUser(email: string) {
    try {
        const users = await sql`SELECT * FROM dashboard.users WHERE email=${email}`;

        return users[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    // list different login options (Google, GitHub, etc.)
    // next-auth docs: https://authjs.dev/getting-started/providers
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // const parsedCredentials: {success: boolean; data: {email: string; password: string;}} = z
                //     .object({
                //         email: z.string().email(),
                //         password: z.string().min(6),
                //     })
                //     .safeParse(credentials);
                //
                // console.log('parsedCredentials:', JSON.stringify(parsedCredentials, null, 2));

                // if (!parsedCredentials.success) {
                    const { email, password } = credentials;
                    const user = await getUser(email);

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                // }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
