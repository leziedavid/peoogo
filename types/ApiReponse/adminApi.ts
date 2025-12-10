

export type TypeFile = 'IMAGE' | 'VIDEO';
export type Status = 'ACTIVE' | 'INACTIVE';

// types/ApiReponse/SliderResponse.ts
export interface Slider {
    id: string;
    label?: string;
    description?: string;
    imageUrl?: string;
    addedById: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface Publicite {
    id: string;
    title: string;
    smallTitle?: string;
    description?: string;
    files?: string; // URL ou chemin du fichier
    typeFiles: TypeFile;
    addedById: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

// types/ApiReponse/ReglageResponse.ts
export interface Reglage {
    id: string;
    footerDescription?: string;
    assistanceLine?: string;
    emplacement?: string;
    email?: string;
    fbUrl?: string;
    linkedinUrl?: string;
    xUrl?: string;
    headerLogo?: string; // URL du logo
    footerLogo?: string; // URL du logo
    addedById: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}



export interface Partenaire {
    id: string;
    libeller: string;
    description?: string;
    logo?: string; // URL du logo
    status: Status;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface PaymentMethode {
    id: string;
    name: string;
    logo?: string; // URL du logo
    status: Status;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}