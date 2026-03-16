import { goto } from "$app/navigation";
import prisma from "$lib/server/prisma";
import { slotScheme } from "@/index";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

const minimalUserSelect = { id: true };
const managerUserSelect = { id: true, first_name: true, last_name: true, cotisant_as: true, cotisant_grinp: true };

export const load: PageServerLoad = async (event) => {
  const user = event.locals.user;
  if (!user) redirect(302, "/login");

  const dateParam = event.url.searchParams.get("date");

  try {
    const date = dateParam ? new Date(dateParam) : new Date();
    if (isNaN(date.getTime())) return { status: 400, error: "Invalid date" };

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const slots = await prisma.slot.findMany({
      where: { starts_at: { gte: startOfDay, lt: endOfDay } },
      include: {
        responsibles: { select: { id: true } },
        owner: { select: managerUserSelect }
      },
      orderBy: { starts_at: 'asc' }
    });

    const all_users = await prisma.user.findMany({ select: { id: true, first_name: true, last_name: true } });

    const slotsData = await Promise.all(slots.map(async (slot) => {
      const isOwner = user.instructor && slot.owner_id === user.id;
      const isResponsible = slot.responsibles.some(r => r.id === user.id);
      const canManage = user.root || isOwner || isResponsible;

      const rawParticipants = await prisma.user.findMany({
        where: { slots: { some: { id: slot.id } } },
        select: canManage ? managerUserSelect : minimalUserSelect
      }) ?? [];

      const rawAttendees = await prisma.user.findMany({
        where: { attended_slots: { some: { id: slot.id } } },
        select: canManage ? managerUserSelect : minimalUserSelect
      }) ?? [];

      // --- FIX : ANONYMISATION INTELLIGENTE ---
      const participants_list = canManage 
        ? rawParticipants 
        : rawParticipants.map((p, i) => {
            // Si c'est l'utilisateur courant, on garde son vrai ID
            if (p.id === user.id) return { ...p, first_name: "Moi", last_name: "" };
            return { id: `anon-${i}`, first_name: "Grimpeur", last_name: "" };
        });

      const attendees_list = canManage 
        ? rawAttendees 
        : rawAttendees.map((p, i) => {
            if (p.id === user.id) return { ...p, first_name: "Moi", last_name: "" };
            return { id: `hidden-${i}`, first_name: "Présent", last_name: "" };
        });

      return {
        slot,
        owner: slot.owner,
        participants_list,
        attendees_list
      };
    }));

    // (Reste du code Marqueurs inchangé...)
    const startWindow = new Date(date);
    startWindow.setDate(1);
    startWindow.setMonth(startWindow.getMonth() - 1);
    const endWindow = new Date(date);
    endWindow.setDate(1);
    endWindow.setMonth(endWindow.getMonth() + 2);

    const markerSlots = await prisma.slot.findMany({
        where: { starts_at: { gte: startWindow, lt: endWindow } },
        select: {
            id: true,
            starts_at: true,
            slot_type: true,
            participants: { where: { id: user.id }, select: { id: true } }
        }
    });

    const markers = markerSlots.map(s => ({
        date: s.starts_at.toISOString().split('T')[0],
        type: s.slot_type,
        isEnrolled: s.participants.length > 0
    }));

    return {
      slots: slotsData,
      user: { id: user.id, root: user.root, instructor: user.instructor },
      form: await superValidate(zod(slotScheme)),
      all_users: canManageGlobal(user) ? all_users : [],
      dateString: dateParam || date.toISOString().split('T')[0],
      markers
    };

  } catch (error) {
    console.error(error);
    return { slots: [], user: null, all_users: [], markers: [], dateString: "" };
  }
};

function canManageGlobal(u: any) {
    return u.root || u.instructor;
}
