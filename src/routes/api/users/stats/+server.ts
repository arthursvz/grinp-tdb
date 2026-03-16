import prisma from "@/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { user_id } = await event.request.json();

    if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id is required" }), {
            status: 400,
        });
    }

    try {
        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: user_id },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        // 1. STATS GRIMPEUR (Filtré : Pas de FERMETURE)
        const participantSlots = await prisma.slot.findMany({
            where: {
                participants: {
                    some: { id: user_id }
                },
                slot_type: { not: "FERMETURE" } // <--- Exclu ici
            },
            include: {
                participants: true,
                attendees: true,
            }
        });

        // 2. STATS ENCADRANT (Filtré : Pas de FERMETURE + Responsable)
        const responsibleSlots = await prisma.slot.findMany({
            where: {
                responsibles: {
                    some: { id: user_id }
                },
                slot_type: { not: "FERMETURE" } // <--- Exclu ici
            },
            include: {
                participants: true,
                attendees: true,
            }
        });

        // --- CALCULS ---

        // Stat 1 : Inscriptions totales (hors fermetures)
        const totalSlotSubscriptions = participantSlots.length;

        // Stat 2 & 3 : Présences et Durée de grimpe
        const attendedSlots = participantSlots.filter(slot =>
            slot.attendees.some(a => a.id === user_id)
        );
        const totalAttendances = attendedSlots.length;

        const totalClimbingDuration = attendedSlots.reduce((total, slot) => {
            const start = new Date(slot.starts_at);
            const end = new Date(slot.ends_at);
            const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
            return total + duration;
        }, 0);

        // Stat 4 : Créneaux encadrés (hors fermetures)
        const slotsOpened = responsibleSlots.length;

        // Stat 5 : Durée d'encadrement (hors fermetures)
        const totalOpenedDuration = responsibleSlots.reduce((total, slot) => {
            const start = new Date(slot.starts_at);
            const end = new Date(slot.ends_at);
            const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
            return total + duration;
        }, 0);

        // Stat 6 : Participants gérés (hors fermetures)
        const totalParticipantsInOpenedSlots = responsibleSlots.reduce((total, slot) => {
            return total + slot.participants.length;
        }, 0);

        return new Response(
            JSON.stringify({
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    instructor: user.instructor,
                    root: user.root,
                    cotisant_as: user.cotisant_as,
                    cotisant_grinp: user.cotisant_grinp,
                },
                stats: {
                    totalSlotSubscriptions,
                    totalAttendances,
                    totalClimbingDuration,
                    slotsOpened,
                    totalOpenedDuration,
                    totalParticipantsInOpenedSlots,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
};
