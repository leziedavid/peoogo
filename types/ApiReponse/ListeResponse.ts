

export interface ActiviteResponse {
    id: string;
    nom: string;
    createdAt: string;
    updatedAt : string;
}

// CategorieResponse
export interface CategorieResponse {
    id: string;
    nom: string;
    status: string;
    createdAt: string;
    updatedAt : string;
}

// SpeculationsResponse
export interface SpeculationsResponse{
    id: string;
    nom: string;
    createdAt: string;
    updatedAt : string;
}

// districts
export interface DistrictResponse {
    id: string;
    nom: string;
    statut: boolean;
}

// regions
export interface RegionResponse {
    id: string;
    nom: string;
    statut: boolean;
    districtId: string;
    district: DistrictResponse;
}

// departments
export interface DepartmentResponse {
    id: string;
    nom: string;
    statut: boolean;
    regionId: string;
    region: RegionResponse;
}

// sousPrefectures
export interface SousPrefectureResponse {
    id: string;
    nom: string;
    statut: boolean;
    departmentId: string;
    department: DepartmentResponse;
}

// localites
export interface LocaliteResponse {
    id: string;
    nom: string;
    statut: boolean;
    sousPrefectureId: string;
    sousPrefecture: SousPrefectureResponse;
}

// StatusDossier
export enum StatusDossier {
    NON_TRAITE,
    VAL,
    REJ,
    DOUBLON,
    ENCOURS,
    DEL,
    IMAGE_INCOR,
    DOUBLON_NUMBER
}




// Decoupage
// export interface Decoupage {
//     id: string;
//     nombreEnroler: number;
//     districtId: string;
//     regionId: string;
//     departmentId: string;
//     sousPrefectureId: string;
//     localiteId: string;
//     nombreEnroler: number;
//     district: District;
//     region: Region;
//     department: Department;
//     sousPrefecture: SousPrefecture;
//     localite: Localite;
//     produits: Produit[];
//     enrollements: Enrollements[];
// }
