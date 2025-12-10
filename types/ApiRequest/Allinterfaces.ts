// utils/interfaces.ts
import { z } from 'zod';

// Slider
export const sliderSchema = z.object({
    label: z.string().min(2, "Label obligatoire"),
    description: z.string()
        .transform((val) => val?.trim() || "") // Nettoie et accepte vide
        .optional(),
    image: z.any().optional(),
});
export type SliderFormValues = z.infer<typeof sliderSchema>;

// Publicité
export const publiciteSchema = z.object({
    title: z.string().min(2, "Titre obligatoire"),
    smallTitle: z.string().optional(),
    description: z.string().transform((val) => val?.trim() || "").optional(),
    typeFiles: z.enum(["IMAGE", "VIDEO"]),
    files: z.any().optional(),
});
export type PubliciteFormValues = z.infer<typeof publiciteSchema>;

// Reglage
export const reglageSchema = z.object({
    footerDescription: z.string().transform((val) => val?.trim() || "").optional(),
    assistanceLine: z.string().optional(),
    emplacement: z.string().optional(),
    email: z.string().email("Email invalide").optional(),
    fbUrl: z.string().url("URL Facebook invalide").optional(),
    linkedinUrl: z.string().url("URL LinkedIn invalide").optional(),
    xUrl: z.string().url("URL X invalide").optional(),
    headerLogo: z.any().optional(),
    footerLogo: z.any().optional(),
});
export type ReglageFormValues = z.infer<typeof reglageSchema>;

// Partenaire
export const partenaireSchema = z.object({
    libeller: z.string().min(2, "Libellé obligatoire"),
    description: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(), // <-- statut optionnel, backend gère par défaut
    logo: z.any().optional(),
});

export type PartenaireFormValues = z.infer<typeof partenaireSchema>;

// PaymentMethodes
export const paymentMethodesSchema = z.object({
    name: z.string().min(2, "Nom obligatoire"),
    logo: z.any().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(), // Backend gère par défaut ACTIVE
});

export type PaymentMethodesFormValues = z.infer<typeof paymentMethodesSchema>;