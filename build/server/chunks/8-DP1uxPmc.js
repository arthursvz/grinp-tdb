import { l as lucia } from './lucia-CC7QOpZZ.js';
import { r as redirect } from './index-Ddp2AB5f.js';
import './shared-server-BfUoNEXY.js';
import './prisma-D9xrZjJk.js';
import '@prisma/client';
import '@lucia-auth/adapter-prisma';
import 'arctic';
import 'lucia';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 8;
const server_id = "src/routes/(app)/logout/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-DP1uxPmc.js.map
