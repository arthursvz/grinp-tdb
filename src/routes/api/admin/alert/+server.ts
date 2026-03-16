import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger"; // <--- IMPORT
import type { RequestHandler } from "./$types";
import { requireActionWrite } from "$lib/server/bureau-access";

export const POST: RequestHandler = async (event) => {
    const { message, active } = await event.request.json();
    const user = event.locals.user;
    
    const access = await requireActionWrite(user?.id, "alerts.edit");
    if (!access.ok) {
        return new Response(JSON.stringify("Forbidden"), { status: access.status });
    }

    try {
        // On nettoie les anciennes alertes actives
        await prisma.globalAlert.updateMany({ data: { active: false } });

        // On crée la nouvelle
        await prisma.globalAlert.create({
            data: { message, active }
        });

        // --- LOG ---
        await logger.log(
            access.user.id,
            "GLOBAL_ALERT",
            `Alerte ${active ? "ACTIVÉE" : "DÉSACTIVÉE"} : "${message}"`,
            "SITE_WIDE"
        );
        // -----------

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: e }), { status: 500 });
    }
};
