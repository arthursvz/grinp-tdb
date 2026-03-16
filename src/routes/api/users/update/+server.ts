import prisma from "$lib/server/prisma";
import { logger } from "$lib/server/logger";
import { requireActionWrite, type ActionKey } from "$lib/server/bureau-access";
import type { RequestEvent } from "@sveltejs/kit";

const ALLOWED_FIELDS = [
  "churros_uid",
  "first_name",
  "last_name",
  "email",
  "instructor",
  "bureau",
  "bureau_role",
  "cotisant_as",
  "cotisant_grinp",
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];

type UpdatePayload = Partial<Record<AllowedField, string | boolean | null>>;

export const POST = async (event: RequestEvent) => {
  const user = event.locals.user;
  const body = await event.request.json();
  const userId = body?.user_id as string | undefined;
  const data = (body?.data ?? {}) as UpdatePayload;
  const scope = (body?.scope as string | undefined) ?? "PRESIDENCE";

  if (!userId) {
    return new Response(JSON.stringify({ ok: false, error: "Utilisateur manquant" }), { status: 400 });
  }

  const allowedByScope =
    scope === "TRESORERIE" || scope === "SECRETAIRE"
      ? ["cotisant_as", "cotisant_grinp"]
      : scope === "VICE_PRESIDENCE"
        ? ["instructor", "cotisant_as", "cotisant_grinp"]
        : (ALLOWED_FIELDS as readonly string[]);

  const payload: UpdatePayload = {};
  for (const [key, value] of Object.entries(data)) {
    if (allowedByScope.includes(key)) {
      payload[key as AllowedField] = value as UpdatePayload[AllowedField];
    }
  }

  const keys = Object.keys(payload);
  if (keys.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: "Aucune modification" }), { status: 400 });
  }

  const requiredActions = new Set<ActionKey>();
  if ("cotisant_as" in payload || "cotisant_grinp" in payload) {
    requiredActions.add("members.edit.cotisations");
  }
  if ("instructor" in payload) {
    requiredActions.add("members.edit.instructor");
  }
  if ("bureau" in payload || "bureau_role" in payload) {
    requiredActions.add("members.edit.roles");
  }
  if ("first_name" in payload || "last_name" in payload || "email" in payload || "churros_uid" in payload) {
    requiredActions.add("members.edit.identity");
  }

  for (const action of requiredActions) {
    const access = await requireActionWrite(user?.id, action);
    if (!access.ok) {
      return new Response(JSON.stringify({ ok: false, error: access.error }), { status: access.status });
    }
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { first_name: true, last_name: true, email: true },
    });

    await prisma.user.update({
      where: { id: userId },
      data: payload,
    });

    const changedFields = Object.entries(payload)
      .map(([key, value]) => {
        if (typeof value === "boolean") return `${key}=${value}`;
        if (value === null) return `${key}=null`;
        return `${key}=${String(value)}`;
      })
      .join(" ");

    await logger.log(
      user?.id ?? "unknown",
      "GESTION_UPDATE_USER",
      `fields=${changedFields}`,
      targetUser ? `${targetUser.first_name} ${targetUser.last_name}`.trim() : userId,
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
  }
};
