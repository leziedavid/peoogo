export interface UsersResponse {
    statusCode: number;
    message: string;
    data: UsersData;
}

export interface UsersData {
    status: boolean;
    total: number;
    page: number;
    limit: number;
    data: User[];
}

export interface UserFiles {
    photo: string | null;
    document1: string | null;
    document2: string | null;
}

export interface User {
    id: string;
    email: string;
    password: string;
    codeGenerate: string | null;
    passwordGenerate: string;
    enrollementsId: string | null;
    name: string;
    role: string;
    status: string;
    phoneCountryCode: string | null;
    phoneNumber: string;
    typeCompte: string | null;
    createdAt: string;
    updatedAt: string;
    wallet: Wallet | null;
    ecommerceOrders: any[]; // You can define this if needed
    agentEnroleur: Enrollement[];
    agentSuperviseur: any[]; // To be defined if data available
    agentControle: Enrollement[];
    photo: string | null;
    userFiles: UserFiles | null;
    document1: string | null;
    document2: string | null;
}

export interface Wallet {
    id: string;
    balance: number;
    userId: string;
    paymentMethod: string;
    rechargeType: string;
    createdAt: string;
    updatedAt: string;
    accountNumber: string;
}

export interface Enrollement {
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
    commentaire_controle: string | null;
    is_deleted: boolean;
    is_select_lot: boolean | null;
    status_dossier: string;
    time_enrolment: string | null;
    start_date: string | null;
    end_date: string | null;
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
    decoupage?: Decoupage;
    activitprincipale?: Activite;
    spculationprincipale?: Speculation;
    autresActivites?: AutreActivite[];
    autresSpeculations?: AutreSpeculation[];
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

export interface AutreActivite {
    id: string;
    code: string | null;
    activiteId: string;
    userId: string | null;
    enrollementId: string;
    createdAt: string;
    updatedAt: string;
    activite: Activite;
}

export interface AutreSpeculation {
    id: string;
    code: string | null;
    speculationId: string;
    userId: string | null;
    enrollementId: string;
    createdAt: string;
    updatedAt: string;
    speculation: Speculation;
}
