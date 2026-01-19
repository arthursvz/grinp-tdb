import prisma from "@/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const sessionUser = event.locals.user;
    const dbUser = await prisma.user.findUnique({ where: { id: sessionUser?.id } });
    if (!dbUser?.root) {
        return new Response(JSON.stringify("Insufficient permissions"), { status: 403 });
    }

    try {
        const slots = await prisma.slot.findMany({ include: { responsibles: true, participants: true } });
        let updated = 0;

        for (const slot of slots) {
            const needsResponsible = !slot.responsibles.some((r) => r.id === slot.owner_id);
            const needsParticipant = !slot.participants.some((p) => p.id === slot.owner_id);

            if (needsResponsible || needsParticipant) {
                await prisma.slot.update({
                    where: { id: slot.id },
                    data: {
                        responsibles: needsResponsible ? { connect: { id: slot.owner_id } } : undefined,
                        participants: needsParticipant ? { connect: { id: slot.owner_id } } : undefined,
                    }
                });
                updated += 1;
            }
        }

        return new Response(JSON.stringify({ updated }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(error), { status: 400 });
    }
};
