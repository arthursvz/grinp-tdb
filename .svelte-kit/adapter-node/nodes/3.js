import * as server from '../entries/pages/(app)/admin/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.ChL9SPL1.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/input.aOOZU8Wk.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/card-footer.BQxGnICQ.js","_app/immutable/chunks/stores.BaG4yN9q.js","_app/immutable/chunks/addPagination.DMfUyLWv.js","_app/immutable/chunks/updater.DDqbuunG.js"];
export const stylesheets = [];
export const fonts = [];
