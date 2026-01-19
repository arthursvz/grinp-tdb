import prisma from "@/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { slot_id } = await event.request.json();
    const sessionUser = event.locals.user;

    try {
        const slot = await prisma.slot.findUnique({ where: { id: slot_id } });
        if (!slot) {
            return new Response(JSON.stringify({ error: "Slot not found" }), { status: 404 });
        }

        // Permission: root can view; instructor can view if owner; regular users can view
        const dbUser = sessionUser
            ? await prisma.user.findUnique({ where: { id: sessionUser.id } })
            : null;

        const can_view = !!dbUser?.root || !!dbUser?.instructor ? (slot.owner_id === dbUser?.id || !!dbUser?.root) : true;
        if (!can_view) {
            return new Response(JSON.stringify("Insufficient permissions"), { status: 403 });
        }

        return new Response(JSON.stringify({ slot }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 400 });
    }
};
