import * as server from '../entries/pages/(app)/user/_id_/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/user/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/user/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.DcUEU31p.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-footer.BQxGnICQ.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/card-content.BtYrswVR.js"];
export const stylesheets = [];
export const fonts = [];
