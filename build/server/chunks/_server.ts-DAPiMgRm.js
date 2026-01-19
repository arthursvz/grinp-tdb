import { p as prisma } from './prisma-D9xrZjJk.js';
import '@prisma/client';

const POST = async (event) => {
  const { slot_id } = await event.request.json();
  const sessionUser = event.locals.user;
  try {
    const slot = await prisma.slot.findUnique({ where: { id: slot_id } });
    if (!slot) {
      return new Response(JSON.stringify({ error: "Slot not found" }), { status: 404 });
    }
    const dbUser = sessionUser ? await prisma.user.findUnique({ where: { id: sessionUser.id } }) : null;
    const can_view = !!dbUser?.root || !!dbUser?.instructor ? slot.owner_id === dbUser?.id || !!dbUser?.root : true;
    if (!can_view) {
      return new Response(JSON.stringify("Insufficient permissions"), { status: 403 });
    }
    return new Response(JSON.stringify({ slot }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 400 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-DAPiMgRm.js.map
