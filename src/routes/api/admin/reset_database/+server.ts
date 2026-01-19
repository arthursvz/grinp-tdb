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
        // Delete all records in order of dependencies
        await prisma.contribution.deleteMany({});
        await prisma.session.deleteMany({});
        await prisma.slot.deleteMany({});
        await prisma.user.deleteMany({});

        return new Response(JSON.stringify({ ok: true, message: "Database reset complete" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
    }
};
