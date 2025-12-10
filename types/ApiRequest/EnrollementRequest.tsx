// Types pour découpage
export type Decoupage = {
    // nombreEnroler?: number;
    districtId: string;
    regionId: string;
    departmentId: string;
    sousPrefectureId: string;
    localiteId: string;
};

// Enum TypeCompte TS (à exporter si besoin)
export enum TypeCompte {
    AGRICULTEURS = 'AGRICULTEURS',
    AQUACULTEURS = 'AQUACULTEURS',
    AUTRE_ACTEURS = 'AUTRE_ACTEURS',
    APICULTEURS = 'APICULTEURS',
    REVENDEUR = 'REVENDEUR',
    TRANSFORMATEUR = 'TRANSFORMATEUR',
    ACHETEUR = 'ACHETEUR',
}

// District
export interface District {
    id: string;
    name: string;
}

// Region
export interface Region {
    id: string;
    name: string;
}

// Department
export interface Department {
    id: string;
    name: string;
}

// SousPrefecture
export interface SousPrefecture {
    id: string;
    name: string;
}

// Localite
export interface Localite {
    id: string;
    name: string;
}

// Enum status dossier
export type StatusDossier = 'NON_TRAITE' | 'TRAITE' | 'REFUSE';

// Niveau instruction
export type NiveauInstruction = 'PRIMAIRE' | 'SECONDAIRE' | 'UNIVERSITAIRE' |'SAIS LIRE ET ECRIRE' | 'ALPHABETISE';

// Le type principal EnrollementRequest
export interface EnrollementRequest {
    id?: string;
    agent_superviseur_id: string;
    status_dossier?: StatusDossier;
    time_enrolment?: number;
    nom: string;
    prenom: string;
    datedenaissance: string; // ISO string date (ex: "2024-07-21")
    lieudenaissance: string;
    sexe: string;
    nationalit: string;
    situationmatrimoniale: string;
    niveaudinstruction: NiveauInstruction;
    numroprincipal: string;
    site: string;
    languelocaleparle: string;
    autreslanguelocaleparle?: string;
    campementquartier?: string;
    coordonneesgeo?: string;
    activitprincipaleId?: string;
    spculationprincipaleId?: string;
    autresactivite?: string[];
    autresspeculation?: string[];
    superficiedevotreparcellecultu?: number;
    indiquezlasuperficieenha?: number;
    quantitproduction?: number;
    prcisezlenombre?: number;
    moyendestockage?: string;
    typeCompte?: TypeCompte;
    decoupage: Decoupage;
    photo?: File | null;
    photo_document_1?: File | null;
    photo_document_2?: File | null;
}
