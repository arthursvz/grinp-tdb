import { p as prisma } from './prisma-D9xrZjJk.js';
import '@prisma/client';

const POST = async (event) => {
  const { user_id, slot_id } = await event.request.json();
  const sessionUser = event.locals.user;
  const dbUser = await prisma.user.findUnique({ where: { id: sessionUser?.id } });
  const slot = await prisma.slot.findUnique({ where: { id: slot_id }, include: { responsibles: true } });
  const can_manage = !!dbUser?.root || !!slot?.responsibles.find((r) => r.id === dbUser?.id);
  if (!can_manage) {
    return new Response(JSON.stringify("User not logged in or insufficient permissions !"), {
      status: 400
    });
  }
  try {
    const userWithAttendance = await prisma.user.findUnique({
      where: { id: user_id },
      include: {
        attended_slots: {
          where: { id: slot_id },
          select: { id: true }
        }
      }
    });
    const alreadyPresent = !!userWithAttendance && userWithAttendance.attended_slots.length > 0;
    await prisma.user.update({
      where: { id: user_id },
      data: {
        attended_slots: alreadyPresent ? { disconnect: { id: slot_id } } : { connect: { id: slot_id } }
      }
    });
    const attendees = await prisma.user.findMany({
      where: {
        attended_slots: {
          some: { id: slot_id }
        }
      }
    });
    return new Response(JSON.stringify({ attendees }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 400 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-DR34sSJ7.js.map
