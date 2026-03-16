import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getHistoryAccess, getHistoryPageData } from "$lib/server/history";
import { historyActions, assertViewAccess } from "$lib/server/history-actions";

const ensureUser = (userId: string | null | undefined) => {
  if (!userId) {
    throw redirect(302, "/login");
  }
  return userId;
};

export const load: PageServerLoad = async ({ locals }) => {
  const viewerId = ensureUser(locals.user?.id);
  const access = await getHistoryAccess(viewerId);
  await assertViewAccess(viewerId, viewerId);
  const isSelf = true;

  const data = await getHistoryPageData({
    targetUserId: viewerId,
    includeUsers: access.canViewAll,
    includeInactiveRoutes: access.canEditRoutes,
  });

  const rootBypassView = isSelf ? false : access.rootBypassView;
  const rootBypassEdit = isSelf ? false : access.rootBypassEdit;
  const rootBypassRoutes = access.rootBypassRoutes;
  const rootBypass = rootBypassView || rootBypassEdit || rootBypassRoutes;

  return {
    viewer: access.viewer,
    canViewAll: access.canViewAll,
    canEditAll: access.canEditAll,
    canEditRoutes: access.canEditRoutes,
    rootBypass,
    rootBypassView,
    rootBypassEdit,
    rootBypassRoutes,
    canEditTarget: true,
    // Permissions pour le menu Gestion de l'historique (panel)
    canViewHistoryPanel: access.hasViewPermission || access.rootBypassView,
    canEditHistoryRoutes: access.hasEditRoutesPermission || access.rootBypassRoutes,
    rootBypassHistory: access.rootBypassView || access.rootBypassRoutes,
    ...data,
  };
};
export const actions: Actions = historyActions;
