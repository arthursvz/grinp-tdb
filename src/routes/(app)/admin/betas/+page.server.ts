import { error } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { Actions, PageServerLoad } from "./$types";
import { buildActionMatrix, getActionAccessForUserNoRoot, requireActionRead } from "$lib/server/bureau-access";

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user?.id) {
    throw error(403, "Acces reserve aux administrateurs");
  }

  const access = await requireActionRead(user.id, "view.betas");
  if (!access.ok) {
    throw error(403, "Acces reserve aux administrateurs");
  }

  const permissions = await prisma.actionPermission.findMany();
  const matrix = buildActionMatrix(permissions as any);
  const baseAccess = getActionAccessForUserNoRoot(user, matrix);
  const rootBypassView = user.root && baseAccess["view.betas"] === "NONE";

  const allBetas = await prisma.dailyBeta.findMany({ orderBy: { created_at: "desc" } });
  return { allBetas, isRoot: user.root, rootBypassView };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user?.root) throw error(403);
    const data = await request.formData();
    const content = data.get("content") as string | null;
    if (!content) throw error(400, "Contenu manquant");
    await prisma.dailyBeta.create({ data: { content } });
  },
  delete: async ({ request, locals }) => {
    if (!locals.user?.root) throw error(403);
    const data = await request.formData();
    const id = data.get("id") as string | null;
    if (!id) throw error(400, "ID manquant");
    await prisma.dailyBeta.delete({ where: { id } });
  },
  toggleSpecial: async ({ request, locals }) => {
    if (!locals.user?.root) throw error(403);
    const data = await request.formData();
    const id = data.get("id") as string | null;
    if (!id) throw error(400, "ID manquant");

    const beta = await prisma.dailyBeta.findUnique({ where: { id } });
    if (!beta) throw error(404, "Beta introuvable");

    if (!beta.is_special) {
      await prisma.dailyBeta.updateMany({ data: { is_special: false } });
    }

    await prisma.dailyBeta.update({
      where: { id },
      data: { is_special: !beta.is_special },
    });
  },
};
