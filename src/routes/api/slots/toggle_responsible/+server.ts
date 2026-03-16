import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger"; // <--- IMPORT
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { user_id, slot_id } = await event.request.json();
    const user = event.locals.user;
    const prisma_user = await prisma.user.findUnique({ where: { id: user?.id } });

    // Vérif droits
    const slot = await prisma.slot.findUnique({ where: { id: slot_id }, include: { responsibles: true } });
    const isOwner = prisma_user?.instructor && slot?.owner_id === prisma_user.id;

    if (prisma_user?.root || isOwner) {
        try {
            const isAlreadyResponsible = slot?.responsibles.some(r => r.id === user_id);
            
            if (isAlreadyResponsible) {
                await prisma.slot.update({
                    where: { id: slot_id },
                    data: { responsibles: { disconnect: { id: user_id } } }
                });
            } else {
                await prisma.slot.update({
                    where: { id: slot_id },
                    data: { responsibles: { connect: { id: user_id } } }
                });
            }

            // --- LOG ---
            await logger.log(
                prisma_user.id, 
                "TOGGLE_RESPONSIBLE", 
                `Responsable: ${isAlreadyResponsible ? "RETIRÉ" : "AJOUTÉ"}`, 
                `User: ${user_id} | Slot: ${slot_id}`
            );
            // -----------

            return new Response(JSON.stringify({ ok: true }), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify(error), { status: 400 });
        }
    }
    return new Response(JSON.stringify("Non autorisé"), { status: 403 });
};
