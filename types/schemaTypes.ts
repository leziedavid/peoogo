// types/schemaTypes.ts

// Recréation des enums côté front (copie conforme à ton Prisma)

export enum Role {
    USER = "USER",
    DRIVER = "DRIVER",
    PARTNER = "PARTNER",
    ADMIN = "ADMIN",
}

export enum TripStatus {
    PENDING = "PENDING",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum OrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
    MOBILE_MONEY = "MOBILE_MONEY",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
}

export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    COMMISSION = "COMMISSION",
    REFUND = "REFUND",
}

export enum VehicleType {
    CAR = "CAR",
    MOTORCYCLE = "MOTORCYCLE",
    TRUCK = "TRUCK",
    VAN = "VAN",
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BANNED = "BANNED",
}

export enum ServiceType {
    DELIVERY = "DELIVERY",
    ECOMMERCE = "ECOMMERCE",
    RESTAURANT = "RESTAURANT",
}

export enum DeliveryStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    PICKED_UP = "PICKED_UP",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export enum DeliveryAssignmentStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

// Nouveaux enums ajoutés

export enum EcommerceOrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED",
}

export enum RestaurantOrderStatus {
    PENDING = "PENDING",
    PREPARING = "PREPARING",
    READY = "READY",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

// Interfaces principales (simplifiées pour front)

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

    wallet?: Wallet | null;
    vehiclesOwned?: Vehicle[];
    vehiclesDriven?: Vehicle[];
    trips?: Trip[];
    tripsAsDriver?: Trip[];
    partnerId?: string | null;
    partner?: User | null;
    drivers?: User[];
    transactions?: Transaction[];
    services?: Service[];
    orders?: Order[];
    ecommerceOrders?: EcommerceOrder[];
    restaurantOrders?: RestaurantOrder[];
    deliveriesAsCustomer?: Delivery[];
    deliveriesAsDriver?: Delivery[];
}

export interface Wallet {
    id: string;
    balance: number;
    userId: string;
    paymentMethod: PaymentMethod;
    rechargeType: string;
    createdAt: Date;
    updatedAt: Date;

    transactions?: Transaction[];
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

export interface Order {
    id: string;
    userId: string;
    tripId: string;
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

export interface EcommerceOrder {
    id: string;
    userId: string;
    serviceId: string;          // service lié à la commande e-commerce
    status: EcommerceOrderStatus;
    paymentMethod: PaymentMethod;
    amount?: number | null;
    canceledAt?: Date | null;
    completedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    items?: EcommerceOrderItem[];  // liste des articles commandés
}

export interface EcommerceOrderItem {
    id: string;
    ecommerceOrderId: string;
    menuItemId: string;
    quantity: number;
    price?: number | null;      // prix unitaire au moment de la commande
    createdAt: Date;
    updatedAt: Date;
}

export interface RestaurantOrder {
    id: string;
    userId: string;
    serviceId: string;           // service restaurant lié à la commande
    status: RestaurantOrderStatus;
    paymentMethod: PaymentMethod;
    amount?: number | null;
    canceledAt?: Date | null;
    completedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    items?: RestaurantOrderItem[];  // liste des plats commandés
}

export interface RestaurantOrderItem {
    id: string;
    restaurantOrderId: string;
    menuItemId: string;
    quantity: number;
    price?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

