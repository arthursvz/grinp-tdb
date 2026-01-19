import { env } from "$env/dynamic/private";
import prisma from "@/server/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export const GET = async (event: RequestEvent) => {
    const user = event.locals.user;
    
    if (!user?.id) {
        return new Response(JSON.stringify({ ok: false, error: "Not authenticated" }), { status: 401 });
    }

    const prismaUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (!prismaUser?.root) {
        return new Response(JSON.stringify({ ok: false, error: "Insufficient permissions" }), { status: 403 });
    }

    try {
        // Export all data from database
        const users = await prisma.user.findMany();
        const slots = await prisma.slot.findMany();
        const sessions = await prisma.session.findMany();
        const contributions = await prisma.contribution.findMany();

        const backup = {
            timestamp: new Date().toISOString(),
            users,
            slots,
            sessions,
            contributions
        };

        const sql = generateSQL(backup);

        return new Response(sql, {
            status: 200,
            headers: {
                "Content-Type": "application/sql",
                "Content-Disposition": `attachment; filename="grinp_backup_${new Date().toISOString().split('T')[0]}.sql"`
            }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }), { status: 400 });
    }
};

function generateSQL(backup: any): string {
    let sql = `-- Grinp TDB Backup\n-- Generated: ${backup.timestamp}\n\n`;

    sql += `-- Users\n`;
    backup.users.forEach((user: any) => {
        sql += `INSERT INTO "User" (id, churros_uid, first_name, last_name, email, password, root, instructor, cotisant_as, cotisant_grinp) `;
        sql += `VALUES ('${escapeSql(user.id)}', ${user.churros_uid ? `'${escapeSql(user.churros_uid)}'` : 'NULL'}, '${escapeSql(user.first_name)}', '${escapeSql(user.last_name)}', '${escapeSql(user.email)}', ${user.password ? `'${escapeSql(user.password)}'` : 'NULL'}, ${user.root}, ${user.instructor}, ${user.cotisant_as}, ${user.cotisant_grinp});\n`;
    });

    sql += `\n-- Slots\n`;
    backup.slots.forEach((slot: any) => {
        sql += `INSERT INTO "Slot" (id, name, description, starts_at, ends_at, capacity, owner_id) `;
        sql += `VALUES ('${escapeSql(slot.id)}', ${slot.name ? `'${escapeSql(slot.name)}'` : 'NULL'}, ${slot.description ? `'${escapeSql(slot.description)}'` : 'NULL'}, '${slot.starts_at}', '${slot.ends_at}', ${slot.capacity}, '${escapeSql(slot.owner_id)}');\n`;
    });

    sql += `\n-- Sessions\n`;
    backup.sessions.forEach((session: any) => {
        sql += `INSERT INTO "Session" (id, "userId", "expiresAt") VALUES ('${escapeSql(session.id)}', '${escapeSql(session.userId)}', '${session.expiresAt}');\n`;
    });

    sql += `\n-- Contributions\n`;
    backup.contributions.forEach((contrib: any) => {
        sql += `INSERT INTO "Contribution" (id, type, "startDate", "expirationDate", amount, "userId") `;
        sql += `VALUES ('${escapeSql(contrib.id)}', '${escapeSql(contrib.type)}', '${contrib.startDate}', '${contrib.expirationDate}', ${contrib.amount}, '${escapeSql(contrib.userId)}');\n`;
    });

    return sql;
}

function escapeSql(str: string): string {
    return str.replace(/'/g, "''");
}

