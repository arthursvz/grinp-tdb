import * as server from '../entries/pages/(app)/instructor/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/instructor/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/instructor/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.CxxeKk1a.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/addPagination.DMfUyLWv.js"];
export const stylesheets = [];
export const fonts = [];
