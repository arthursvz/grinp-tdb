import { p as prisma } from './prisma-D9xrZjJk.js';
import '@prisma/client';

const POST = async (event) => {
  const { startOfDay, endOfDay } = await event.request.json();
  const user = event.locals.user;
  if (user) {
    try {
      const slots = await prisma.slot.findMany({
        where: {
          starts_at: {
            gte: startOfDay,
            lt: endOfDay
          }
        },
        select: {
          slot_type: true
        }
      });
      const exists = slots.length > 0;
      const slotTypes = exists ? slots.map((s) => s.slot_type) : [];
      return new Response(
        JSON.stringify({ exists, slot_types: slotTypes }),
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

export { POST };
//# sourceMappingURL=_server.ts-Iwss79IM.js.map
