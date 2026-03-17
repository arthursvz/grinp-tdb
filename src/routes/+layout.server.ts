import prisma from "@/server/prisma";
import type { ServerLoadEvent } from "@sveltejs/kit";
import { loadFlash } from "sveltekit-flash-message/server";

export const load = loadFlash(async (event: ServerLoadEvent) => {
  const user = event.locals.user;

  // --- NOUVEAU : Récupération de l'alerte globale ---
  // On le fait en dehors du try/catch user pour que l'alerte s'affiche même si la DB user plante
  let alertMessage = null;
  try {
      const alert = await prisma.globalAlert.findFirst({
          where: { active: true }
      });
      alertMessage = alert?.message ?? null;
  } catch (e) {
      console.error("Impossible de charger l'alerte globale", e);
  }
  // ---------------------------------------------------

  try {
    if (user) {
      const prisma_user = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      const root = prisma_user?.root ?? false;
      const instructor = prisma_user?.instructor ?? false;
      const bureau = prisma_user?.bureau ?? false;
      const bureauRole = prisma_user?.bureau_role ?? null;
      const canGestion = root || bureau;

      return {
        user: event.locals.user,
        root: root,
        instructor: instructor,
        bureau: bureau,
        bureauRole: bureauRole,
        cotisant_as: prisma_user?.cotisant_as ?? false,
        cotisant_grinp: prisma_user?.cotisant_grinp ?? false,
        canGestion: canGestion,
        globalAlert: alertMessage // <--- Ajouté ici
      };
    } else {
      return {
        user: null,
        root: false,
        instructor: false,
        bureau: false,
        bureauRole: null,
        cotisant_as: false,
        cotisant_grinp: false,
        canGestion: false,
        globalAlert: alertMessage // <--- Ajouté ici (visiteur non connecté)
      };
    }
  } catch (error) {
    return {
      user: null,
      root: false,
      instructor: false,
      bureau: false,
      bureauRole: null,
      cotisant_as: false,
      cotisant_grinp: false,
      canGestion: false,
      globalAlert: alertMessage // <--- Ajouté ici (fallback erreur)
    };
  }
});
