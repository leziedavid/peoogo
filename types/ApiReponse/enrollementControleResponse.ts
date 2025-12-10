// enrollementControleResponse.ts


export interface EnrollementData {
    id: string;
    code: string;
    TypeCompte: string;
    agent_id: string;
    agent_superviseur_id: string | null;
    user_control_id: string | null;
    confirm_validation_control: boolean | null;
    numero_lot: string | null;
    validation_control: boolean | null;
    date_validation_control: string | null;
    date_confirm_validation_control: string | null;
    is_deleted: boolean;
    is_select_lot: string | null;
    status_dossier: string | null;
    time_enrolment: number | null;
    start_date: string | null;
    end_date: string | null;
    nom: string;
    prenom: string;
    datedenaissance: string;
    lieudenaissance: string;
    sexe: string;
    site: string | null;
    nationalit: string | null;
    situationmatrimoniale: string;
    niveaudinstruction: string;
    numroprincipal: string;
    languelocaleparle: string;
    autreslanguelocaleparle: string | null;
    decoupageId: string;
    campementquartier: string | null;
    coordonneesgeo: string | null;
    activitprincipaleId: string | null;
    spculationprincipaleId: string | null;
    superficiedevotreparcellecultu: number;
    indiquezlasuperficieenha: number;
    quantitproduction: number;
    prcisezlenombre: number;
    moyendestockage: string | null;
    createdAt: string;
    updatedAt: string;
    agent_enroleur: Agent | null;
    agent_superviseur: Agent | null;
    user_control: Agent | null;
    decoupage: Decoupage;
    activitprincipale: Activite | null;
    spculationprincipale: Speculation | null;
    photo: string | null;
    document1: string | null;
    document2: string | null;
    autresActivites: AutreActivite[];        // ajout
    autresSpeculations: AutreSpeculation[];  // ajout
    commentaire_controle: string | null;
}

export interface Agent {
    id: string;
    email: string;
    codeGenerate: string | null;
    passwordGenerate: string | null;
    enrollementsId: string | null;
    name: string;
    role: string;
    status: string;
    phoneCountryCode: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
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

export interface Activite {
    id: string;
    nom: string;
    createdAt: string;
    updatedAt: string;
}

export interface Speculation {
    id: string;
    nom: string;
    createdAt: string;
    updatedAt: string;
}

export interface District {
    id: string;
    nom: string;
    statut: string | null;
}

export interface Region {
    id: string;
    nom: string;
    statut: string | null;
    districtId: string;
}

export interface Department {
    id: string;
    nom: string;
    regionId: string;
}

export interface SousPrefecture {
    id: string;
    nom: string;
    departmentId: string;
}

export interface Localite {
    id: string;
    nom: string;
    sousPrefectureId: string;
}

export interface AutreActivite {
    id: string;
    code: string | null;
    activiteId: string;
    userId: string | null;
    enrollementId: string;
    createdAt: string;
    updatedAt: string;
    activite: Activite;  // détail de l’activité lié
}

export interface AutreSpeculation {
    id: string;
    code: string | null;
    speculationId: string;
    userId: string | null;
    enrollementId: string;
    createdAt: string;
    updatedAt: string;
    speculation: Speculation; // détail de la spéculation liée
}


export interface ControlStatsResponse {
    val: number;
    non_traite: number;
    rej: number;
    doublon: number;
    encours: number;
    del: number;
    image_incor: number;
    doublon_number: number;
    agent: {
        user_control_id: string;
        name: string;
        email: string;
        phoneNumber: string;
        nb_dossiers_tires: number;
    };
}
