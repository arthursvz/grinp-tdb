import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger"; // <--- IMPORT AJOUTÉ
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { slot_id } = await event.request.json();

    const user = event.locals.user;

    const prisma_user = await prisma.user.findUnique({
        where: {
            id: user?.id,
        },
    });

    if (prisma_user?.root) {
        try {
            await prisma.slot.delete({
                where: {
                    id: slot_id,
                },
            });

            // --- LOG AJOUTÉ ---
            await logger.log(prisma_user.id, "DELETE_SLOT", "Suppression via Calendrier", `SlotID: ${slot_id}`);
            // ------------------

            return new Response(
                JSON.stringify("Slot deleted !"),
                { status: 200 },
            );
        } catch (error) {
            console.log(error);
            return new Response(JSON.stringify(error), { status: 400 });
        }
    } else {
        return new Response(JSON.stringify("User not logged in or insufficient permissions !"), { status: 400 });
    }
};
