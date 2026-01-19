// @ts-nocheck
import { goto } from "$app/navigation";
import prisma from "$lib/server/prisma";
import { slotScheme } from "@/index";
import { redirect } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = async (event: Parameters<PageServerLoad>[0]) => {
  const user = event.locals.user;

  // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!user) {
    redirect(
      302,
      "/login",
    );
  }

  try {
    // Extrait la date à partir de l'URL ou des paramètres
    const dateParam = event.url.searchParams.get("date");

    // Convertit le paramètre en objet Date (assurez-vous que `dateParam` est au bon format)
    const date = dateParam ? new Date(dateParam) : new Date();

    // Vérifie si la date est valide
    if (isNaN(date.getTime())) {
      // La date est invalide, vous pouvez renvoyer une erreur ou une date par défaut
      return {
        status: 400,
        error: "Invalid date parameter",
      };
    }

    // Normalise la date au début de la journée (00:00:00)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Crée une date pour la fin de la journée (23:59:59)
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    // Trouve tous les créneaux du jour (max 3)
    const slots = await prisma.slot.findMany({
      where: {
        starts_at: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: { 
        responsibles: true,
        owner: true
      },
      orderBy: {
        starts_at: 'asc'
      }
    });

    // Get all users for the add user feature
    const all_users = await prisma.user.findMany();

    // Prepare data for each slot
    const slotsData = await Promise.all(slots.map(async (slot) => {
      const participants_list = await prisma.user.findMany({
        where: {
          slots: {
            some: {
              id: slot.id,
            },
          },
        },
      }) ?? [];

      const attendees_list = await prisma.user.findMany({
        where: {
          attended_slots: {
            some: {
              id: slot.id,
            },
          },
        },
      }) ?? [];

      return {
        slot,
        owner: slot.owner,
        participants_list,
        attendees_list
      };
    }));

    // Retourne les données nécessaires à la page
    return {
      slots: slotsData,
      user: event.locals.user,
      form: await superValidate(zod(slotScheme)),
      all_users: all_users,
      dateString: dateParam || date.toISOString().split('T')[0]
    };
  } catch (error: any) {
    return {
      slots: [],
      user: event.locals.user,
      form: await superValidate(zod(slotScheme)),
      all_users: [],
      dateString: dateParam || new Date().toISOString().split('T')[0]
    };
  }
};
