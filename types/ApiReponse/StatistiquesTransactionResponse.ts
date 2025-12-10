// types/ApiReponse/StatistiquesTransactionResponse.ts
import { TransactionType } from "../AllTypes";
export interface StatistiquesTransactionResponse {
    totalCount: number;
    totalAmount: number;
    sumsByType: TransactionSumByType[];
}
export interface TransactionSumByType {
    type: TransactionType;
    amount: number;
}
