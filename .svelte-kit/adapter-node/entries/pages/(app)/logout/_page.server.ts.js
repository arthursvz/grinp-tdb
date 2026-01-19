import { l as lucia } from "../../../../chunks/lucia.js";
import { r as redirect } from "../../../../chunks/index.js";
const load = async (event) => {
  if (event.locals.session) {
    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: "/",
      ...sessionCookie.attributes
    });
  }
  event.cookies.delete("oauthState", { path: "." });
  event.cookies.delete("oauthCodeVerifier", { path: "." });
  redirect(302, "/");
};
export {
  load
};
