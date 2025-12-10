import { id } from 'date-fns/locale';
import { z } from 'zod';

// Enums utilisateur côté front
export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    AGENT_ENROLEUR = 'AGENT_ENROLEUR',
    AGENT_CONTROLE = 'AGENT_CONTROLE',
    PRODUCTEUR = 'PRODUCTEUR',
}

export enum TypeCompte {
    UTILISATEUR='UTILISATEUR',
    ADMINISTRATEUR = 'ADMINISTRATEUR',
    AGRICULTEURS = 'AGRICULTEURS',
    AQUACULTEURS = 'AQUACULTEURS',
    AUTRE_ACTEURS = 'AUTRE_ACTEURS',
    APICULTEURS = 'APICULTEURS',
    REVENDEUR = 'REVENDEUR',
    TRANSFORMATEUR = 'TRANSFORMATEUR',
    ACHETEUR = 'ACHETEUR',
    RELAIS = 'RELAIS',
    SUPPERVISEUR = 'SUPPERVISEUR',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}

// Schéma de validation Zod pour le formulaire utilisateur
export const UserFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Le nom est requis'),
    email: z.string().email('Email invalide').optional(),
    password: z.string()
        .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
        .optional()
        .or(z.literal('')), // accepte vide
    confirmPassword: z.string()
        .min(6, { message: 'Confirmez le mot de passe' })
        .optional()
        .or(z.literal('')), // accepte vide
    role: z.nativeEnum(Role).optional(),
    typeCompte: z.nativeEnum(TypeCompte).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    phoneCountryCode: z.string().optional(),
    phoneNumber: z.string().min(8, 'Le numéro doit contenir au moins 8 chiffres'),
    file: z.any().optional(),
}).refine((data) => {
    // Si password rempli, confirm obligatoire et identique
    if (data.password && data.password.trim() !== '') {
        return data.password === data.confirmPassword;
    }
    return true; // pas de mot de passe → pas de check
}, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
});


// Type TypeScript inféré automatiquement à partir du schema Zod
export type UserFormValues = z.infer<typeof UserFormSchema>;
