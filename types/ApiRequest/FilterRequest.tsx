// Interface pour le filtre étendue
interface FilterRequest {
    modeAffichage?: string;
    typeActeur?: string;
    controleurAgriDash?: string;
    agent?: string;
    // Découpage géographique
    districtId?: string;
    regionId?: string;
    departmentId?: string;
    sousPrefectureId?: string;
    localiteId?: string;
    // Autres champs
    periode?: string;
    statutDossier?: string;
    heureDebutEnrolement?: string;
    heureFinEnrolement?: string;
}