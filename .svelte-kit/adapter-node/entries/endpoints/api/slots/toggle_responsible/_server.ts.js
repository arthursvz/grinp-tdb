import { p as prisma } from "../../../../../chunks/prisma.js";
const POST = async (event) => {
  const { user_id, slot_id } = await event.request.json();
  const sessionUser = event.locals.user;
  const dbUser = await prisma.user.findUnique({ where: { id: sessionUser?.id } });
  const slot = await prisma.slot.findUnique({ where: { id: slot_id }, include: { responsibles: true } });
  if (!slot) {
    return new Response(JSON.stringify({ error: "Slot not found" }), { status: 404 });
  }
  const isResponsible = !!slot.responsibles.find((r) => r.id === dbUser?.id);
  const can_manage = !!dbUser?.root || isResponsible;
  if (!can_manage) {
    return new Response(JSON.stringify("Insufficient permissions"), { status: 403 });
  }
  const target = await prisma.user.findUnique({ where: { id: user_id }, include: { slots: true } });
  const isParticipant = !!target?.slots.find((s) => s.id === slot_id);
  if (!target?.instructor || !isParticipant) {
    return new Response(JSON.stringify("Target must be an instructor and participant"), { status: 400 });
  }
  const alreadyResponsible = !!slot.responsibles.find((r) => r.id === user_id);
  try {
    await prisma.slot.update({
      where: { id: slot_id },
      data: {
        responsibles: alreadyResponsible ? { disconnect: { id: user_id } } : { connect: { id: user_id } }
      }
    });
    const updated = await prisma.slot.findUnique({ where: { id: slot_id }, include: { responsibles: true } });
    return new Response(JSON.stringify({ responsibles: updated?.responsibles ?? [] }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 400 });
  }
};
export {
  POST
};
