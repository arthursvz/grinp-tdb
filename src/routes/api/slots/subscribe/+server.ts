import prisma from "@/server/prisma";
import { SlotType } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
  const { user_id, slot_id } = await event.request.json();

  const sessionUser = event.locals.user;
  const dbUser = sessionUser?.id
    ? await prisma.user.findUnique({ where: { id: sessionUser.id } })
    : null;

  const slot = await prisma.slot.findUnique({ where: { id: slot_id } });
  if (!slot) {
    return new Response(JSON.stringify({ error: "Slot not found" }), { status: 404 });
  }

  const isOwner = !!dbUser?.instructor && slot.owner_id === dbUser.id;
  const can_manage = !!dbUser?.root || isOwner;

  const isBlockedType = slot.slot_type === SlotType.EVENEMENT || slot.slot_type === SlotType.FERMETURE;
  if (isBlockedType && !can_manage) {
    return new Response(JSON.stringify("Les inscriptions sont désactivées pour ce créneau."), {
      status: 400,
    });
  }

  const participants_count = await prisma.user.findMany({
    where: {
      slots: {
        some: {
          id: slot_id,
        },
      },
    },
  }).then((participants) => participants.length);

  if (sessionUser?.id == user_id || can_manage) {
    // Add the user to the database
    try {
      const capacity = slot.capacity;

      if (capacity && participants_count >= capacity && !can_manage) {
        return new Response(JSON.stringify("Slot is full !"), {
          status: 400,
        });
      }

      await prisma.slot.update({
        where: {
          id: slot_id,
        },
        data: {
          participants: {
            connect: {
              id: user_id,
            },
          },
        },
      });

      const participants = await prisma.user.findMany({
        where: {
          slots: {
            some: {
              id: slot_id,
            },
          },
        },
      });

      let participants_count_new = participants?.length ?? -1;

      return new Response(
        JSON.stringify({
          updated: participants_count_new > participants_count,
          participants: participants,
        }),
        {
          status: 200,
        },
      );
    } catch (error) {
      console.log(error);

      return new Response(JSON.stringify(error), {
        status: 400,
      });
    }
  } else {
    return new Response(JSON.stringify("User not logged in or insufficient permissions !"), {
      status: 400,
    });
  }
};
