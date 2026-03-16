import { z } from "zod";

export const loginScheme = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const registerScheme = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const slotScheme = z.object({
    title: z.string().min(5),
    description: z.string().min(5),
    capacity: z.number().int().positive(),
    // Ajout crucial pour autoriser le changement de type
    slot_type: z.enum(["CRENEAU", "EVENEMENT", "FERMETURE"]), 
    date: z.object({
        starts_at: z.string().min(1).regex(/^[0-9]{2}:[0-9]{2}$/),
        ends_at: z.string().min(1).regex(/^[0-9]{2}:[0-9]{2}$/),
    })
});

export type FormSchema = typeof loginScheme;
