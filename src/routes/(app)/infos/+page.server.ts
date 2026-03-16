import { fail } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import { logger } from "$lib/server/logger";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    
    let isRoot = false;
    if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        isRoot = dbUser?.root || false;
    }

    const infos = await prisma.info.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: { first_name: true, last_name: true }
            }
        }
    });

    return {
        infos,
        isRoot
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const user = locals.user;
        const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

        if (!dbUser?.root) return fail(403, { message: "Non autorisé" });

        const data = await request.formData();
        const title = data.get("title") as string;
        const content = data.get("content") as string;
        // On récupère le lien, si vide on met null
        const linkRaw = data.get("link") as string;
        const link = linkRaw && linkRaw.trim() !== "" ? linkRaw.trim() : null;

        if (!title || !content) return fail(400, { message: "Champs manquants" });

        try {
            const newInfo = await prisma.info.create({
                data: {
                    title,
                    content,
                    link, // <--- AJOUTÉ
                    authorId: dbUser.id
                }
            });

            await logger.log(dbUser.id, "CREATE_INFO", `Titre: ${title}`, `InfoID: ${newInfo.id}`);
            return { success: true };
        } catch (e) {
            console.error(e);
            return fail(500, { message: "Erreur serveur" });
        }
    },

    update: async ({ request, locals }) => {
        const user = locals.user;
        const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

        if (!dbUser?.root) return fail(403, { message: "Non autorisé" });

        const data = await request.formData();
        const id = data.get("id") as string;
        const title = data.get("title") as string;
        const content = data.get("content") as string;
        // Gestion du lien
        const linkRaw = data.get("link") as string;
        const link = linkRaw && linkRaw.trim() !== "" ? linkRaw.trim() : null;

        try {
            await prisma.info.update({
                where: { id },
                data: { title, content, link } // <--- AJOUTÉ
            });

            await logger.log(dbUser.id, "UPDATE_INFO", `Modification info`, `InfoID: ${id}`);
            return { success: true };
        } catch (e) {
            return fail(500, { message: "Erreur lors de la modification" });
        }
    },

    delete: async ({ request, locals }) => {
        const user = locals.user;
        const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;

        if (!dbUser?.root) return fail(403, { message: "Non autorisé" });

        const data = await request.formData();
        const id = data.get("id") as string;

        try {
            await prisma.info.delete({ where: { id } });
            await logger.log(dbUser.id, "DELETE_INFO", "Suppression info", `InfoID: ${id}`);
            return { success: true };
        } catch (e) {
            return fail(500, { message: "Erreur lors de la suppression" });
        }
    }
};
