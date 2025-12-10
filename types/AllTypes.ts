// AllTypes.ts
// Generated from Prisma schema

// Enums


export enum StatusDossier {
    NON_TRAITE,
    VAL,
    REJ,
    DOUBLON,
    ENCOURS,
    DEL,
    IMAGE_INCOR,
    DOUBLON_NUMBER,
}


export enum TypeCompte {
    AGRICULTEURS,
    AQUACULTEURS,
    AUTRE_ACTEURS,
    APICULTEURS,
    REVENDEUR,
    TRANSFORMATEUR,
    ACHETEUR,
    RELAIS,
    SUPPERVISEUR,
    UTILISATEUR,
    
}

export enum AllRole {
    ADMIN,
    USER,
    AGENT_ENROLEUR,
    AGENT_CONTROLE,
    PRODUCTEUR,
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT_ENROLEUR = "AGENT_ENROLEUR",
    AGENT_CONTROLE = "AGENT_CONTROLE",
    PRODUCTEUR = "PRODUCTEUR",
}

export enum TripStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum OrderStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}
export enum OrderStatusFrench {
    PENDING = "EN ATTENTE",
    VALIDATED = "VALIDÉE",
    IN_PROGRESS = "EN COURS DE TRAITEMENT",
    COMPLETED = "TERMINÉE",
    CANCELLED = "ANNULÉE",
}

export enum PaymentMethod {
    IMMEDIATE = "IMMEDIATE",
    ON_ARRIVAL = "ON_ARRIVAL",
    MOBILE_MONEY = "MOBILE_MONEY",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
}

export enum PaymentMethodFrench {
    IMMEDIATE = "PAIEMENT IMMÉDIAT",
    ON_ARRIVAL = "PAIEMENT À LA LIVRAISON",
    MOBILE_MONEY = "MOBILE MONEY",
    CARD = "CARTE BANCAIRE",
    BANK_TRANSFER = "VIREMENT BANCAIRE",
}

export enum DeliveryMethod {
    HOME_DELIVERY = "HOME_DELIVERY",
    STORE_PICKUP = "STORE_PICKUP",
    LIFT = "LIFT",
    PICKUP = "PICKUP",
    DROP = "DROP",
}

export enum DeliveryMethodFrench {
    HOME_DELIVERY = "LIVRAISON À DOMICILE",
    STORE_PICKUP = "RETRAIT EN MAGASIN",
    LIFT = "COVOITURAGE",
    PICKUP = "POINT DE RETRAIT",
    DROP = "DÉPÔT À UN POINT",
}

export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    PAYMENT = "PAYMENT",
    COMMISSION = "COMMISSION",
    REFUND = "REFUND",
}

export enum TransactionTypeFrench {
    DEPOSIT = "DÉPÔT",
    PAYMENT = "PAIEMENT",
    COMMISSION = "COMMISSION",
    REFUND = "REMBOURSEMENT",
}

export enum VehicleType {
    ECONOMIQUE = "ECONOMIQUE",
    CONFORT = "CONFORT",
    LUXE = "LUXE",
    UTILITAIRE = "UTILITAIRE",
}

export enum UserStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

export enum ServiceType {
    ECOMMERCE = "ECOMMERCE",
    DELIVERY = "DELIVERY",
    RESTAURANT = "RESTAURANT",
}

export enum DeliveryStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    ASSIGNED = "ASSIGNED",
}

export enum DeliveryAssignmentStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
}


export enum VariantType {
    TAILLE,
    COULEUR,
    CAPACITE,
    POIDS,
    LONGUEUR,
    LARGEUR,
}

// Models as TypeScript interfaces
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Role;
    status: UserStatus;
    phoneCountryCode?: string | null;
    phoneNumber?: string | null;
    createdAt: Date;
    updatedAt: Date;
    partnerId?: string | null;
}

export interface Wallet {
    id: string;
    balance: number;
    userId: string;
    paymentMethod: PaymentMethod;
    rechargeType: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    walletId: string;
    userId: string;
    reference?: string | null;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Vehicle {
    id: string;
    name: string;
    brand: string;
    capacity: number;
    fuel: string;
    color: string;
    model: string;
    registration: string;
    licensePlate: string;
    serialNumber: string;
    type: VehicleType;
    partnerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Trip {
    id: string;
    createdById: string;
    driverId: string;
    vehicleId: string;
    departure: string;
    departureLatitude: number;
    departureLongitude: number;
    arrival: string;
    arrivalLatitude: number;
    arrivalLongitude: number;
    date: Date;
    departureTime?: string | null;
    arrivalTime?: string | null;
    estimatedArrival: Date;
    availableSeats: number;
    distance?: number | null;
    price?: number | null;
    description?: string | null;
    instructions?: string | null;
    status: TripStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface StopPoint {
    id: string;
    tripId: string;
    label?: string | null;
    latitude: number;
    longitude: number;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    id: string;
    userId: string;
    tripId: string;
    user: User;
    trip: Trip;
    vehicleId: string;
    vehicle: Vehicle;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    amount?: number | null;
    canceledAt?: Date | null;
    createdAt: Date;
    completedAt?: Date | null;
    updatedAt: Date;
    
}

export interface Service {
    id: string;
    name: string;
    description?: string | null;
    type: ServiceType;
    imageUrl?: string | null;
    partnerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceSubscription {
    id: string;
    userId: string;
    serviceId: string;
    subscribedAt: Date;
    startDate: Date;
    endDate: Date;
}

export interface Products {
    id: string;
    name: string;
    slug: string;
    description: string;
    mainImageUrl: string;
    price: number;
    unite: number;
    pricePromo: number;
    tvaId: string;
    etatStocks: string;
    stocks: string;
    venteIndividuelle: boolean;
    nbAchatPossible: number;
    poids: number;
    longueur: number;
    largeur: number;
    hauteur: number;
    modePay: string;
    moyenPay: string;
    categories: string[];
    subcategories: string[];
}

export interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    sku: string;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    serviceId: string;
    addedById: string;
}

export interface Variant {
    id: string;
    name: string;
    value: string;
    priceDiff?: number | null;
    productId: string;
    addedById: string;
}

export interface Category {
    id: string;
    name: string;
    addedById: string;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    serviceId: string;
    addedById: string;
}

export interface Delivery {
    id: string;
    pickupAddress: string;
    pickupLat?: number | null;
    pickupLng?: number | null;
    dropAddress: string;
    dropLat?: number | null;
    dropLng?: number | null;
    description?: string | null;
    scheduledAt?: Date | null;
    status: DeliveryStatus;
    createdAt: Date;
    updatedAt: Date;
    serviceId: string;
    customerId: string;
    driverId?: string | null;
    addedById: string;
}

export interface Package {
    id: string;
    name?: string | null;
    deliveryId: string;
    description?: string | null;
    weight?: number | null;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface DeliveryAssignment {
    id: string;
    deliveryId: string;
    driverId: string;
    status: DeliveryAssignmentStatus;
    acceptedAt?: Date | null;
    completedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface EcommerceOrder {
    id: string;
    userId: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    amount?: number | null;
    canceledAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    addedById: string;
}

export interface EcommerceOrderItem {
    id: string;
    ecommerceOrderId: string;
    productId: string;
    variantId?: string | null;
    quantity: number;
    price: number;
}

export interface RestaurantOrder {
    id: string;
    userId: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    amount?: number | null;
    canceledAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    addedById: string;
}

export interface RestaurantOrderItem {
    id: string;
    restaurantOrderId: string;
    menuItemId: string;
    quantity: number;
    price: number;
}

export interface FileManager {
    id: number;
    fileCode: string;
    fileName: string;
    fileMimeType: string;
    fileSize: number;
    fileUrl: string;
    fileType: string;
    targetId: string;
    createdAt: Date;
    updatedAt: Date;
}
