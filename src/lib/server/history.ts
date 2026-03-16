import prisma from "$lib/server/prisma";
import { buildActionMatrix } from "$lib/server/bureau-access";

type AccessLevel = "NONE" | "READ" | "WRITE";

export type HistoryAccess = {
  viewer: {
    id: string;
    root: boolean;
    bureau: boolean;
    bureau_role: string | null;
  } | null;
  canViewAll: boolean;
  canEditAll: boolean;
  canEditRoutes: boolean;
  hasViewPermission: boolean;
  hasEditPermission: boolean;
  hasEditRoutesPermission: boolean;
  rootBypass: boolean;
  rootBypassView: boolean;
  rootBypassEdit: boolean;
  rootBypassRoutes: boolean;
};

export type HistoryStats = {
  totalSessions: number;
  clubSessions: number;
  externalSessions: number;
  totalAttempts: number;
  successAttempts: number;
  successRate: number;
  uniqueRoutes: number;
  bestGradeSuccess: string | null;
  bestGradeAttempted: string | null;
  totalMinutes: number;
  avgMinutes: number;
  avgAttemptsPerSession: number;
  relayStats: Array<{ relay: string; attempted: number; success: number }>;
  monthly: Array<{ month: string; avgGrade: string | null; bestGrade: string | null }>;
};

export type HistoryPageData = {
  targetUser: { id: string; first_name: string; last_name: string; email: string } | null;
  sessions: Array<any>;
  routes: Array<any>;
  routeCatalog: Array<any>;
  slotOptions: Array<any>;
  stats: HistoryStats;
  users: Array<{ id: string; first_name: string; last_name: string; email: string }>;
};

export async function getHistoryAccess(userId: string | null | undefined): Promise<HistoryAccess> {
  if (!userId) {
    return {
      viewer: null,
      canViewAll: false,
      canEditAll: false,
      canEditRoutes: false,
      hasViewPermission: false,
      hasEditPermission: false,
      hasEditRoutesPermission: false,
      rootBypass: false,
      rootBypassView: false,
      rootBypassEdit: false,
      rootBypassRoutes: false,
    };
  }

  const viewer = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, root: true, bureau: true, bureau_role: true },
  });

  if (!viewer) {
    return {
      viewer: null,
      canViewAll: false,
      canEditAll: false,
      canEditRoutes: false,
      hasViewPermission: false,
      hasEditPermission: false,
      hasEditRoutesPermission: false,
      rootBypass: false,
      rootBypassView: false,
      rootBypassEdit: false,
      rootBypassRoutes: false,
    };
  }

  const permissions = await prisma.actionPermission.findMany();
  const matrix = buildActionMatrix(permissions as any);

  const getMatrixAccess = (action: string): AccessLevel => {
    if (!viewer.bureau) return "NONE";
    const bureauAccess = matrix.BUREAU?.[action] ?? "NONE";
    const roleAccess = viewer.bureau_role ? matrix[viewer.bureau_role]?.[action] ?? "NONE" : "NONE";
    if (bureauAccess === "WRITE" || roleAccess === "WRITE") return "WRITE";
    if (bureauAccess === "READ" || roleAccess === "READ") return "READ";
    return "NONE";
  };

  const viewAccess = getMatrixAccess("history.view");
  const editAccess = getMatrixAccess("history.edit");
  const editRoutesAccess = getMatrixAccess("history.routes.edit");

  const hasViewPermission = viewAccess !== "NONE";
  const hasEditPermission = editAccess === "WRITE";
  const hasEditRoutesPermission = editRoutesAccess === "WRITE";
  const canViewAll = hasViewPermission || viewer.root;
  const canEditAll = hasEditPermission || viewer.root;
  const canEditRoutes = hasEditRoutesPermission || viewer.root;
  const rootBypassView = viewer.root && !hasViewPermission;
  const rootBypassEdit = viewer.root && !hasEditPermission;
  const rootBypassRoutes = viewer.root && !hasEditRoutesPermission;
  const rootBypass = rootBypassView || rootBypassEdit || rootBypassRoutes;

  return {
    viewer,
    canViewAll,
    canEditAll,
    canEditRoutes,
    hasViewPermission,
    hasEditPermission,
    hasEditRoutesPermission,
    rootBypass,
    rootBypassView,
    rootBypassEdit,
    rootBypassRoutes,
  };
}

export async function getHistoryPageData(params: {
  targetUserId: string;
  includeUsers: boolean;
  includeInactiveRoutes: boolean;
}): Promise<HistoryPageData> {
  const targetUser = await prisma.user.findUnique({
    where: { id: params.targetUserId },
    select: { id: true, first_name: true, last_name: true, email: true },
  });

  const routes = await prisma.climbingRoute.findMany({
    where: { active: true },
    orderBy: [{ relay: "asc" }, { grade: "asc" }, { name: "asc" }],
  });

  const sessions = await prisma.climbingSession.findMany({
    where: { userId: params.targetUserId },
    include: {
      attempts: { include: { route: true } },
      slot: true,
    },
    orderBy: { date: "desc" },
  });

  const routeCatalogBase = params.includeInactiveRoutes
    ? await prisma.climbingRoute.findMany({
        orderBy: [{ relay: "asc" }, { grade: "asc" }, { name: "asc" }],
      })
    : routes;

  const routeStatsMap = new Map<
    string,
    { count: number; totalCompletion: number; maxCompletion: number; lastAttemptAt: Date | null }
  >();

  for (const session of sessions) {
    for (const attempt of session.attempts || []) {
      if (!attempt.routeId) continue;
      const entry = routeStatsMap.get(attempt.routeId) ?? {
        count: 0,
        totalCompletion: 0,
        maxCompletion: 0,
        lastAttemptAt: null,
      };

      const completion = typeof attempt.completion === "number" ? attempt.completion : 0;
      const attemptDate = attempt.createdAt ? new Date(attempt.createdAt) : new Date(session.date);

      entry.count += 1;
      entry.totalCompletion += completion;
      entry.maxCompletion = Math.max(entry.maxCompletion, completion);
      if (!entry.lastAttemptAt || attemptDate > entry.lastAttemptAt) {
        entry.lastAttemptAt = attemptDate;
      }
      routeStatsMap.set(attempt.routeId, entry);
    }
  }

  const routeCatalog = routeCatalogBase.map((route) => {
    const stats = routeStatsMap.get(route.id);
    const avgCompletion = stats ? Math.round(stats.totalCompletion / stats.count) : null;
    return {
      ...route,
      attemptCount: stats?.count ?? 0,
      avgCompletion,
      maxCompletion: stats?.maxCompletion ?? null,
      lastAttemptAt: stats?.lastAttemptAt ?? null,
    };
  });

  const slotOptions = await prisma.slot.findMany({
    where: {
      OR: [
        { owner_id: params.targetUserId },
        { responsibles: { some: { id: params.targetUserId } } },
        { participants: { some: { id: params.targetUserId } } },
        { attendees: { some: { id: params.targetUserId } } },
      ],
    },
    orderBy: { starts_at: "desc" },
  });

  const users = params.includeUsers
    ? await prisma.user.findMany({
        select: { id: true, first_name: true, last_name: true, email: true },
        orderBy: { last_name: "asc" },
      })
    : [];

  const stats = buildHistoryStats(sessions);

  return {
    targetUser,
    sessions,
    routes,
    routeCatalog,
    slotOptions,
    stats,
    users,
  };
}

export function buildHistoryStats(sessions: Array<any>): HistoryStats {
  const attempts = sessions.flatMap((session) => session.attempts || []);
  const successful = attempts.filter((attempt) => attempt.success);
  const totalSessions = sessions.length;
  const externalSessions = sessions.filter((session) => session.isExternal || !session.slotId).length;
  const clubSessions = totalSessions - externalSessions;
  const totalAttempts = attempts.length;
  const successAttempts = successful.length;
  const successRate = totalAttempts ? Math.round((successAttempts / totalAttempts) * 100) : 0;
  const uniqueRoutes = new Set(attempts.map((attempt) => attempt.routeId)).size;

  const durationMinutes = sessions.map((session) => {
    if (session.durationMinutes !== null && session.durationMinutes !== undefined) {
      return session.durationMinutes;
    }
    if (session.slot?.starts_at && session.slot?.ends_at) {
      const start = new Date(session.slot.starts_at).getTime();
      const end = new Date(session.slot.ends_at).getTime();
      return Math.max(0, Math.round((end - start) / 60000));
    }
    return 0;
  });
  const totalMinutes = durationMinutes.reduce((acc, value) => acc + value, 0);
  const avgMinutes = totalSessions ? Math.round(totalMinutes / totalSessions) : 0;
  const avgAttemptsPerSession = totalSessions ? Math.round(totalAttempts / totalSessions) : 0;

  const bestGradeSuccess = pickBestGrade(successful.map((attempt) => attempt.route?.grade));
  const bestGradeAttempted = pickBestGrade(attempts.map((attempt) => attempt.route?.grade));

  const relayMap = new Map<string, { attempted: number; success: number }>();
  for (const attempt of attempts) {
    const relay = attempt.route?.relay || "-";
    const current = relayMap.get(relay) ?? { attempted: 0, success: 0 };
    current.attempted += 1;
    if (attempt.success) current.success += 1;
    relayMap.set(relay, current);
  }

  const relayStats = Array.from(relayMap.entries()).map(([relay, stats]) => ({
    relay,
    attempted: stats.attempted,
    success: stats.success,
  }));

  const monthMap = new Map<string, { scores: number[]; best: number | null }>();
  for (const session of sessions) {
    const monthKey = new Date(session.date).toISOString().slice(0, 7);
    const attemptsForMonth = (session.attempts || []).map((attempt: { route?: { grade?: string | null } }) =>
      gradeToScore(attempt.route?.grade),
    );
    const scores = attemptsForMonth.filter((score): score is number => score !== null);
    if (scores.length === 0) continue;
    const entry = monthMap.get(monthKey) ?? { scores: [], best: null };
    entry.scores.push(...scores);
    entry.best = entry.best === null ? Math.max(...scores) : Math.max(entry.best, ...scores);
    monthMap.set(monthKey, entry);
  }

  const monthly = Array.from(monthMap.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, data]) => ({
      month,
      avgGrade: scoreToGrade(averageScore(data.scores)),
      bestGrade: data.best === null ? null : scoreToGrade(data.best),
    }));

  return {
    totalSessions,
    clubSessions,
    externalSessions,
    totalAttempts,
    successAttempts,
    successRate,
    uniqueRoutes,
    bestGradeSuccess,
    bestGradeAttempted,
    totalMinutes,
    avgMinutes,
    avgAttemptsPerSession,
    relayStats,
    monthly,
  };
}

function pickBestGrade(grades: Array<string | null | undefined>): string | null {
  const scored = grades
    .map((grade) => ({ grade: grade ?? null, score: gradeToScore(grade) }))
    .filter((entry) => entry.grade && entry.score !== null) as Array<{ grade: string; score: number }>;

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0].grade;
}

function averageScore(scores: number[]): number | null {
  if (!scores.length) return null;
  const total = scores.reduce((acc, value) => acc + value, 0);
  return total / scores.length;
}

function gradeToScore(grade?: string | null): number | null {
  if (!grade) return null;
  const normalized = grade.toLowerCase().replace(/\s+/g, "");
  const match = normalized.match(/^(\d+)([abc])?([+-])?$/);
  if (!match) return null;
  const base = Number.parseInt(match[1], 10);
  const letter = match[2] ?? "a";
  const plus = match[3] === "+";
  const letterScore = letter === "a" ? 0 : letter === "b" ? 2 : 4;
  const plusScore = plus ? 1 : 0;
  return base * 10 + letterScore + plusScore;
}

function scoreToGrade(score: number | null): string | null {
  if (score === null || Number.isNaN(score)) return null;
  const base = Math.floor(score / 10);
  const remainder = score % 10;
  const letter = remainder >= 4 ? "c" : remainder >= 2 ? "b" : "a";
  const plus = remainder % 2 === 1 ? "+" : "";
  return `${base}${letter}${plus}`;
}
