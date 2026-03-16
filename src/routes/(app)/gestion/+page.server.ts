import prisma from "$lib/server/prisma";
import { logger } from "$lib/server/logger";
import { fail, redirect } from "@sveltejs/kit";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { Actions, PageServerLoad } from "./$types";
import {
  actionKeys,
  buildActionMatrix,
  getActionAccessForUser,
  getActionAccessForUserNoRoot,
  type ActionKey,
} from "$lib/server/bureau-access";

export const config = {
  bodyParser: {
    sizeLimit: "5mb",
  },
};

const bureauRoles = [
  "BUREAU",
  "PRESIDENT",
  "VICE_PRESIDENT",
  "TRESORIER",
  "SECRETAIRE",
  "MATERIEL",
] as const;

type BureauRole = (typeof bureauRoles)[number];
type AccessLevel = "NONE" | "READ" | "WRITE";
type ActionMatrix = Record<BureauRole, Record<ActionKey, AccessLevel>>;

type DbUserAccess = {
  id: string;
  root: boolean;
  bureau: boolean;
  bureau_role: BureauRole | null;
};

const actionLabels: Record<ActionKey, string> = {
  "view.members": "Voir la liste des membres",
  "view.slots": "Voir la liste des creneaux",
  "view.meetings": "Voir la liste des comptes rendus",
  "view.inventory": "Voir la liste de l'inventaire",
  "view.finance": "Voir les flux d'argent",
  "view.betas": "Voir la liste des betas",
  "view.logs": "Voir les logs",
  "history.view": "Voir l'historique",
  "history.edit": "Editer l'historique",
  "history.routes.edit": "Editer les voies",
  "finance.create": "Creer un flux d'argent",
  "finance.edit": "Editer un flux d'argent",
  "finance.delete": "Supprimer un flux d'argent",
  "inventory.create": "Creer du materiel",
  "inventory.edit": "Editer du materiel",
  "inventory.delete": "Supprimer du materiel",
  "meetings.create": "Ajouter un compte rendu",
  "meetings.edit": "Editer un compte rendu",
  "meetings.delete": "Supprimer un compte rendu",
  "slots.edit.capacity": "Modifier la jauge d'un creneau",
  "slots.edit.details": "Modifier le nom et la description d'un creneau",
  "slots.edit.responsibles": "Modifier les coencadrants ou responsables",
  "slots.edit.type": "Modifier le type de creneau",
  "members.edit.identity": "Modifier l'identite d'un membre",
  "members.edit.cotisations": "Modifier les statuts de cotisation",
  "members.edit.instructor": "Modifier le statut initiateur",
  "members.edit.roles": "Modifier les fonctions au sein du bureau",
  "members.delete": "Supprimer un membre",
  "cotisations.reset": "Reinitialiser les cotisations",
  "alerts.edit": "Alerte site",
  "permissions.edit": "Modifier les permissions",
  "database.export": "Exporter la base",
};

const uploadsBaseDir = process.env.NODE_ENV === "production"
  ? path.join(process.cwd(), "build", "client", "uploads")
  : path.join(process.cwd(), "static", "uploads");

const getUploadsDir = (subdir: string) => path.join(uploadsBaseDir, subdir);

function assertActionAccess(user: DbUserAccess, matrix: ActionMatrix, action: ActionKey): void {
  if (user.root) return;
  if (!user.bureau) {
    throw fail(403, { message: "Non autorise" });
  }
  const bureauAccess = matrix.BUREAU?.[action] ?? "NONE";
  const roleAccess = user.bureau_role ? matrix[user.bureau_role]?.[action] ?? "NONE" : "NONE";
  const access = mergeAccess(bureauAccess, roleAccess);
  if (access !== "WRITE") {
    throw fail(403, { message: "Non autorise" });
  }
}

function mergeAccess(left: AccessLevel, right: AccessLevel): AccessLevel {
  if (left === "WRITE" || right === "WRITE") return "WRITE";
  if (left === "READ" || right === "READ") return "READ";
  return "NONE";
}

async function getDbUser(userId: string | undefined | null): Promise<DbUserAccess | null> {
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      root: true,
      bureau: true,
      bureau_role: true,
    },
  });
}

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(302, "/login");
  }

  const dbUser = await getDbUser(user.id);
  if (!dbUser || (!dbUser.root && !dbUser.bureau)) {
    throw redirect(302, "/");
  }

  const actionPermissions = await prisma.actionPermission.findMany();
  const actionMatrix = buildActionMatrix(actionPermissions as any);
  const accessForUserActions = getActionAccessForUser(dbUser, actionMatrix);
  const baseAccessForUserActions = getActionAccessForUserNoRoot(dbUser, actionMatrix);

  const [users, inventoryItems, events, meetings, financeEntries, slots, betasCount, totalMembers] = await Promise.all([
    prisma.user.findMany({
      orderBy: { last_name: "asc" },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        bureau: true,
        bureau_role: true,
        root: true,
        instructor: true,
        cotisant_as: true,
        cotisant_grinp: true,
      },
    }),
    prisma.inventoryItem.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.clubEvent.findMany({
      orderBy: { date: "desc" },
      include: {
        responsibles: {
          select: { id: true, first_name: true, last_name: true },
        },
      },
    }),
    prisma.meeting.findMany({ orderBy: { date: "desc" } }),
    prisma.financeEntry.findMany({ orderBy: { date: "desc" } }),
    prisma.slot.findMany({
      include: {
        owner: { select: { id: true, first_name: true, last_name: true, email: true } },
        responsibles: { select: { id: true, first_name: true, last_name: true, email: true } },
        attendees: { select: { id: true, first_name: true, last_name: true, email: true } },
        participants: { select: { id: true, first_name: true, last_name: true, email: true } },
      },
      orderBy: { starts_at: "desc" },
    }),
    prisma.dailyBeta.count(),
    prisma.user.count(),
  ]);

  const financeEntriesSerialized = financeEntries.map((entry) => ({
    ...entry,
    amount: Number(entry.amount),
  }));

  return {
    currentUser: dbUser,
    users,
    inventoryItems,
    events,
    meetings,
    financeEntries: financeEntriesSerialized,
    slots,
    stats: {
      betasCount,
      totalMembers,
    },
    roles: bureauRoles,
    actionKeys,
    actionLabels,
    actionMatrix,
    accessForUserActions,
    baseAccessForUserActions,
  };
};

export const actions: Actions = {
  updateUserRole: async ({ request, locals }) => {
    const data = await request.formData();
    const userId = data.get("userId") as string | null;
    const bureau = data.get("bureau") === "on";
    const bureauRole = data.get("bureau_role") as BureauRole | null;

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "members.edit.roles");

    if (!userId) return fail(400, { message: "Utilisateur manquant" });

    await prisma.user.update({
      where: { id: userId },
      data: {
        bureau,
        bureau_role: bureau ? bureauRole : null,
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_UPDATE_USER_ROLE",
      `bureau=${bureau} role=${bureauRole ?? "null"}`,
      userId,
    );

    return { success: true };
  },

  updateActionPermission: async ({ request, locals }) => {
    const data = await request.formData();
    const role = data.get("role") as BureauRole | null;
    const action = data.get("action") as ActionKey | null;
    const access = data.get("access") as AccessLevel | null;

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });
    if (!dbUser.root) return fail(403, { message: "Non autorise" });

    if (!role || !action || !access) return fail(400, { message: "Champs manquants" });

    await prisma.actionPermission.upsert({
      where: { role_action: { role, action } },
      update: { access },
      create: { role, action, access },
    });

    await logger.log(
      dbUser.id,
      "GESTION_UPDATE_ACTION_PERMISSION",
      `role=${role} action=${action} access=${access}`,
    );

    return { success: true };
  },

  addInventoryItem: async ({ request, locals }) => {
    const data = await request.formData();
    const name = data.get("name") as string | null;
    const brand = (data.get("brand") as string | null) || null;
    const status = (data.get("status") as string | null) || null;
    const notes = (data.get("notes") as string | null) || null;
    const quantityRaw = data.get("quantity") as string | null;
    const acquiredYearRaw = data.get("acquiredYear") as string | null;
    const manufacturedYearRaw = data.get("manufacturedYear") as string | null;
    const expirationYearRaw = data.get("expirationYear") as string | null;
    const photo = data.get("photo");

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "inventory.create");

    if (!name) return fail(400, { message: "Nom manquant" });

    let photoUrl: string | null = null;
    if (photo instanceof File && photo.size > 0) {
      const uploadsDir = getUploadsDir("inventory");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const arrayBuffer = await photo.arrayBuffer();
      await writeFile(path.join(uploadsDir, fileName), Buffer.from(arrayBuffer));
      photoUrl = `/uploads/inventory/${fileName}`;
    }

    const created = await prisma.inventoryItem.create({
      data: {
        name,
        brand,
        status,
        notes,
        quantity: quantityRaw ? Number(quantityRaw) : 1,
        acquiredYear: acquiredYearRaw ? Number(acquiredYearRaw) : null,
        manufacturedYear: manufacturedYearRaw ? Number(manufacturedYearRaw) : null,
        expirationYear: expirationYearRaw ? Number(expirationYearRaw) : null,
        photoUrl,
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_ADD_INVENTORY",
      `id=${created.id} quantite=${created.quantity}`,
      created.name,
    );

    return { success: true };
  },

  deleteInventoryItem: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id") as string | null;

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "inventory.delete");

    if (!id) return fail(400, { message: "ID manquant" });

    const existing = await prisma.inventoryItem.findUnique({
      where: { id },
      select: { name: true },
    });

    await prisma.inventoryItem.delete({ where: { id } });

    await logger.log(
      dbUser.id,
      "GESTION_DELETE_INVENTORY",
      `id=${id}`,
      existing?.name ?? id,
    );
    return { success: true };
  },

  updateInventoryItem: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id") as string | null;
    const name = data.get("name") as string | null;
    const brand = (data.get("brand") as string | null) || null;
    const status = (data.get("status") as string | null) || null;
    const notes = (data.get("notes") as string | null) || null;
    const quantityRaw = data.get("quantity") as string | null;
    const acquiredYearRaw = data.get("acquiredYear") as string | null;
    const manufacturedYearRaw = data.get("manufacturedYear") as string | null;
    const expirationYearRaw = data.get("expirationYear") as string | null;
    const photo = data.get("photo");

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "inventory.edit");

    if (!id || !name) return fail(400, { message: "Champs manquants" });

    const current = await prisma.inventoryItem.findUnique({ where: { id }, select: { photoUrl: true } });
    let photoUrl = current?.photoUrl ?? null;

    if (photo instanceof File && photo.size > 0) {
      const uploadsDir = getUploadsDir("inventory");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const arrayBuffer = await photo.arrayBuffer();
      await writeFile(path.join(uploadsDir, fileName), Buffer.from(arrayBuffer));
      photoUrl = `/uploads/inventory/${fileName}`;
    }

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name,
        brand,
        status,
        notes,
        quantity: quantityRaw ? Number(quantityRaw) : 1,
        acquiredYear: acquiredYearRaw ? Number(acquiredYearRaw) : null,
        manufacturedYear: manufacturedYearRaw ? Number(manufacturedYearRaw) : null,
        expirationYear: expirationYearRaw ? Number(expirationYearRaw) : null,
        photoUrl,
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_UPDATE_INVENTORY",
      `id=${updated.id} quantite=${updated.quantity}`,
      updated.name,
    );

    return { success: true };
  },

  addEvent: async ({ request, locals }) => {
    const data = await request.formData();
    const title = data.get("title") as string | null;
    const status = (data.get("status") as string | null) || "PLANNED";
    const dateRaw = data.get("date") as string | null;
    const notes = (data.get("notes") as string | null) || null;
    const responsibleIds = data.getAll("responsibleIds").filter(Boolean) as string[];

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "meetings.create");

    if (!title) return fail(400, { message: "Titre manquant" });

    const created = await prisma.clubEvent.create({
      data: {
        title,
        status: status as any,
        date: dateRaw ? new Date(dateRaw) : null,
        notes,
        responsibles: {
          connect: responsibleIds.map((id) => ({ id })),
        },
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_ADD_EVENT",
      `id=${created.id} status=${created.status}`,
      created.title,
    );

    return { success: true };
  },

  deleteEvent: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id") as string | null;

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "meetings.delete");

    if (!id) return fail(400, { message: "ID manquant" });

    const existing = await prisma.clubEvent.findUnique({
      where: { id },
      select: { title: true },
    });

    await prisma.clubEvent.delete({ where: { id } });

    await logger.log(
      dbUser.id,
      "GESTION_DELETE_EVENT",
      `id=${id}`,
      existing?.title ?? id,
    );
    return { success: true };
  },

  addMeeting: async ({ request, locals }) => {
    const data = await request.formData();
    const title = data.get("title") as string | null;
    const dateRaw = data.get("date") as string | null;
    const attendees = (data.get("attendees") as string | null) || null;
    const minutes = (data.get("minutes") as string | null) || null;
    const fileUrlInput = (data.get("fileUrl") as string | null) || null;
    const minutesFile = data.get("minutesFile");

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "meetings.create");

    if (!title || !dateRaw) return fail(400, { message: "Champs manquants" });

    let fileUrl = fileUrlInput;
    if (minutesFile instanceof File && minutesFile.size > 0) {
      const uploadsDir = getUploadsDir("meetings");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = minutesFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const arrayBuffer = await minutesFile.arrayBuffer();
      await writeFile(path.join(uploadsDir, fileName), Buffer.from(arrayBuffer));
      fileUrl = `/uploads/meetings/${fileName}`;
    }

    const created = await prisma.meeting.create({
      data: {
        title,
        date: new Date(dateRaw),
        attendees,
        minutes,
        fileUrl,
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_ADD_MEETING",
      `id=${created.id}`,
      created.title,
    );

    return { success: true };
  },

  updateMeeting: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id") as string | null;
    const title = data.get("title") as string | null;
    const dateRaw = data.get("date") as string | null;
    const attendees = (data.get("attendees") as string | null) || null;
    const minutes = (data.get("minutes") as string | null) || null;
    const file = data.get("minutesFile");

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "meetings.edit");

    if (!id || !title || !dateRaw) return fail(400, { message: "Champs manquants" });

    const current = await prisma.meeting.findUnique({ where: { id }, select: { fileUrl: true } });
    let fileUrl = current?.fileUrl ?? null;

    if (file instanceof File && file.size > 0) {
      const uploadsDir = getUploadsDir("meetings");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const arrayBuffer = await file.arrayBuffer();
      await writeFile(path.join(uploadsDir, fileName), Buffer.from(arrayBuffer));
      fileUrl = `/uploads/meetings/${fileName}`;
    }

    const updated = await prisma.meeting.update({
      where: { id },
      data: {
        title,
        date: new Date(dateRaw),
        attendees,
        minutes,
        fileUrl,
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_UPDATE_MEETING",
      `id=${updated.id}`,
      updated.title,
    );

    return { success: true };
  },

  deleteMeeting: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id") as string | null;

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "meetings.delete");

    if (!id) return fail(400, { message: "ID manquant" });

    const existing = await prisma.meeting.findUnique({
      where: { id },
      select: { title: true },
    });

    await prisma.meeting.delete({ where: { id } });

    await logger.log(
      dbUser.id,
      "GESTION_DELETE_MEETING",
      `id=${id}`,
      existing?.title ?? id,
    );
    return { success: true };
  },

  addFinanceEntry: async ({ request, locals }) => {
    const data = await request.formData();
    const label = data.get("label") as string | null;
    const amountRaw = data.get("amount") as string | null;
    const type = data.get("type") as string | null;
    const category = (data.get("category") as string | null) || null;
    const dateRaw = data.get("date") as string | null;
    const notes = (data.get("notes") as string | null) || null;
    const justificatif = data.get("justificatif");

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "finance.create");

    if (!label || !amountRaw || !type || !dateRaw) {
      return fail(400, { message: "Champs manquants" });
    }

    let justificatifUrl: string | null = null;
    if (justificatif instanceof File && justificatif.size > 0) {
      const uploadsDir = path.join(process.cwd(), "static", "uploads", "finance");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = justificatif.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const arrayBuffer = await justificatif.arrayBuffer();
      await writeFile(path.join(uploadsDir, fileName), Buffer.from(arrayBuffer));
      justificatifUrl = `/uploads/finance/${fileName}`;
    }

    const amount = Number.parseFloat(amountRaw);
    if (Number.isNaN(amount)) {
      return fail(400, { message: "Montant invalide" });
    }

    const created = await prisma.financeEntry.create({
      data: {
        label,
        amount,
        type: type as any,
        category,
        date: new Date(dateRaw),
        notes,
        justificatifUrl,
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_ADD_FINANCE",
      `id=${created.id} montant=${amount} type=${created.type}`,
      created.label,
    );

    return { success: true };
  },

  updateFinanceEntry: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id") as string | null;
    const label = data.get("label") as string | null;
    const amountRaw = data.get("amount") as string | null;
    const type = data.get("type") as string | null;
    const category = (data.get("category") as string | null) || null;
    const dateRaw = data.get("date") as string | null;
    const notes = (data.get("notes") as string | null) || null;
    const justificatif = data.get("justificatif");

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "finance.edit");

    if (!id || !label || !amountRaw || !type || !dateRaw) {
      return fail(400, { message: "Champs manquants" });
    }

    const amount = Number.parseFloat(amountRaw);
    if (Number.isNaN(amount)) {
      return fail(400, { message: "Montant invalide" });
    }

    const current = await prisma.financeEntry.findUnique({ where: { id }, select: { justificatifUrl: true } });
    let justificatifUrl = current?.justificatifUrl ?? null;

    if (justificatif instanceof File && justificatif.size > 0) {
      const uploadsDir = path.join(process.cwd(), "static", "uploads", "finance");
      await mkdir(uploadsDir, { recursive: true });
      const safeName = justificatif.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const arrayBuffer = await justificatif.arrayBuffer();
      await writeFile(path.join(uploadsDir, fileName), Buffer.from(arrayBuffer));
      justificatifUrl = `/uploads/finance/${fileName}`;
    }

    const updated = await prisma.financeEntry.update({
      where: { id },
      data: {
        label,
        amount,
        type: type as any,
        category,
        date: new Date(dateRaw),
        notes,
        justificatifUrl,
      },
    });

    await logger.log(
      dbUser.id,
      "GESTION_UPDATE_FINANCE",
      `id=${updated.id} montant=${amount} type=${updated.type}`,
      updated.label,
    );

    return { success: true };
  },

  deleteFinanceEntry: async ({ request, locals }) => {
    const data = await request.formData();
    const id = data.get("id") as string | null;

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "finance.delete");

    if (!id) return fail(400, { message: "ID manquant" });

    const existing = await prisma.financeEntry.findUnique({
      where: { id },
      select: { label: true },
    });

    await prisma.financeEntry.delete({ where: { id } });

    await logger.log(
      dbUser.id,
      "GESTION_DELETE_FINANCE",
      `id=${id}`,
      existing?.label ?? id,
    );
    return { success: true };
  },

  toggleInstructor: async ({ request, locals }) => {
    const data = await request.formData();
    const userId = data.get("userId") as string | null;

    const dbUser = await getDbUser(locals.user?.id);
    if (!dbUser) return fail(401, { message: "Non autorise" });

    const permissions = await prisma.actionPermission.findMany();
    const matrix = buildActionMatrix(permissions as any);
    assertActionAccess(dbUser, matrix, "members.edit.instructor");

    if (!userId) return fail(400, { message: "Utilisateur manquant" });

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) return fail(404, { message: "Utilisateur introuvable" });

    await prisma.user.update({
      where: { id: userId },
      data: { instructor: !target.instructor },
    });

    await logger.log(
      dbUser.id,
      "GESTION_TOGGLE_INSTRUCTOR",
      `instructor=${!target.instructor}`,
      userId,
    );

    return { success: true };
  },
};
