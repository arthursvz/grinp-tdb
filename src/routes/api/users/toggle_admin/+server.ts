import prisma from "@/server/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async (event: RequestEvent) => {
    const { user_id } = await event.request.json();

    const user = event.locals.user;

    const prisma_user = await prisma.user.findUnique({
        where: {
            id: user?.id,
        },
    });

    if (!prisma_user?.root) {
        return new Response(JSON.stringify({ ok: false, error: "Insufficient permissions" }), { status: 403 });
    }

    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: user_id },
            select: { root: true }
        });

        await prisma.user.update({
            where: { id: user_id },
            data: { root: !targetUser?.root }
        });

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
