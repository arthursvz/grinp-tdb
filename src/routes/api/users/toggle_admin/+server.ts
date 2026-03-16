import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger"; // <--- IMPORT AJOUTÉ
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async (event: RequestEvent) => {
    const { user_id } = await event.request.json();

    const user = event.locals.user;

    const prisma_user = await prisma.user.findUnique({
        where: {
            id: user?.id,
        },
    });

    if (!prisma_user?.root) {
        return new Response(JSON.stringify({ ok: false, error: "Insufficient permissions" }), { status: 403 });
    }

    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: user_id },
            select: { root: true }
        });

        await prisma.user.update({
            where: { id: user_id },
            data: { root: !targetUser?.root }
        });

        // --- LOG AJOUTÉ ---
        await logger.log(
            prisma_user.id, 
            "TOGGLE_ROOT", 
            `Nouveau statut root : ${!targetUser?.root}`, 
            `TargetUser: ${user_id}`
        );
        // ------------------

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
