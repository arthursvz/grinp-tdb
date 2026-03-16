import prisma from "$lib/server/prisma";

const bureauModules = [
  "PRESIDENCE",
  "VICE_PRESIDENCE",
  "TRESORERIE",
  "SECRETAIRE",
  "MATERIEL",
] as const;

const bureauRoles = [
  "BUREAU",
  "PRESIDENT",
  "VICE_PRESIDENT",
  "TRESORIER",
  "SECRETAIRE",
  "MATERIEL",
] as const;

type BureauModule = (typeof bureauModules)[number];
type BureauRole = (typeof bureauRoles)[number];
type AccessLevel = "NONE" | "READ" | "WRITE";

type PermissionMatrix = Record<BureauRole, Record<BureauModule, AccessLevel>>;
type ActionMatrix = Record<BureauRole, Record<ActionKey, AccessLevel>>;

type DbUserAccess = {
  id: string;
  root: boolean;
  bureau: boolean;
  bureau_role: BureauRole | null;
};

const DEFAULT_MATRIX: PermissionMatrix = {
  BUREAU: {
    PRESIDENCE: "NONE",
    VICE_PRESIDENCE: "NONE",
    TRESORERIE: "NONE",
    SECRETAIRE: "NONE",
    MATERIEL: "NONE",
  },
  PRESIDENT: {
    PRESIDENCE: "WRITE",
    VICE_PRESIDENCE: "WRITE",
    TRESORERIE: "WRITE",
    SECRETAIRE: "WRITE",
    MATERIEL: "WRITE",
  },
  VICE_PRESIDENT: {
    PRESIDENCE: "NONE",
    VICE_PRESIDENCE: "WRITE",
    TRESORERIE: "NONE",
    SECRETAIRE: "READ",
    MATERIEL: "READ",
  },
  TRESORIER: {
    PRESIDENCE: "NONE",
    VICE_PRESIDENCE: "NONE",
    TRESORERIE: "WRITE",
    SECRETAIRE: "READ",
    MATERIEL: "WRITE",
  },
  SECRETAIRE: {
    PRESIDENCE: "NONE",
    VICE_PRESIDENCE: "NONE",
    TRESORERIE: "NONE",
    SECRETAIRE: "WRITE",
    MATERIEL: "NONE",
  },
  MATERIEL: {
    PRESIDENCE: "NONE",
    VICE_PRESIDENCE: "NONE",
    TRESORERIE: "NONE",
    SECRETAIRE: "READ",
    MATERIEL: "WRITE",
  },
};

const actionKeys = [
  "view.members",
  "view.slots",
  "view.meetings",
  "view.inventory",
  "view.finance",
  "view.betas",
  "view.logs",
  "history.view",
  "history.edit",
  "history.routes.edit",
  "finance.create",
  "finance.edit",
  "finance.delete",
  "inventory.create",
  "inventory.edit",
  "inventory.delete",
  "meetings.create",
  "meetings.edit",
  "meetings.delete",
  "slots.edit.capacity",
  "slots.edit.details",
  "slots.edit.responsibles",
  "slots.edit.type",
  "members.edit.identity",
  "members.edit.cotisations",
  "members.edit.instructor",
  "members.edit.roles",
  "members.delete",
  "cotisations.reset",
  "alerts.edit",
  "permissions.edit",
  "database.export",
] as const;

type ActionKey = (typeof actionKeys)[number];

const DEFAULT_ACTION_MATRIX: ActionMatrix = {
  BUREAU: {
    "view.members": "NONE",
    "view.slots": "NONE",
    "view.meetings": "NONE",
    "view.inventory": "NONE",
    "view.finance": "NONE",
    "view.betas": "NONE",
    "view.logs": "NONE",
    "history.view": "NONE",
    "history.edit": "NONE",
    "history.routes.edit": "NONE",
    "finance.create": "NONE",
    "finance.edit": "NONE",
    "finance.delete": "NONE",
    "inventory.create": "NONE",
    "inventory.edit": "NONE",
    "inventory.delete": "NONE",
    "meetings.create": "NONE",
    "meetings.edit": "NONE",
    "meetings.delete": "NONE",
    "slots.edit.capacity": "NONE",
    "slots.edit.details": "NONE",
    "slots.edit.responsibles": "NONE",
    "slots.edit.type": "NONE",
    "members.edit.identity": "NONE",
    "members.edit.cotisations": "NONE",
    "members.edit.instructor": "NONE",
    "members.edit.roles": "NONE",
    "members.delete": "NONE",
    "cotisations.reset": "NONE",
    "alerts.edit": "NONE",
    "permissions.edit": "NONE",
    "database.export": "NONE",
  },
  PRESIDENT: {
    "view.members": "READ",
    "view.slots": "READ",
    "view.meetings": "READ",
    "view.inventory": "READ",
    "view.finance": "READ",
    "view.betas": "READ",
    "view.logs": "READ",
    "history.view": "READ",
    "history.edit": "WRITE",
    "history.routes.edit": "WRITE",
    "finance.create": "WRITE",
    "finance.edit": "WRITE",
    "finance.delete": "WRITE",
    "inventory.create": "WRITE",
    "inventory.edit": "WRITE",
    "inventory.delete": "WRITE",
    "meetings.create": "WRITE",
    "meetings.edit": "WRITE",
    "meetings.delete": "WRITE",
    "slots.edit.capacity": "WRITE",
    "slots.edit.details": "WRITE",
    "slots.edit.responsibles": "WRITE",
    "slots.edit.type": "WRITE",
    "members.edit.identity": "WRITE",
    "members.edit.cotisations": "WRITE",
    "members.edit.instructor": "WRITE",
    "members.edit.roles": "WRITE",
    "members.delete": "WRITE",
    "cotisations.reset": "WRITE",
    "alerts.edit": "WRITE",
    "permissions.edit": "NONE",
    "database.export": "WRITE",
  },
  VICE_PRESIDENT: {
    "view.members": "READ",
    "view.slots": "READ",
    "view.meetings": "READ",
    "view.inventory": "READ",
    "view.finance": "READ",
    "view.betas": "NONE",
    "view.logs": "NONE",
    "history.view": "NONE",
    "history.edit": "NONE",
    "history.routes.edit": "NONE",
    "finance.create": "NONE",
    "finance.edit": "NONE",
    "finance.delete": "NONE",
    "inventory.create": "NONE",
    "inventory.edit": "NONE",
    "inventory.delete": "NONE",
    "meetings.create": "NONE",
    "meetings.edit": "NONE",
    "meetings.delete": "NONE",
    "slots.edit.capacity": "NONE",
    "slots.edit.details": "NONE",
    "slots.edit.responsibles": "NONE",
    "slots.edit.type": "NONE",
    "members.edit.identity": "NONE",
    "members.edit.cotisations": "NONE",
    "members.edit.instructor": "WRITE",
    "members.edit.roles": "NONE",
    "members.delete": "NONE",
    "cotisations.reset": "NONE",
    "alerts.edit": "NONE",
    "permissions.edit": "NONE",
    "database.export": "NONE",
  },
  TRESORIER: {
    "view.members": "READ",
    "view.slots": "READ",
    "view.meetings": "READ",
    "view.inventory": "READ",
    "view.finance": "READ",
    "view.betas": "NONE",
    "view.logs": "NONE",
    "history.view": "NONE",
    "history.edit": "NONE",
    "history.routes.edit": "NONE",
    "finance.create": "WRITE",
    "finance.edit": "WRITE",
    "finance.delete": "WRITE",
    "inventory.create": "WRITE",
    "inventory.edit": "WRITE",
    "inventory.delete": "WRITE",
    "meetings.create": "NONE",
    "meetings.edit": "NONE",
    "meetings.delete": "NONE",
    "slots.edit.capacity": "NONE",
    "slots.edit.details": "NONE",
    "slots.edit.responsibles": "NONE",
    "slots.edit.type": "NONE",
    "members.edit.identity": "NONE",
    "members.edit.cotisations": "WRITE",
    "members.edit.instructor": "NONE",
    "members.edit.roles": "NONE",
    "members.delete": "NONE",
    "cotisations.reset": "WRITE",
    "alerts.edit": "NONE",
    "permissions.edit": "NONE",
    "database.export": "NONE",
  },
  SECRETAIRE: {
    "view.members": "READ",
    "view.slots": "READ",
    "view.meetings": "READ",
    "view.inventory": "READ",
    "view.finance": "READ",
    "view.betas": "NONE",
    "view.logs": "NONE",
    "history.view": "NONE",
    "history.edit": "NONE",
    "history.routes.edit": "NONE",
    "finance.create": "NONE",
    "finance.edit": "NONE",
    "finance.delete": "NONE",
    "inventory.create": "NONE",
    "inventory.edit": "NONE",
    "inventory.delete": "NONE",
    "meetings.create": "WRITE",
    "meetings.edit": "WRITE",
    "meetings.delete": "WRITE",
    "slots.edit.capacity": "NONE",
    "slots.edit.details": "NONE",
    "slots.edit.responsibles": "NONE",
    "slots.edit.type": "NONE",
    "members.edit.identity": "NONE",
    "members.edit.cotisations": "WRITE",
    "members.edit.instructor": "NONE",
    "members.edit.roles": "NONE",
    "members.delete": "NONE",
    "cotisations.reset": "NONE",
    "alerts.edit": "NONE",
    "permissions.edit": "NONE",
    "database.export": "NONE",
  },
  MATERIEL: {
    "view.members": "READ",
    "view.slots": "READ",
    "view.meetings": "READ",
    "view.inventory": "READ",
    "view.finance": "READ",
    "view.betas": "NONE",
    "view.logs": "NONE",
    "history.view": "NONE",
    "history.edit": "NONE",
    "history.routes.edit": "NONE",
    "finance.create": "NONE",
    "finance.edit": "NONE",
    "finance.delete": "NONE",
    "inventory.create": "WRITE",
    "inventory.edit": "WRITE",
    "inventory.delete": "WRITE",
    "meetings.create": "NONE",
    "meetings.edit": "NONE",
    "meetings.delete": "NONE",
    "slots.edit.capacity": "NONE",
    "slots.edit.details": "NONE",
    "slots.edit.responsibles": "NONE",
    "slots.edit.type": "NONE",
    "members.edit.identity": "NONE",
    "members.edit.cotisations": "NONE",
    "members.edit.instructor": "NONE",
    "members.edit.roles": "NONE",
    "members.delete": "NONE",
    "cotisations.reset": "NONE",
    "alerts.edit": "NONE",
    "permissions.edit": "NONE",
    "database.export": "NONE",
  },
};

function buildPermissionMatrix(
  permissions: { role: BureauRole; module: BureauModule; access: AccessLevel }[],
): PermissionMatrix {
  const matrix: PermissionMatrix = JSON.parse(JSON.stringify(DEFAULT_MATRIX));
  for (const permission of permissions) {
    matrix[permission.role][permission.module] = permission.access;
  }
  return matrix;
}

function buildActionMatrix(
  permissions: { role: BureauRole; action: ActionKey; access: AccessLevel }[],
): ActionMatrix {
  const matrix: ActionMatrix = JSON.parse(JSON.stringify(DEFAULT_ACTION_MATRIX));
  for (const permission of permissions) {
    if (matrix[permission.role]?.[permission.action] !== undefined) {
      matrix[permission.role][permission.action] = permission.access;
    }
  }
  return matrix;
}

function getActionAccessForUser(user: DbUserAccess, matrix: ActionMatrix): Record<ActionKey, AccessLevel> {
  if (user.root) {
    return actionKeys.reduce((acc, key) => {
      acc[key] = "WRITE";
      return acc;
    }, {} as Record<ActionKey, AccessLevel>);
  }

  if (!user.bureau) {
    return actionKeys.reduce((acc, key) => {
      acc[key] = "NONE";
      return acc;
    }, {} as Record<ActionKey, AccessLevel>);
  }

  const bureauAccess = matrix.BUREAU ?? ({} as Record<ActionKey, AccessLevel>);
  const roleAccess = user.bureau_role ? matrix[user.bureau_role] : null;

  return actionKeys.reduce((acc, key) => {
    const baseAccess = bureauAccess[key] ?? "NONE";
    const roleLevel = roleAccess?.[key] ?? "NONE";
    acc[key] = mergeAccess(baseAccess, roleLevel);
    return acc;
  }, {} as Record<ActionKey, AccessLevel>);
}

function getActionAccessForUserNoRoot(user: DbUserAccess, matrix: ActionMatrix): Record<ActionKey, AccessLevel> {
  if (!user.bureau) {
    return actionKeys.reduce((acc, key) => {
      acc[key] = "NONE";
      return acc;
    }, {} as Record<ActionKey, AccessLevel>);
  }

  const bureauAccess = matrix.BUREAU ?? ({} as Record<ActionKey, AccessLevel>);
  const roleAccess = user.bureau_role ? matrix[user.bureau_role] : null;

  return actionKeys.reduce((acc, key) => {
    const baseAccess = bureauAccess[key] ?? "NONE";
    const roleLevel = roleAccess?.[key] ?? "NONE";
    acc[key] = mergeAccess(baseAccess, roleLevel);
    return acc;
  }, {} as Record<ActionKey, AccessLevel>);
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

export async function requireModuleWrite(userId: string | undefined | null, module: BureauModule) {
  const dbUser = await getDbUser(userId);
  if (!dbUser) {
    return { ok: false, status: 401, error: "Non autorise" } as const;
  }

  if (dbUser.root) {
    return { ok: true, user: dbUser } as const;
  }

  if (!dbUser.bureau || !dbUser.bureau_role) {
    return { ok: false, status: 403, error: "Non autorise" } as const;
  }

  const permissions = await prisma.bureauPermission.findMany();
  const matrix = buildPermissionMatrix(permissions as any);
  const access = matrix[dbUser.bureau_role][module];
  if (access !== "WRITE") {
    return { ok: false, status: 403, error: "Non autorise" } as const;
  }

  return { ok: true, user: dbUser } as const;
}

export async function requireActionWrite(userId: string | undefined | null, action: ActionKey) {
  const dbUser = await getDbUser(userId);
  if (!dbUser) {
    return { ok: false, status: 401, error: "Non autorise" } as const;
  }

  if (dbUser.root) {
    return { ok: true, user: dbUser } as const;
  }

  if (!dbUser.bureau) {
    return { ok: false, status: 403, error: "Non autorise" } as const;
  }

  const permissions = await prisma.actionPermission.findMany();
  const matrix = buildActionMatrix(permissions as any);
  const bureauAccess = matrix.BUREAU?.[action] ?? "NONE";
  const roleAccess = dbUser.bureau_role ? matrix[dbUser.bureau_role]?.[action] ?? "NONE" : "NONE";
  const access = mergeAccess(bureauAccess, roleAccess);
  if (access !== "WRITE") {
    return { ok: false, status: 403, error: "Non autorise" } as const;
  }

  return { ok: true, user: dbUser } as const;
}

export async function requireActionRead(userId: string | undefined | null, action: ActionKey) {
  const dbUser = await getDbUser(userId);
  if (!dbUser) {
    return { ok: false, status: 401, error: "Non autorise" } as const;
  }

  if (dbUser.root) {
    return { ok: true, user: dbUser } as const;
  }

  if (!dbUser.bureau) {
    return { ok: false, status: 403, error: "Non autorise" } as const;
  }

  const permissions = await prisma.actionPermission.findMany();
  const matrix = buildActionMatrix(permissions as any);
  const bureauAccess = matrix.BUREAU?.[action] ?? "NONE";
  const roleAccess = dbUser.bureau_role ? matrix[dbUser.bureau_role]?.[action] ?? "NONE" : "NONE";
  const access = mergeAccess(bureauAccess, roleAccess);
  if (access === "NONE") {
    return { ok: false, status: 403, error: "Non autorise" } as const;
  }

  return { ok: true, user: dbUser } as const;
}

export type { BureauModule, ActionKey };
export { actionKeys, buildActionMatrix, getActionAccessForUser, getActionAccessForUserNoRoot };
