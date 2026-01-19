import prisma from "@/server/prisma";
import { SlotType } from "@prisma/client";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { slot_id, name, description, capacity, starts_at, ends_at, slot_type } = await event.request.json();

    const sessionUser = event.locals.user;
    const dbUser = await prisma.user.findUnique({ where: { id: sessionUser?.id } });

    const slot = await prisma.slot.findUnique({ where: { id: slot_id } });
    if (!slot) {
        return new Response(JSON.stringify({ error: "Slot not found" }), { status: 404 });
    }

    // Permission: root or the slot owner (instructor)
    const can_manage = !!dbUser?.root || (!!dbUser?.instructor && slot.owner_id === dbUser.id);
    if (!can_manage) {
        return new Response(JSON.stringify("Insufficient permissions"), { status: 403 });
    }

    try {
        const data: any = {};
        if (typeof name === "string") data.name = name;
        if (typeof description === "string") data.description = description;
        if (typeof capacity === "number") data.capacity = capacity;
        if (typeof starts_at === "string") data.starts_at = new Date(starts_at);
        if (typeof ends_at === "string") data.ends_at = new Date(ends_at);
        if (typeof slot_type === "string" && Object.values(SlotType).includes(slot_type as SlotType)) {
            data.slot_type = slot_type as SlotType;
        }

        const updated = await prisma.slot.update({
            where: { id: slot_id },
            data
        });

        return new Response(JSON.stringify({ slot: updated }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 400 });
    }
};
