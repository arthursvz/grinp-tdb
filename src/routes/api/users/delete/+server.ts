import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger";
import { requireActionWrite } from "$lib/server/bureau-access";
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async (event: RequestEvent) => {
    const { user_id } = await event.request.json();
    const user = event.locals.user;

    const access = await requireActionWrite(user?.id, "members.delete");
    if (!access.ok) {
        return new Response(JSON.stringify({ ok: false, error: access.error }), { status: access.status });
    }
    const prisma_user = await prisma.user.findUnique({ where: { id: user?.id } });

    try {
        // On récupère les infos avant de supprimer pour le log
        const targetUser = await prisma.user.findUnique({ where: { id: user_id } });

        await prisma.user.delete({
            where: { id: user_id }
        });

        // --- LOG ---
        await logger.log(
            prisma_user?.id ?? "unknown",
            "DELETE_USER",
            `Suppression definitive du compte (${targetUser?.email ?? ""})`,
            `TargetUser: ${targetUser?.first_name ?? ""} ${targetUser?.last_name ?? ""}`,
        );
        // -----------

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
