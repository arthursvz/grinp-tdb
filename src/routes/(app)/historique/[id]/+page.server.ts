import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getHistoryAccess, getHistoryPageData } from "$lib/server/history";
import { historyActions, assertViewAccess } from "$lib/server/history-actions";

const ensureUser = (userId: string | null | undefined) => {
  if (!userId) {
    throw redirect(302, "/login");
  }
  return userId;
};

export const load: PageServerLoad = async ({ locals, params }) => {
  const viewerId = ensureUser(locals.user?.id);
  const targetUserId = params.id;

  const access = await getHistoryAccess(viewerId);
  await assertViewAccess(viewerId, targetUserId);
  const isSelf = viewerId === targetUserId;

  const data = await getHistoryPageData({
    targetUserId,
    includeUsers: access.canViewAll,
    includeInactiveRoutes: access.canEditRoutes,
  });

  if (!data.targetUser) {
    throw fail(404, { message: "Utilisateur introuvable" });
  }

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
    canEditTarget: viewerId === targetUserId || access.canEditAll,
    ...data,
  };
};

export const actions: Actions = historyActions;
