import { p as prisma } from './prisma-D9xrZjJk.js';
import { l as loadFlash } from './server-Byb1Q25Q.js';
import '@prisma/client';
import './index-Ddp2AB5f.js';

const load = loadFlash(async (event) => {
  const user = event.locals.user;
  try {
    if (user) {
      const prisma_user = await prisma.user.findUnique({
        where: {
          id: user.id
        }
      });
      const root = prisma_user?.root;
      const instructor = prisma_user?.instructor;
      return {
        user: event.locals.user,
        root,
        instructor
      };
    } else {
      return {
        user: null,
        root: false,
        instructor: false
      };
    }
  } catch (error) {
    return {
      user: null,
      root: false,
      instructor: false
    };
  }
});

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-B46xY5fh.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.DVQ-fvmK.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/stores.2WuGYSmf.js","_app/immutable/chunks/entry.CEfYAMar.js","_app/immutable/chunks/client.DPh8YX0Q.js"];
const stylesheets = ["_app/immutable/assets/0.CKeAvI2Q.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-DT2NV7Gu.js.map
