import { z as zod, s as slotScheme } from "../../../../../chunks/zod.js";
import { p as prisma } from "../../../../../chunks/prisma.js";
import { SlotType } from "@prisma/client";
import "../../../../../chunks/stores.js";
import "just-clone";
import "ts-deepmerge";
import "../../../../../chunks/index.js";
import { s as superValidate } from "../../../../../chunks/superValidate.js";
import "memoize-weak";
import "@exodus/schemasafe";
const POST = async (event) => {
  const { form, today } = await event.request.json();
  const result = await superValidate(form, zod(slotScheme));
  if (!result.valid) {
    return new Response(JSON.stringify("Form informations are invalid !"), {
      status: 400
    });
  }
  const user = event.locals.user;
  const prisma_user = await prisma.user.findUnique({
    where: {
      id: user?.id
    }
  });
  if (prisma_user?.instructor || prisma_user?.root) {
    const user_id = prisma_user.id;
    try {
      const [startHour, startMin] = form.date.starts_at.split(":");
      const [endHour, endMin] = form.date.ends_at.split(":");
      const starts_date = /* @__PURE__ */ new Date(`${today}T${form.date.starts_at}:00`);
      const ends_date = /* @__PURE__ */ new Date(`${today}T${form.date.ends_at}:00`);
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      const existingSlots = await prisma.slot.findMany({
        where: {
          starts_at: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      });
      if (existingSlots.length >= 3) {
        return new Response(
          JSON.stringify({ message: "Maximum de 3 créneaux par jour atteint." }),
          { status: 400 }
        );
      }
      const hasClosureSlot = existingSlots.some((s) => s.slot_type === SlotType.FERMETURE);
      if (hasClosureSlot) {
        return new Response(
          JSON.stringify({ message: "Impossible de créer un créneau : une fermeture existe ce jour." }),
          { status: 400 }
        );
      }
      const hasOverlap = existingSlots.some((s) => {
        const existingStart = new Date(s.starts_at);
        const existingEnd = new Date(s.ends_at);
        return starts_date >= existingStart && starts_date < existingEnd || ends_date > existingStart && ends_date <= existingEnd || starts_date <= existingStart && ends_date >= existingEnd;
      });
      if (hasOverlap) {
        return new Response(
          JSON.stringify({ message: "Le créneau chevauche un créneau existant." }),
          { status: 400 }
        );
      }
      const slot = await prisma.slot.create({
        data: {
          name: form.title,
          description: form.description,
          starts_at: starts_date,
          ends_at: ends_date,
          capacity: form.capacity,
          // Création côté initiateur : toujours un créneau standard
          slot_type: SlotType.CRENEAU,
          owner: {
            connect: {
              id: user_id
            }
          },
          responsibles: {
            connect: {
              id: user_id
            }
          },
          participants: {
            connect: {
              id: user_id
            }
          }
        }
      });
      return new Response(
        JSON.stringify({ slot }),
        {
          status: 200
        }
      );
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify(error), {
        status: 400
      });
    }
  } else {
    return new Response(JSON.stringify("User not logged in or insufficient permissions !"), {
      status: 400
    });
  }
};
export {
  POST
};
