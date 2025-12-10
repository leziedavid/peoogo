

export enum VariantType {
    TAILLE = 'TAILLE',
    COULEUR = 'COULEUR',
    CAPACITE = 'CAPACITE',
    POIDS = 'POIDS',
    LONGUEUR = 'LONGUEUR',
    LARGEUR = 'LARGEUR',
}


export interface ProductRequest {
    id?: string; // pour les mises à jour
    addedById?: string; // pour les mises à jour
    name: string;
    description?: string;
    price: number;
    stock: number;
    // sku: string;
    imageFile?: File | null; // si upload unitaire
    files?: File[]; // multiple upload secondaire
    categoryId: string;
    serviceId: string;
    variantType?: VariantType;
    variantIds: string[];
}

export interface VarianteResponse {
    id: string;
    name: string;
    value: string;
    price: number;
    variantType: VariantType; // ou string si tu n’as pas encore un enum
    addedById: string;
    createdAt: string; // ou Date si tu la convertis
    updatedAt: string; // ou Date si tu la convertis
}


