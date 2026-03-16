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
            include: { 
                responsibles: { select: { id: true } },
                participants: { select: { id: true } } // On charge les participants pour compter
            }
        });

        if (!slot) return new Response(JSON.stringify("Slot not found"), { status: 404 });

        // --- FIX 1 : VERIFICATION DE LA JAUGE ---
        if (slot.participants.length >= slot.capacity) {
            // On vérifie si l'user n'est pas déjà dedans pour éviter un faux message "complet"
            const alreadyIn = slot.participants.some(p => p.id === user_id);
            if (!alreadyIn) {
                return new Response(JSON.stringify({ updated: false, error: "Créneau complet" }), { status: 400 });
            }
        }
        // -----------------------------------------

        const dbUser = await prisma.user.findUnique({ where: { id: sessionUser.id } });

        const isOwner = dbUser?.instructor && slot.owner_id === dbUser.id;
        const isResponsible = slot.responsibles.some(r => r.id === dbUser?.id);
        const isRoot = !!dbUser?.root;
        const canManage = isRoot || isOwner || isResponsible;

        if (user_id !== sessionUser.id && !canManage) {
            return new Response(JSON.stringify("Forbidden"), { status: 403 });
        }

        await prisma.slot.update({
            where: { id: slot_id },
            data: { participants: { connect: { id: user_id } } }
        });

        await logger.log(
            sessionUser.id,
            sessionUser.id === user_id ? "SUBSCRIBE" : "FORCE_SUBSCRIBE",
            sessionUser.id === user_id ? "Inscription volontaire" : "Inscrit par un admin",
            `User: ${user_id} | Slot: ${slot_id}`
        );

        const rawParticipants = await prisma.user.findMany({
            where: { slots: { some: { id: slot_id } } },
            select: canManage ? managerSelect : minimalSelect
        });

        // --- FIX 2 : ANONYMISATION INTELLIGENTE ---
        const participants = canManage 
            ? rawParticipants 
            : rawParticipants.map((p, i) => {
                // Si c'est MOI, je vois mon vrai ID (pour que le bouton marche)
                if (p.id === sessionUser.id) return { ...p, first_name: "Moi", last_name: "(Inscrit)" };
                // Sinon, c'est un anonyme
                return { id: `anon-${i}`, first_name: "Grimpeur", last_name: "" };
            });

        return new Response(JSON.stringify({ updated: true, participants }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ updated: false, error: "Erreur technique" }), { status: 400 });
    }
};
