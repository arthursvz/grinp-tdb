import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger";
import type { RequestHandler } from "./$types";

const managerSelect = { id: true, first_name: true, last_name: true, cotisant_as: true, cotisant_grinp: true };
const minimalSelect = { id: true };

export const POST: RequestHandler = async (event) => {
    const { user_id, slot_id } = await event.request.json();
    const sessionUser = event.locals.user;

    if (!sessionUser) return new Response(JSON.stringify("Unauthorized"), { status: 401 });

    try {
        const slot = await prisma.slot.findUnique({
            where: { id: slot_id },
            include: { responsibles: { select: { id: true } } }
        });

        if (!slot) return new Response(JSON.stringify("Slot not found"), { status: 404 });

        const dbUser = await prisma.user.findUnique({ where: { id: sessionUser.id } });
        const isOwner = dbUser?.instructor && slot.owner_id === dbUser.id;
        const isResponsible = slot.responsibles.some(r => r.id === dbUser?.id);
        const isRoot = !!dbUser?.root;
        const canManage = isRoot || isOwner || isResponsible;

        if (user_id !== sessionUser.id && !canManage) {
            return new Response(JSON.stringify("Forbidden"), { status: 403 });
        }

        const isAttendee = await prisma.user.count({
            where: { id: user_id, attended_slots: { some: { id: slot_id } } }
        });

        const updateData: any = { participants: { disconnect: { id: user_id } } };
        if (isAttendee > 0) updateData.attendees = { disconnect: { id: user_id } };

        await prisma.slot.update({ where: { id: slot_id }, data: updateData });

        const action = sessionUser.id === user_id ? "UNSUBSCRIBE" : "KICK_USER";
        const details = sessionUser.id !== user_id ? "Exclu par l'admin" : "Désinscription volontaire";
        await logger.log(sessionUser.id, action, details, `User: ${user_id} | Slot: ${slot_id}`);

        const rawParticipants = await prisma.user.findMany({
            where: { slots: { some: { id: slot_id } } },
            select: canManage ? managerSelect : minimalSelect
        });

        // --- FIX : ANONYMISATION INTELLIGENTE ---
        const participants = canManage 
            ? rawParticipants 
            : rawParticipants.map((p, i) => {
                if (p.id === sessionUser.id) return { ...p, first_name: "Moi", last_name: "" };
                return { id: `anon-${i}`, first_name: "Grimpeur", last_name: "" };
            });

        return new Response(JSON.stringify({ updated: true, participants }), { status: 200 });

    } catch (error) {
        console.error("Erreur désinscription:", error);
        return new Response(JSON.stringify({ updated: false, error: "Erreur technique" }), { status: 400 });
    }
};
