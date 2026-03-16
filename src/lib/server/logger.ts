import prisma from "$lib/server/prisma";

const MAX_LOGS = 10000;

export const logger = {
    log: async (userId: string, action: string, details?: string, target?: string) => {
        try {
            let finalTarget = target;

            // Détection automatique : Si la cible ressemble à un ID (commence par 'c' et long)
            if (target && target.startsWith('c') && target.length > 20) {
                
                // 1. Est-ce un Humain ?
                const user = await prisma.user.findUnique({ where: { id: target } });
                if (user) {
                    finalTarget = `👤 ${user.first_name} ${user.last_name}`;
                } else {
                    // 2. Sinon, est-ce un Créneau ?
                    const slot = await prisma.slot.findUnique({ where: { id: target } });
                    if (slot) {
                        const date = new Date(slot.starts_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                        });
                        finalTarget = `📅 ${slot.name || 'Créneau'} du ${date}`;
                    }
                }
            }

            await prisma.log.create({
                data: {
                    userId,
                    action,
                    details,
                    target: finalTarget
                }
            });

            const excessLogs = await prisma.log.findMany({
                select: { id: true },
                orderBy: { createdAt: "desc" },
                skip: MAX_LOGS
            });

            if (excessLogs.length > 0) {
                await prisma.log.deleteMany({
                    where: { id: { in: excessLogs.map((log) => log.id) } }
                });
            }
        } catch (e) {
            console.error("Erreur Logger:", e);
        }
    }
};
