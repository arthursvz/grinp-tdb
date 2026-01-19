import './stores-CaFYFvqm.js';
import { p as prisma } from './prisma-D9xrZjJk.js';
import { s as superValidate, z as zod, a as slotScheme } from './index-DCHBw7tG.js';
import { r as redirect } from './server-Byb1Q25Q.js';
import './index-Ddp2AB5f.js';
import './lifecycle-CY0VpZrS.js';
import './exports-BGi7-Rnc.js';
import '@prisma/client';
import 'zod';
import './index2-7tr__D8z.js';
import './stringify-CIuySMKb.js';
import './scheduler-nF4nnj9q.js';

const load = async (event) => {
  const user = event.locals.user;
  if (!user) {
    redirect(
      302,
      "/login"
    );
  }
  try {
    const dateParam2 = event.url.searchParams.get("date");
    const date = dateParam2 ? new Date(dateParam2) : /* @__PURE__ */ new Date();
    if (isNaN(date.getTime())) {
      return {
        status: 400,
        error: "Invalid date parameter"
      };
    }
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    const slots = await prisma.slot.findMany({
      where: {
        starts_at: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      include: {
        responsibles: true,
        owner: true
      },
      orderBy: {
        starts_at: "asc"
      }
    });
    const all_users = await prisma.user.findMany();
    const slotsData = await Promise.all(slots.map(async (slot) => {
      const participants_list = await prisma.user.findMany({
        where: {
          slots: {
            some: {
              id: slot.id
            }
          }
        }
      }) ?? [];
      const attendees_list = await prisma.user.findMany({
        where: {
          attended_slots: {
            some: {
              id: slot.id
            }
          }
        }
      }) ?? [];
      return {
        slot,
        owner: slot.owner,
        participants_list,
        attendees_list
      };
    }));
    return {
      slots: slotsData,
      user: event.locals.user,
      form: await superValidate(zod(slotScheme)),
      all_users,
      dateString: dateParam2 || date.toISOString().split("T")[0]
    };
  } catch (error) {
    return {
      slots: [],
      user: event.locals.user,
      form: await superValidate(zod(slotScheme)),
      all_users: [],
      dateString: dateParam || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CsrAs_X0.js')).default;
const server_id = "src/routes/(app)/calendar/+page.server.ts";
const imports = ["_app/immutable/nodes/4.DmZbC-Ve.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js","_app/immutable/chunks/entry.CEfYAMar.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/chunks/stores.2WuGYSmf.js","_app/immutable/chunks/card.CE70MUHO.js","_app/immutable/chunks/utils.9a4hcQZ0.js","_app/immutable/chunks/card-content.BtYrswVR.js","_app/immutable/chunks/card-description.aHE51XGI.js","_app/immutable/chunks/each.DxDIO64g.js","_app/immutable/chunks/button.LSeDBL-G.js","_app/immutable/chunks/index.Cej-GNJg.js","_app/immutable/chunks/input.aOOZU8Wk.js","_app/immutable/chunks/client.DPh8YX0Q.js","_app/immutable/chunks/globals.D0QH3NT1.js","_app/immutable/chunks/card-footer.BQxGnICQ.js","_app/immutable/chunks/stores.BaG4yN9q.js","_app/immutable/chunks/addPagination.DMfUyLWv.js","_app/immutable/chunks/updater.DDqbuunG.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-3gGLRp83.js.map
