import prisma from "@/server/prisma";

export const POST = async (event) => {
    const { user_id } = await event.request.json();

    const user = event.locals.user;

    const prisma_user = await prisma.user.findUnique({
        where: {
            id: user?.id,
        },
    });

    if (prisma_user?.root) {
        try {
            // Promote the user to instructor
            await prisma.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    instructor: true,
                },
            });

            return new Response(JSON.stringify("User promoted to instructor !"), {
                status: 200,
            });
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
