import prisma from "@/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { user_id, slot_id } = await event.request.json();

    const user = event.locals.user;

    const can_manage = await prisma.user.findUnique({
        where: {
            id: user?.id
        }
    }).then((u) => u?.root
    || (
            u?.instructor &&
            (prisma.slot.findUnique({
                where: {
                    id: slot_id
                }
            }).then((s) => s?.owner_id === user?.id))
        )
    );

    if (can_manage) {
        try {
            await prisma.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    attended_slots: {
                        connect: {
                            id: slot_id,
                        },
                    },
                },
            });


            const attendees = await prisma.user.findMany({
                where: {
                    attended_slots: {
                        some: {
                            id: slot_id,
                        },
                    },
                },
            });

            return new Response(
                JSON.stringify({ attendees: attendees }),
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

// TODO: Add better error handling (e.g. 404 if user or slot ids are invalid (undefined))