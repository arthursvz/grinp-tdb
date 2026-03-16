import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger"; // <--- IMPORT
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async (event: RequestEvent) => {
    const { user_id } = await event.request.json();
    const user = event.locals.user;

    const prisma_user = await prisma.user.findUnique({ where: { id: user?.id } });
    if (!prisma_user?.root) {
        return new Response(JSON.stringify({ ok: false, error: "Non autorisé" }), { status: 403 });
    }

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: user_id } });
        const newState = !targetUser?.instructor;

        await prisma.user.update({
            where: { id: user_id },
            data: { instructor: newState }
        });

        // --- LOG ---
        await logger.log(
            prisma_user.id, 
            "TOGGLE_INSTRUCTOR", 
            `Statut Instructeur : ${newState ? "NOMMÉ" : "RÉVOQUÉ"}`, 
            `TargetUser: ${user_id}`
        );
        // -----------

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
