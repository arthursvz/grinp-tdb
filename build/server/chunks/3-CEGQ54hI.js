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
  const slots = await prisma.slot.findMany({
    include: { responsibles: true }
  });
  return {
    users,
    slots
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DWOtvd-2.js')).default;
const server_id = "src/routes/(app)/admin/+page.server.ts";
const imports = ["_app/immutable/nodes/3.ChL9SPL1.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/input.aOOZU8Wk.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/card-footer.BQxGnICQ.js","_app/immutable/chunks/stores.BaG4yN9q.js","_app/immutable/chunks/addPagination.DMfUyLWv.js","_app/immutable/chunks/updater.DDqbuunG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-CEGQ54hI.js.map
