// types/ecommerceOrderResponse.ts

import { DeliveryMethod, OrderStatus, PaymentMethod, Role, UserStatus } from "../AllTypes";

export interface EcommerceOrderResponse {
    data: EcommerceOrder[];
}

export interface EcommerceOrder {
    id: string;
    ordersNumber: string;
    userId: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    deliveryMethod: DeliveryMethod;
    amount: number;
    canceledAt: string | null;
    createdAt: string;
    updatedAt: string;
    addedById: string;
    items: EcommerceOrderItem[];
    user: User;
}

export interface EcommerceOrderItem {
    id: string;
    ecommerceOrderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}


// Utilisateur qui a ajouté le produit
export interface AddedByUser {
    id: string;
    email: string;
    name: string;
    phoneCountryCode: string;
    phoneNumber: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface EnrichedProducer {
    id: string;
    name: string;
    phoneNumber: string;
    typeCompte: string;
    totalQuantity: number;
    totalAmount: number;
    codeGenerate: string;
    reverser: number;
}

export interface Product {
    id: string;
    nom: string;
    code: string;
    description: string;
    quantite: number;
    unite: string;
    imageUrl: string | null;
    prixUnitaire: number;
    prixEnGros: number;
    paymentMethod: string;
    saleType: string;
    status: string;
    typeActeur: string;
    disponibleDe: string; // ISO date
    disponibleJusqua: string; // ISO date
    image: string | null;
    autreImage: string | null;
    codeUsers: string;
    addedById: string;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
    decoupageId: string;
    // 🆕 correspond à "product.addedBy" dans ton retour
    addedBy: AddedByUser;
    // 🆕 producteur enrichi (quantité & montant agrégés pour la commande)
    producer: EnrichedProducer;

}
export interface User {
    id: string;
    email: string;
    password: string;
    passwordGenerate: string | null;
    name: string;
    role: Role;
    status: UserStatus;
    phoneCountryCode: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    partnerId: string | null;
}
