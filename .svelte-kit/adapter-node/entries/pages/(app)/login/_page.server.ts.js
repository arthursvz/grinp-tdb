import { d as private_env } from "../../../../chunks/shared-server.js";
import { z as zod, l as loginScheme } from "../../../../chunks/zod.js";
import { a as authentik, l as lucia } from "../../../../chunks/lucia.js";
import { p as prisma } from "../../../../chunks/prisma.js";
import { e as error, f as fail } from "../../../../chunks/index.js";
import { OAuth2RequestError, generateState, generateCodeVerifier } from "arctic";
import * as argon2 from "argon2";
import { r as redirect, s as setFlash } from "../../../../chunks/server.js";
import "../../../../chunks/stores.js";
import "just-clone";
import "ts-deepmerge";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import "memoize-weak";
import "@exodus/schemasafe";
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
export {
  actions,
  load
};
