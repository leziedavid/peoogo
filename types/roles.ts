// roles.ts

export enum Role {
    USER = 'USER',
    DRIVER = 'DRIVER',
    PARTNER = 'PARTNER',
    LIVREUR = 'LIVREUR',
}

export enum UserStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
}

// Libellés en FRANÇAIS MAJUSCULES
export const RoleLabels: Record<Role, string> = {
    [Role.USER]: 'UTILISATEUR',
    [Role.DRIVER]: 'CHAUFFEUR',
    [Role.PARTNER]: 'PARTENAIRE',
    [Role.LIVREUR]: 'LIVREUR',
};

export const UserStatusLabels: Record<UserStatus, string> = {
    [UserStatus.INACTIVE]: 'INACTIF',
    [UserStatus.ACTIVE]: 'ACTIF',
    [UserStatus.BLOCKED]: 'BLOQUÉ',
};
