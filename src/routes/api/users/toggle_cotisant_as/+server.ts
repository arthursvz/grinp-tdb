import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger"; // <--- IMPORT
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async (event: RequestEvent) => {
    const { user_id } = await event.request.json();
    const user = event.locals.user;

    // Vérification des droits (Root uniquement)
    const prisma_user = await prisma.user.findUnique({ where: { id: user?.id } });
    if (!prisma_user?.root) {
        return new Response(JSON.stringify({ ok: false, error: "Non autorisé" }), { status: 403 });
    }

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: user_id } });
        const newState = !targetUser?.cotisant_as;

        await prisma.user.update({
            where: { id: user_id },
            data: { cotisant_as: newState }
        });

        // --- LOG ---
        await logger.log(
            prisma_user.id, 
            "TOGGLE_COTISANT_AS", 
            `Statut Cotisant AS : ${newState ? "ACTIVÉ" : "DÉSACTIVÉ"}`, 
            `TargetUser: ${user_id}`
        );
        // -----------

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
