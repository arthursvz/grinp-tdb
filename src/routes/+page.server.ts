import prisma from "$lib/server/prisma";

export const load = async (event) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlySlots = await prisma.slot.findMany({
        where: { starts_at: { gte: startOfMonth, lte: endOfMonth }, slot_type: { not: "FERMETURE" } }
    });

    const totalHours = Math.round(monthlySlots.reduce((acc, slot) => 
        acc + (new Date(slot.ends_at).getTime() - new Date(slot.starts_at).getTime()), 0) / 3600000);

    // LOGIQUE BETA : Priorité à la spéciale, sinon rotation
    let beta = await prisma.dailyBeta.findFirst({ where: { is_special: true } });
    if (!beta) {
        const all = await prisma.dailyBeta.findMany();
        if (all.length > 0) {
            const dayOfYear = Math.floor(now.getTime() / 86400000);
            beta = all[dayOfYear % all.length];
        }
    }

    return {
        user: event.locals.user,
        statsGlobal: { count: monthlySlots.length, hours: totalHours, monthName: now.toLocaleDateString('fr-FR', { month: 'long' }) },
        dailyBeta: beta?.content ?? "Grimpe fort ! 🧗‍♂️"
    };
};
