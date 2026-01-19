import { z as zod, d as registerScheme } from "../../../../chunks/zod.js";
import { l as lucia } from "../../../../chunks/lucia.js";
import { p as prisma } from "../../../../chunks/prisma.js";
import { r as redirect, f as fail } from "../../../../chunks/index.js";
import * as argon2 from "argon2";
import "../../../../chunks/stores.js";
import "just-clone";
import "ts-deepmerge";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import "memoize-weak";
import "@exodus/schemasafe";
const load = async (event) => {
  if (event.locals.user) {
    redirect(302, "/");
  }
  return {
    form: await superValidate(zod(registerScheme))
  };
};
const actions = {
  manual: async (event) => {
    const form = await superValidate(event, zod(registerScheme));
    if (!form.valid) {
      return fail(400, { form });
    } else {
      try {
        const existsClassicUser = await prisma.user.findUnique({
          where: {
            email: form.data.email
          }
        }).then((u) => u ? true : false).catch(() => false);
        let user;
        const hash = await argon2.hash(form.data.password);
        if (existsClassicUser) {
          user = await prisma.user.update({
            where: {
              email: form.data.email
            },
            data: {
              password: hash
            }
          });
        } else {
          user = await prisma.user.create({
            data: {
              //id: "0",
              first_name: form.data.first_name,
              last_name: form.data.last_name,
              email: form.data.email,
              password: hash
            }
          });
        }
        try {
          const session = await lucia.createSession(user.id, {
            userId: user.id,
            expiresAt: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 15)
            // 15 days
          });
          const sessionCookie = lucia.createSessionCookie(session.id);
          event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: "/",
            ...sessionCookie.attributes
          });
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
      throw redirect(302, "/");
    }
  },
  oauth: async () => {
    throw redirect(302, "/login");
  }
};
export {
  actions,
  load
};
