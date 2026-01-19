import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.DzagurKm.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/index._5LYSXs0.js"];
export const stylesheets = [];
export const fonts = [];
