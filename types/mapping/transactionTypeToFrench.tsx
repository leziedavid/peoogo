import { TransactionTypeFrench } from "../AllTypes";

export const transactionTypeToFrench: Record<string, string> = {
    DEPOSIT: TransactionTypeFrench.DEPOSIT,
    PAYMENT: TransactionTypeFrench.PAYMENT,
    COMMISSION: TransactionTypeFrench.COMMISSION,
    REFUND: TransactionTypeFrench.REFUND,
};
