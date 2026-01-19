import { d as private_env } from './shared-server-BfUoNEXY.js';
import { s as superValidate, z as zod, l as loginScheme } from './index-DCHBw7tG.js';
import { a as authentik, l as lucia } from './lucia-CC7QOpZZ.js';
import { p as prisma } from './prisma-D9xrZjJk.js';
import { e as error, f as fail } from './index-Ddp2AB5f.js';
import { OAuth2RequestError, generateState, generateCodeVerifier } from 'arctic';
import * as argon2 from 'argon2';
import { r as redirect, s as setFlash } from './server-Byb1Q25Q.js';
import './stores-CaFYFvqm.js';
import 'zod';
import './index2-7tr__D8z.js';
import './lifecycle-CY0VpZrS.js';
import './stringify-CIuySMKb.js';
import './scheduler-nF4nnj9q.js';
import '@lucia-auth/adapter-prisma';
import 'lucia';
import '@prisma/client';
import './exports-BGi7-Rnc.js';

const maxCookiesAge = 60 * 60 * 24 * 15;
const load = async (event) => {
  if (event.locals.user) {
    throw redirect(302, "/");
  }
  const oauthState = event.cookies.get("oauthState") ?? null;
  const oauthCodeVerifier = event.cookies.get("oauthCodeVerifier") ?? null;
  const state = event.url.searchParams.get("state");
  const code = event.url.searchParams.get("code");
  if (!code || !state || !oauthState || !oauthCodeVerifier) ;
  else if (state !== oauthState) {
    throw error(400, "OAuth state mismatch");
  } else {
    try {
      const tokens = await authentik.validateAuthorizationCode(code, oauthCodeVerifier);
      const response = await fetch("https://auth.inpt.fr/application/o/userinfo/", {
        method: "post",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json"
        }
      });
      const user = await response.json();
      let prismaUser = await prisma.user.findUnique({
        where: {
          churros_uid: user.preferred_username
        }
      });
      const existsClassicUser = await prisma.user.findUnique({
        where: {
          email: user.email
        }
      }).then((u) => u ? true : false).catch(() => false);
      if (!prismaUser) {
        if (existsClassicUser) {
          prismaUser = await prisma.user.update({
            where: {
              email: user.email
            },
            data: {
              churros_uid: user.preferred_username
            }
          });
        } else {
          prismaUser = await prisma.user.create({
            data: {
              churros_uid: user.preferred_username,
              first_name: user.firstName,
              last_name: user.lastName,
              email: user.email
            }
          });
        }
      }
      const response2 = await fetch("https://churros.inpt.fr/graphql", {
        method: "post",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `{
            group(uid: "grinp-inp") {
              members {
                canScanEvents
                canEditArticles
                canEditMembers
                president
                secretary
                treasurer
                vicePresident
                member {
                  uid
                }
              }
            }
          }`
        })
      });
      const grinp = await response2.json();
      const grinp_member = grinp.data.group.members.find((members) => members.member.uid === user.preferred_username);
      const root = grinp_member?.president || grinp_member?.treasurer;
      const instructor = root || grinp_member?.canScanEvents || grinp_member?.canEditArticles || grinp_member?.canEditMembers || grinp_member?.vicePresident || grinp_member?.secretary;
      if (instructor) {
        prismaUser = await prisma.user.update({
          where: {
            churros_uid: user.preferred_username
          },
          data: {
            root,
            instructor
          }
        });
      }
      const session = await lucia.createSession(prismaUser.id, {
        userId: prismaUser.id,
        expiresAt: new Date(Date.now() + 1e3 * maxCookiesAge)
        // 15 days
      });
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: "/",
        ...sessionCookie.attributes
      });
    } catch (e) {
      if (e instanceof OAuth2RequestError) {
        throw error(400, e.message);
      } else if (e instanceof Error) {
        throw error(500, e.message);
      }
    }
    throw redirect(
      302,
      "/",
      {
        type: "success",
        message: "Vous êtes connecté !"
      },
      event
    );
  }
  return {
    form: await superValidate(zod(loginScheme))
  };
};
const actions = {
  manual: async (event) => {
    const form = await superValidate(event, zod(loginScheme));
    if (!form.valid) {
      return fail(400, { form });
    } else {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: form.data.email
          }
        });
        let password = user?.password;
        if (password === void 0 || password === null) {
          setFlash(
            {
              type: "error",
              message: "Vous devez ajouter un mot de passe à votre compte ou utiliser OAuth pour vous connecter !"
            },
            event
          );
        } else {
          const check = await argon2.verify(password, form.data.password);
          if (check) {
            if (!user) {
              setFlash(
                {
                  type: "error",
                  message: "Votre mot de passe ou nom d'utilisateur est incorrect !"
                },
                event
              );
              return;
            }
            try {
              const session = await lucia.createSession(user.id, {
                userId: user.id,
                expiresAt: new Date(Date.now() + 1e3 * maxCookiesAge)
                // 15 days
              });
              const sessionCookie = lucia.createSessionCookie(session.id);
              event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: "/",
                ...sessionCookie.attributes
              });
            } catch (error2) {
              console.log(error2);
            }
            throw redirect(
              302,
              "/",
              {
                type: "success",
                message: "Vous êtes connecté en tant que : " + user.email
              },
              event
            );
          } else {
            setFlash(
              {
                type: "error",
                message: "Votre mot de passe ou nom d'utilisateur est incorrect !"
              },
              event
            );
          }
        }
      } catch (error2) {
        console.log(error2);
      }
    }
  },
  oauth: async (event) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await authentik.createAuthorizationURL(state, codeVerifier, {
      scopes: ["openid", "profile", "email", "churros:profile"]
    });
    event.cookies.set("oauthState", state, {
      path: "/",
      secure: !private_env.DEV,
      httpOnly: true,
      maxAge: maxCookiesAge,
      sameSite: "lax"
    });
    event.cookies.set("oauthCodeVerifier", codeVerifier, {
      path: "/",
      secure: !private_env.DEV,
      httpOnly: true,
      maxAge: maxCookiesAge,
      sameSite: "lax"
    });
    throw redirect(302, url);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BxLypOz7.js')).default;
const server_id = "src/routes/(app)/login/+page.server.ts";
const imports = ["_app/immutable/nodes/7.BP8Txv5T.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/index.Cej-GNJg.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/input.aOOZU8Wk.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/stores.2WuGYSmf.js","_app/immutable/chunks/entry.CEfYAMar.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/card-footer.BQxGnICQ.js","_app/immutable/chunks/updater.DDqbuunG.js","_app/immutable/chunks/client.DPh8YX0Q.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-Cm8NLliu.js.map
