import { p as prisma } from './prisma-D9xrZjJk.js';
import '@prisma/client';

const load = async ({ params }) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        churros_uid: params.id
      }
    });
    const users = await prisma.user.findMany();
    const slots = await prisma.slot.findMany({
      where: {
        participants: {
          some: {
            id: user.id
          }
        }
      }
    });
    return {
      user,
      users,
      slots
    };
  } catch (error) {
    return {
      status: 404,
      error: "User not found"
    };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 10;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CDlLf6L_.js')).default;
const server_id = "src/routes/(app)/user/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/10.DcUEU31p.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-footer.BQxGnICQ.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/card-content.BtYrswVR.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-GvMKGzF6.js.map
