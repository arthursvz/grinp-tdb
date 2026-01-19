// @ts-nocheck
import prisma from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {

    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                churros_uid: params.id
            }
        });

        const users = await prisma.user.findMany();
        const slots = await prisma.slot.findMany({
            where: {
                participants: {
                    some: {
                        id: user.id
                    }
                }
            }
        });

        return {
            user: user,
            users: users,
            slots: slots
        }
    } catch (error) {
        return {
            status: 404,
            error: "User not found"
        }
    }
}