import prisma from "@/server/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export const POST = async (event: RequestEvent) => {
    const user = event.locals.user;

    const prisma_user = await prisma.user.findUnique({
        where: { id: user?.id }
    });

    if (!prisma_user?.root) {
        return new Response(JSON.stringify({ ok: false, error: "Insufficient permissions" }), { status: 403 });
    }

    try {
        await prisma.user.updateMany({
            data: { cotisant_grinp: false }
        });

        return new Response(JSON.stringify({ ok: true, message: "All Gr'INP cotisations reset" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
