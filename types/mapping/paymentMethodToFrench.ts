import { PaymentMethodFrench } from "../AllTypes";

export const paymentMethodToFrench: Record<string, string> = {
    IMMEDIATE: PaymentMethodFrench.IMMEDIATE,
    ON_ARRIVAL: PaymentMethodFrench.ON_ARRIVAL,
    MOBILE_MONEY: PaymentMethodFrench.MOBILE_MONEY,
    CARD: PaymentMethodFrench.CARD,
    BANK_TRANSFER: PaymentMethodFrench.BANK_TRANSFER,
};
