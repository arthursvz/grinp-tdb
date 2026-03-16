import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger";
import { requireActionWrite } from "$lib/server/bureau-access";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { slot_id, owner_id, responsibles_ids } = await event.request.json();
    const user = event.locals.user;

    if (!slot_id) {
        return new Response(JSON.stringify("Slot manquant"), { status: 400 });
    }

    const access = await requireActionWrite(user?.id, "slots.edit.responsibles");
    if (!access.ok) {
        return new Response(JSON.stringify("Non autorise"), { status: access.status });
    }

    const slot = await prisma.slot.findUnique({ where: { id: slot_id } });
    if (!slot) {
        return new Response(JSON.stringify("Slot introuvable"), { status: 404 });
    }

    const nextOwnerId = owner_id || slot.owner_id;
    const responsiblesList = Array.isArray(responsibles_ids) ? responsibles_ids : [];

    try {
        await prisma.slot.update({
            where: { id: slot_id },
            data: {
                owner: { connect: { id: nextOwnerId } },
                responsibles: { set: responsiblesList.map((id: string) => ({ id })) },
            },
        });

        await logger.log(
            access.user.id,
            "UPDATE_SLOT_RELATIONS",
            `Owner=${nextOwnerId} responsibles=${responsiblesList.length}`,
            `SlotID: ${slot_id}`
        );

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
};
