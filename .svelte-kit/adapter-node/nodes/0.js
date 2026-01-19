import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DVQ-fvmK.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/stores.2WuGYSmf.js","_app/immutable/chunks/entry.CEfYAMar.js","_app/immutable/chunks/client.DPh8YX0Q.js"];
export const stylesheets = ["_app/immutable/assets/0.CKeAvI2Q.css"];
export const fonts = [];
