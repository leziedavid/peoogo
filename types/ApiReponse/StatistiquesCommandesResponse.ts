export interface StatistiquesCommandesResponse {
  labels: string[];   // Liste des mois (ex: ['2024-08', '2024-09', ..., '2025-07'])
  orders: number[];   // Nombre de commandes par mois
  revenue: number[];  // Montant des revenus par mois (somme des "amount")
}
