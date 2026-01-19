import { r as redirect } from './server-Byb1Q25Q.js';
import './index-Ddp2AB5f.js';

const load = async (event) => {
  if (!event.locals.user) {
    redirect(
      302,
      "/login"
      /*{
        type: "error",
        message: "Vous devez être connecté pour accéder à cette page !",
      },
      event,*/
    );
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BXME9eWl.js')).default;
const server_id = "src/routes/(app)/events/+page.server.ts";
const imports = ["_app/immutable/nodes/5.Sg2GBTWp.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/card-description.aHE51XGI.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-CgP1-CzN.js.map
