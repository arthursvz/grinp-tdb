import * as server from '../entries/pages/(app)/events/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/events/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/events/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.Sg2GBTWp.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/card-description.aHE51XGI.js"];
export const stylesheets = [];
export const fonts = [];
