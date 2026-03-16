import { slotScheme } from "@/index";
import prisma from "@/server/prisma";
import { logger } from "$lib/server/logger";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
    const { form, today, slot_id } = await event.request.json();
    const result = await superValidate(form, zod(slotScheme));

    if (!result.valid) {
        return new Response(JSON.stringify("Form invalid"), { status: 400 });
    }

    const user = event.locals.user;
    const prisma_user = await prisma.user.findUnique({ where: { id: user?.id } });
    const slot = await prisma.slot.findUnique({ where: { id: slot_id } });
    const isOwner = prisma_user?.instructor && slot?.owner_id === prisma_user.id;

    if (prisma_user?.root || isOwner) {
        try {
            const starts_date = new Date(`${today}T${form.date.starts_at}:00`);
            const ends_date = new Date(`${today}T${form.date.ends_at}:00`);

            await prisma.slot.update({
                where: { id: slot_id },
                data: {
                    name: form.title,
                    description: form.description,
                    starts_at: starts_date,
                    ends_at: ends_date,
                    capacity: form.capacity,
                    slot_type: result.data.slot_type, // Enregistrement du type
                },
            });

            await logger.log(
                prisma_user.id,
                "UPDATE_SLOT",
                `Modif: ${form.title} (${result.data.slot_type})`,
                `SlotID: ${slot_id}`
            );

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify(error), { status: 400 });
        }
    }
    return new Response(JSON.stringify("Non autorisé"), { status: 403 });
};
