
// interface StatistiquesEnrollementResponse 
export interface GeoCoord {
    lat: number;
    lng: number;
}

/**
 * Interface pour les données du graphique (nombre d’enrôlements par date).
 */
export interface EnrollementStatByDate {
    date: string;   // Format ISO: yyyy-mm-dd
    total: number;
}