import { s as superValidate, z as zod, r as registerScheme } from './index-DCHBw7tG.js';
import { l as lucia } from './lucia-CC7QOpZZ.js';
import { p as prisma } from './prisma-D9xrZjJk.js';
import { r as redirect, f as fail } from './index-Ddp2AB5f.js';
import * as argon2 from 'argon2';
import './stores-CaFYFvqm.js';
import 'zod';
import './index2-7tr__D8z.js';
import './lifecycle-CY0VpZrS.js';
import './stringify-CIuySMKb.js';
import './scheduler-nF4nnj9q.js';
import './shared-server-BfUoNEXY.js';
import '@lucia-auth/adapter-prisma';
import 'arctic';
import 'lucia';
import '@prisma/client';
import './exports-BGi7-Rnc.js';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BuF_e-qe.js')).default;
const server_id = "src/routes/(app)/register/+page.server.ts";
const imports = ["_app/immutable/nodes/9.BaeE2IcH.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/index.Cej-GNJg.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/input.aOOZU8Wk.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/stores.2WuGYSmf.js","_app/immutable/chunks/entry.CEfYAMar.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-CZp6n9GI.js.map
