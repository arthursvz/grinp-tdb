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

        // Get all slots where user is participant
        const participantSlots = await prisma.slot.findMany({
            where: {
                participants: {
                    some: { id: user_id }
                }
            },
            include: {
                participants: true,
                attendees: true,
            }
        });

        // Get all slots where user is owner/responsible
        const ownerSlots = await prisma.slot.findMany({
            where: {
                owner_id: user_id
            },
            include: {
                participants: true,
                attendees: true,
            }
        });

        // Calculate statistics
        const totalSlotSubscriptions = participantSlots.length;
        const attendedSlots = participantSlots.filter(slot => 
            slot.attendees.some(a => a.id === user_id)
        );
        const totalAttendances = attendedSlots.length;

        // Total climbing duration (only for slots where user attended, not just subscribed)
        const totalClimbingDuration = attendedSlots.reduce((total, slot) => {
            const start = new Date(slot.starts_at);
            const end = new Date(slot.ends_at);
            const duration = (end.getTime() - start.getTime()) / (1000 * 60); // in minutes
            return total + duration;
        }, 0);

        // Slots opened by user (as owner)
        const slotsOpened = ownerSlots.length;

        // Total duration of opened slots
        const totalOpenedDuration = ownerSlots.reduce((total, slot) => {
            const start = new Date(slot.starts_at);
            const end = new Date(slot.ends_at);
            const duration = (end.getTime() - start.getTime()) / (1000 * 60); // in minutes
            return total + duration;
        }, 0);

        // Total participants in all slots opened by user
        const totalParticipantsInOpenedSlots = ownerSlots.reduce((total, slot) => {
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
