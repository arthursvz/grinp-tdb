// src/lib/server/lucia.ts

import { env } from "$env/dynamic/private";
import prisma from "$lib/server/prisma";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Authentik } from "arctic";
import { Lucia } from "lucia";

const realmURL = 'https://auth.inpt.fr';

export const authentik = new Authentik(
    realmURL,
    env.CHURROS_CLIENT_ID,
    env.CHURROS_CLIENT_SECRET,
    env.REDIRECT_URI,
);

const adapter = new PrismaAdapter(prisma.session, prisma.user);
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !env.DEV,
            sameSite: "lax",
        }
    },
    getUserAttributes: (attributes) => {
        return {
            churros_id: attributes.churros_id,
	    first_name : attributes.first_name,
            email: attributes.email,
            root: attributes.root,
            instructor: attributes.instructor,
            bureau: attributes.bureau,
            bureau_role: attributes.bureau_role,
        };
    },
    getSessionAttributes: (attributes) => {
        return {
            userId: attributes.userId,
            expiresAt: attributes.expiresAt
        }
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof Lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
    }
}

interface DatabaseUserAttributes {
    email: string;
    churros_id: string;
    root: boolean;
    instructor: boolean;
    bureau: boolean;
    bureau_role: string | null;
}

interface DatabaseSessionAttributes {
    userId: string;
    expiresAt: Date;
}
