import prisma from "$lib/server/prisma";
import { logger } from "$lib/server/logger";
import { fail } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import { requireActionRead, requireActionWrite } from "$lib/server/bureau-access";

async function assertViewAccess(viewerId: string, targetUserId: string) {
  if (viewerId === targetUserId) return;
  const access = await requireActionRead(viewerId, "history.view");
  if (!access.ok) {
    throw fail(access.status, { message: access.error });
  }
}

async function assertEditAccess(viewerId: string, targetUserId: string) {
  if (viewerId === targetUserId) return;
  const access = await requireActionWrite(viewerId, "history.edit");
  if (!access.ok) {
    throw fail(access.status, { message: access.error });
  }
}

function resolveTargetUserId(viewerId: string, form: FormData, paramsId?: string | null) {
  const formUserId = form.get("userId") as string | null;
  if (formUserId) return formUserId;
  if (paramsId) return paramsId;
  return viewerId;
}

export const historyActions = {
  createSession: async (event: RequestEvent) => {
    const { request, locals, params } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const form = await request.formData();
    const targetUserId = resolveTargetUserId(viewerId, form, params?.id ?? null);
    await assertEditAccess(viewerId, targetUserId);

    const dateRaw = form.get("date") as string | null;
    const sessionType = (form.get("sessionType") as string | null) || "external";
    const slotIdRaw = form.get("slotId") as string | null;
    const durationRaw = form.get("durationMinutes") as string | null;
    const feeling = (form.get("feeling") as string | null) || null;

    if (!dateRaw) return fail(400, { message: "Date manquante" });

    const isExternal = sessionType === "external";
    const slotId = isExternal ? null : slotIdRaw || null;
    const durationMinutes = durationRaw ? Number.parseInt(durationRaw, 10) : null;

    const created = await prisma.climbingSession.create({
      data: {
        userId: targetUserId,
        date: new Date(dateRaw),
        slotId,
        durationMinutes: Number.isNaN(durationMinutes as number) ? null : durationMinutes,
        feeling,
        isExternal,
      },
    });

    await logger.log(
      viewerId,
      "HISTORY_CREATE_SESSION",
      `sessionId=${created.id} external=${isExternal}`,
      targetUserId,
    );

    return { success: true };
  },

  updateSession: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const form = await request.formData();
    const sessionId = form.get("sessionId") as string | null;
    const dateRaw = form.get("date") as string | null;
    const sessionType = (form.get("sessionType") as string | null) || "external";
    const slotIdRaw = form.get("slotId") as string | null;
    const durationRaw = form.get("durationMinutes") as string | null;
    const feeling = (form.get("feeling") as string | null) || null;

    if (!sessionId || !dateRaw) return fail(400, { message: "Champs manquants" });

    const session = await prisma.climbingSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!session) return fail(404, { message: "Seance introuvable" });
    await assertEditAccess(viewerId, session.userId);

    const isExternal = sessionType === "external";
    const slotId = isExternal ? null : slotIdRaw || null;
    const durationMinutes = durationRaw ? Number.parseInt(durationRaw, 10) : null;

    await prisma.climbingSession.update({
      where: { id: sessionId },
      data: {
        date: new Date(dateRaw),
        slotId,
        durationMinutes: Number.isNaN(durationMinutes as number) ? null : durationMinutes,
        feeling,
        isExternal,
      },
    });

    await logger.log(
      viewerId,
      "HISTORY_UPDATE_SESSION",
      `sessionId=${sessionId} external=${isExternal}`,
      session.userId,
    );

    return { success: true };
  },

  deleteSession: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const form = await request.formData();
    const sessionId = form.get("sessionId") as string | null;
    if (!sessionId) return fail(400, { message: "ID manquant" });

    const session = await prisma.climbingSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!session) return fail(404, { message: "Seance introuvable" });
    await assertEditAccess(viewerId, session.userId);

    await prisma.climbingSession.delete({ where: { id: sessionId } });

    await logger.log(
      viewerId,
      "HISTORY_DELETE_SESSION",
      `sessionId=${sessionId}`,
      session.userId,
    );

    return { success: true };
  },

  addAttempt: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const form = await request.formData();
    const sessionId = form.get("sessionId") as string | null;
    const routeId = form.get("routeId") as string | null;
    const success = form.get("success") === "on";
    const completionRaw = form.get("completion") as string | null;

    if (!sessionId || !routeId) return fail(400, { message: "Champs manquants" });

    const session = await prisma.climbingSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });
    if (!session) return fail(404, { message: "Seance introuvable" });
    await assertEditAccess(viewerId, session.userId);

    let completion = completionRaw ? Number.parseInt(completionRaw, 10) : 0;
    if (Number.isNaN(completion)) completion = 0;
    completion = Math.min(100, Math.max(0, completion));
    if (success) completion = 100;

    const created = await prisma.climbingAttempt.create({
      data: {
        sessionId,
        routeId,
        success,
        completion,
      },
    });

    await logger.log(
      viewerId,
      "HISTORY_ADD_ATTEMPT",
      `attemptId=${created.id} success=${success} completion=${completion}`,
      session.userId,
    );

    return { success: true };
  },

  deleteAttempt: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const form = await request.formData();
    const attemptId = form.get("attemptId") as string | null;
    if (!attemptId) return fail(400, { message: "ID manquant" });

    const attempt = await prisma.climbingAttempt.findUnique({
      where: { id: attemptId },
      include: { session: true },
    });

    if (!attempt) return fail(404, { message: "Tentative introuvable" });
    await assertEditAccess(viewerId, attempt.session.userId);

    await prisma.climbingAttempt.delete({ where: { id: attemptId } });

    await logger.log(
      viewerId,
      "HISTORY_DELETE_ATTEMPT",
      `attemptId=${attemptId}`,
      attempt.session.userId,
    );

    return { success: true };
  },

  createRoute: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const access = await requireActionWrite(viewerId, "history.routes.edit");
    if (!access.ok) return fail(access.status, { message: access.error });

    const form = await request.formData();
    const name = form.get("name") as string | null;
    const relay = form.get("relay") as string | null;
    const color = form.get("color") as string | null;
    const grade = form.get("grade") as string | null;

    if (!name || !relay || !color || !grade) return fail(400, { message: "Champs manquants" });

    const created = await prisma.climbingRoute.create({
      data: { name, relay, color, grade },
    });

    await logger.log(
      viewerId,
      "HISTORY_CREATE_ROUTE",
      `routeId=${created.id} grade=${created.grade}`,
      created.name,
    );

    return { success: true };
  },

  toggleRoute: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const access = await requireActionWrite(viewerId, "history.routes.edit");
    if (!access.ok) return fail(access.status, { message: access.error });

    const form = await request.formData();
    const routeId = form.get("routeId") as string | null;
    const active = form.get("active") === "true";

    if (!routeId) return fail(400, { message: "ID manquant" });

    const updated = await prisma.climbingRoute.update({
      where: { id: routeId },
      data: { active },
    });

    await logger.log(
      viewerId,
      "HISTORY_TOGGLE_ROUTE",
      `routeId=${routeId} active=${active}`,
      updated.name,
    );

    return { success: true };
  },

  updateRoute: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const access = await requireActionWrite(viewerId, "history.routes.edit");
    if (!access.ok) return fail(access.status, { message: access.error });

    const form = await request.formData();
    const routeId = form.get("routeId") as string | null;
    const name = form.get("name") as string | null;
    const relay = form.get("relay") as string | null;
    const color = form.get("color") as string | null;
    const grade = form.get("grade") as string | null;
    const active = form.get("active") === "on";

    if (!routeId || !name || !relay || !color || !grade) {
      return fail(400, { message: "Champs manquants" });
    }

    const updated = await prisma.climbingRoute.update({
      where: { id: routeId },
      data: { name, relay, color, grade, active },
    });

    await logger.log(
      viewerId,
      "HISTORY_UPDATE_ROUTE",
      `routeId=${updated.id} grade=${updated.grade} active=${updated.active}`,
      updated.name,
    );

    return { success: true };
  },

  deleteRoute: async (event: RequestEvent) => {
    const { request, locals } = event;
    const viewerId = locals.user?.id;
    if (!viewerId) return fail(401, { message: "Non autorise" });

    const access = await requireActionWrite(viewerId, "history.routes.edit");
    if (!access.ok) return fail(access.status, { message: access.error });

    const form = await request.formData();
    const routeId = form.get("routeId") as string | null;
    if (!routeId) return fail(400, { message: "ID manquant" });

    const result = await prisma.$transaction(async (tx) => {
      const attempts = await tx.climbingAttempt.deleteMany({ where: { routeId } });
      const deleted = await tx.climbingRoute.delete({ where: { id: routeId } });
      return { deleted, attemptsCount: attempts.count };
    });

    await logger.log(
      viewerId,
      "HISTORY_DELETE_ROUTE",
      `routeId=${routeId} attemptsDeleted=${result.attemptsCount}`,
      result.deleted.name,
    );

    return { success: true };
  },
};

export { assertViewAccess };
