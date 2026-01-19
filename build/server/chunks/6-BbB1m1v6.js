import { p as prisma } from './prisma-D9xrZjJk.js';
import { r as redirect } from './server-Byb1Q25Q.js';
import '@prisma/client';
import './index-Ddp2AB5f.js';

const load = async (event) => {
  const user = event.locals.user;
  if (!user) {
    throw redirect(
      302,
      "/login",
      {
        type: "error",
        message: "Vous devez être connecté pour accéder à cette page !"
      },
      event
    );
  } else {
    try {
      const root = await prisma.user.findUnique({
        where: {
          id: user.id
        }
      }).then((u) => {
        if (u) {
          return u.root;
        } else {
          return false;
        }
      });
      if (!root) {
        throw redirect(
          302,
          "/login",
          {
            type: "error",
            message: "Vous devez être administrateur pour accéder à cette page !"
          },
          event
        );
      }
    } catch (error) {
      throw redirect(
        302,
        "/login",
        {
          type: "error",
          message: "Vous devez être administrateur pour accéder à cette page !"
        },
        event
      );
    }
  }
  const users = await prisma.user.findMany();
  return {
    users
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BUgnmO-P.js')).default;
const server_id = "src/routes/(app)/instructor/+page.server.ts";
const imports = ["_app/immutable/nodes/6.CxxeKk1a.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/addPagination.DMfUyLWv.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-BbB1m1v6.js.map
