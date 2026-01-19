import "../../../../chunks/stores.js";
import { p as prisma } from "../../../../chunks/prisma.js";
import { z as zod, s as slotScheme } from "../../../../chunks/zod.js";
import { r as redirect } from "../../../../chunks/server.js";
import "just-clone";
import "ts-deepmerge";
import "../../../../chunks/index.js";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import "memoize-weak";
import "@exodus/schemasafe";
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
export {
  load
};
