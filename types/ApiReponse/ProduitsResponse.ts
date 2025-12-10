import { CategorieResponse } from "./ListeResponse";

// Types pour les sous-objets
export interface Localite {
    id: string;
    nom: string;
    sousPrefectureId: string;
}

export interface SousPrefecture {
    id: string;
    nom: string;
    departmentId: string;
}

export interface Department {
    id: string;
    nom: string;
    regionId: string;
}

export interface Region {
    id: string;
    nom: string;
    statut: string | null;
    districtId: string;
}

export interface District {
    id: string;
    nom: string;
    statut: string | null;
}

export interface Decoupage {
    id: string;
    nombreEnroler: number;
    districtId: string;
    regionId: string;
    departmentId: string;
    sousPrefectureId: string;
    localiteId: string;
    district: District;
    region: Region;
    department: Department;
    sousPrefecture: SousPrefecture;
    localite: Localite;
}

export interface AddedBy {
    id: string;
    email: string;
    password: string;
    codeGenerate: string | null;
    passwordGenerate: string;
    enrollementsId: string | null;
    name: string;
    role: string;
    status: string;
    phoneCountryCode: string;
    phoneNumber: string;
    typeCompte: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    wallet: any;
    generatedCode: string | null;
    code: string;
    photo: string;
}

export interface Product {
    id: string;
    categories: CategorieResponse[];
    nom: string;
    code: string;
    description: string;
    quantite: number;
    unite: string;
    imageUrl: string | null;
    prixUnitaire: number;
    prixEnGros: number;
    paymentMethod: string;
    saleType: string;
    status: string;
    typeActeur: string;
    disponibleDe: string;
    disponibleJusqua: string;
    image: string | null;
    autreImage: string | null;
    codeUsers: string;
    addedById: string;
    createdAt: string;
    updatedAt: string;
    decoupageId: string;
    decoupage: Decoupage;
    addedBy: AddedBy;
    statut: string;
    images: any[]; // À adapter si les images ont une structure précise
    userInfo: UserInfo;
}
// Interface principale de la réponse
export interface ProduitsResponse {
    statusCode: number;
    message: string;
    data: {
        status: boolean;
        total: number;
        page: number;
        limit: number;
        data: Product[];
    };
}
