// Enum pour les types de transactions
export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    PAYMENT = 'PAYMENT',
    COMMISSION = 'COMMISSION',
    REFUND = 'REFUND',
}

// Informations sur le portefeuille
export interface Wallet {
    id: string;
    balance: number;
    userId: string;
    paymentMethod: string; // ex: "IMMEDIATE"
    rechargeType: string;  // ex: "WAVE"
    accountNumber: string;
    createdAt: string; // ISO date string
    updatedAt: string;
}

// Une transaction unique
export interface TransactionResponse {
    id: string;
    amount: number;
    transactionNumber: string;
    type: TransactionType;
    walletId: string;
    userId: string;
    reference: string | null;
    description: string;
    createdAt: string;
    updatedAt: string;
    wallet: Wallet;
}

