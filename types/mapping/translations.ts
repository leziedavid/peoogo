// translations.ts
import {OrderStatus,OrderStatusFrench,PaymentMethod,PaymentMethodFrench,} from "@/types/AllTypes";

export const orderStatusToFrench = (status: OrderStatus): string => {
    return OrderStatusFrench[status];
};

export const paymentMethodToFrench = (method: PaymentMethod): string => {
    return PaymentMethodFrench[method];
};
