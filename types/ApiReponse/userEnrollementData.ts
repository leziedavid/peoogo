import { Department, District, Localite, Region, SousPrefecture } from "./enrollementControleResponse";

export interface UserEnrollementData {
    code: string;
    user:UsersData;
    decoupage: DecoupageWithRelations;
    enrollement: Enrollement;
}

export interface DecoupageWithRelations {
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
    sousPrefecture:SousPrefecture;
    localite: Localite;
}

export interface Enrollement {
    id: string;
    code: string;
    TypeCompte: string;
    agent_id: string;
    agent_superviseur_id: string | null;
    user_control_id: string;
    confirm_validation_control: boolean;
    numero_lot: string;
    validation_control: boolean;
    date_validation_control: string;
    date_confirm_validation_control: string;
    commentaire_controle: string | null;
    is_deleted: boolean;
    is_select_lot: boolean | null;
    status_dossier: string;
    time_enrolment: string | null;
    start_date: string;
    end_date: string;
    nom: string;
    prenom: string;
    datedenaissance: string;
    lieudenaissance: string;
    sexe: string;
    site: string;
    nationalit: string;
    situationmatrimoniale: string;
    niveaudinstruction: string;
    numroprincipal: string;
    languelocaleparle: string;
    autreslanguelocaleparle: string;
    decoupageId: string;
    campementquartier: string;
    coordonneesgeo: string;
    activitprincipaleId: string;
    spculationprincipaleId: string;
    superficiedevotreparcellecultu: number;
    indiquezlasuperficieenha: number;
    quantitproduction: number;
    prcisezlenombre: number;
    moyendestockage: string;
    createdAt: string;
    updatedAt: string;
    decoupage: DecoupageWithRelations;
}

export interface UsersData {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    wallet: string | null;
    generatedCode: string;
}
