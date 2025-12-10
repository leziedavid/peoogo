export interface MonthlyTransactionStat {
    label: string;          // Exemple : "2024-08"
    DEPOSIT?: number;       // Montant des dépôts (optionnel)
    PAYMENT?: number;       // Montant des paiements (optionnel)
    COMMISSION?: number;    // Montant des commissions (optionnel)
    REFUND?: number;        // Montant des remboursements (optionnel)
}

export interface MonthlyTransactionStatsResponse {
    data: MonthlyTransactionStat[];
}
