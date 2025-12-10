import { Role, UserStatus } from '@/types/roles';
import { z } from 'zod';

const phoneCountryCodeSchema = z
    .string()
    .regex(/^\+\d{1,4}$/, { message: 'Code pays invalide (ex: +33)' });

const phoneNumberSchema = z
    .string()
    .min(4, { message: 'Le numéro de téléphone est trop court' })
    .max(20, { message: 'Le numéro de téléphone est trop long' })

export const RegisterSchema = z
    .object({
        email: z.string().email({ message: 'Email invalide' }),
        name: z.string().min(1, { message: 'Le nom est requis' }),
        password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
        confirmPassword: z.string().min(6, { message: 'Confirmez le mot de passe' }),
        role: z.nativeEnum(Role).refine((val) => val !== undefined, { message: 'Le rôle est requis' }),
        status: z.nativeEnum(UserStatus).optional(),
        phoneCountryCode: phoneCountryCodeSchema.optional(),
        phoneNumber: phoneNumberSchema.optional(),
        file: z.any().optional(),
        carte: z.any().optional(),
        permis: z.any().optional(),
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
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Les mots de passe ne correspondent pas',
    });


export const UpdateUserSchema = z
    .object({
        name: z.string().optional(),
        password: z.string().min(6).optional(),
        role: z.nativeEnum(Role).optional(),
        status: z.nativeEnum(UserStatus).optional(),
        phoneCountryCode: phoneCountryCodeSchema.optional(),
        phoneNumber: phoneNumberSchema.optional(),
        file: z.any().optional(),
        carte: z.any().optional(),
        permis: z.any().optional(),
    })
    .refine(
        (data) =>
            (data.phoneCountryCode && data.phoneNumber) ||
            (!data.phoneCountryCode && !data.phoneNumber),
        {
            message: 'Le code pays et le numéro de téléphone doivent être remplis ensemble',
            path: ['phoneNumber'],
        }
    );
