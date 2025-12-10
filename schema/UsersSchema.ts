import { Role, UserStatus } from '@/types/roles';
import { z } from 'zod';

const phoneCountryCodeSchema = z
    .string()
    .regex(/^\+\d{1,4}$/, { message: 'Code pays invalide (ex: +33)' });

const phoneNumberSchema = z
    .string()
    .min(4, { message: 'Le numéro de téléphone est trop court' })
    .max(20, { message: 'Le numéro de téléphone est trop long' });

// ✅ Schéma principal pour la création ou modification d'utilisateur
export const UsersSchema = z
    .object({
        email: z.string().email({ message: 'Email invalide' }),
        name: z.string().min(1, { message: 'Le nom est requis' }),
        role: z.nativeEnum(Role).refine((val) => val !== undefined, { message: 'Le rôle est requis' }),
        status: z.nativeEnum(UserStatus).refine((val) => val !== undefined, { message: 'Le statut est requis' }),

        password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
        confirmPassword: z.string().min(6, { message: 'La confirmation est requise' }),

        phoneCountryCode: phoneCountryCodeSchema.optional(),
        phoneNumber: phoneNumberSchema.optional(),

        file: z.any().optional(),     // Photo de profil
        carte: z.any().optional(),    // Carte d'identité
        permis: z.any().optional(),   // Permis de conduire
    })
    .refine(
        (data) =>
            (data.phoneCountryCode && data.phoneNumber) ||
            (!data.phoneCountryCode && !data.phoneNumber),
        {
            message: 'Le code pays et le numéro de téléphone doivent être remplis ensemble',
            path: ['phoneNumber'],
        }
    )
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: 'Les mots de passe ne correspondent pas',
            path: ['confirmPassword'],
        }
    );
