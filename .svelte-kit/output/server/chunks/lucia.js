import { d as private_env } from "./shared-server.js";
import { p as prisma } from "./prisma.js";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Authentik } from "arctic";
import { Lucia } from "lucia";
const realmURL = "https://auth.inpt.fr";
const authentik = new Authentik(
  realmURL,
  private_env.CHURROS_CLIENT_ID,
  private_env.CHURROS_CLIENT_SECRET,
  private_env.REDIRECT_URI
);
const adapter = new PrismaAdapter(prisma.session, prisma.user);
const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !private_env.DEV,
      sameSite: "lax"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      churros_id: attributes.churros_id,
      email: attributes.email,
      root: attributes.root,
      instructor: attributes.instructor
    };
  },
  getSessionAttributes: (attributes) => {
    return {
      userId: attributes.userId,
      expiresAt: attributes.expiresAt
    };
  }
});
export {
  authentik as a,
  lucia as l
};
