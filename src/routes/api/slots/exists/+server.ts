import prisma from "@/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { startOfDay, endOfDay } = await event.request.json();

    const user = event.locals.user;

    if (user) {
        try {
            const slots = await prisma.slot.findMany({
                where: {
                    starts_at: {
                        gte: startOfDay,
                        lt: endOfDay
                    }
                },
                select: {
                    slot_type: true
                }
            });

            const exists = slots.length > 0;
            // Return all slot types for the day
            const slotTypes = exists ? slots.map(s => s.slot_type) : [];

            return new Response(
                JSON.stringify({ exists: exists, slot_types: slotTypes }),
                {
                    status: 200,
                },
            );
        } catch (error) {
            console.log(error);

            return new Response(JSON.stringify(error), {
                status: 400,
            });
        }
    } else {
        return new Response(JSON.stringify("User not logged in or insufficient permissions !"), {
            status: 400,
        });
    }
};
