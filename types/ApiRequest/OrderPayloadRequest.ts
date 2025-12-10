import { DeliveryMethod, PaymentMethod } from "../AllTypes";

// types.ts
export type OrderPayload = {
    deliveryDetails: {
        name: string;
        email: string;
        phone: string;
        company?: string;
    };
    paymentMethod: PaymentMethod;
    deliveryMethod:DeliveryMethod;
    promoCode?: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    amount: number;
};
