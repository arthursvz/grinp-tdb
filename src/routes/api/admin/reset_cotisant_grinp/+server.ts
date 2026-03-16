import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger";
import type { RequestEvent } from "@sveltejs/kit";
import { requireActionWrite } from "$lib/server/bureau-access";

export const POST = async (event: RequestEvent) => {
    const user = event.locals.user;

    const access = await requireActionWrite(user?.id, "cotisations.reset");
    if (!access.ok) {
        return new Response(JSON.stringify({ ok: false, error: access.error }), { status: access.status });
    }

    try {
        await prisma.user.updateMany({
            data: { cotisant_grinp: false }
        });

        await logger.log(
            access.user.id,
            "GESTION_RESET_COTISANT_GRINP",
            "Remise a zero des cotisations Gr'INP",
            "SYSTEM_WIDE",
        );

        return new Response(JSON.stringify({ ok: true, message: "All Gr'INP cotisations reset" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
