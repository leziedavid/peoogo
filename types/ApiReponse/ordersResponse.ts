// types/ordersResponse.ts

import { OrderStatus, PaymentMethod, TripStatus } from "../AllTypes";

export interface OrdersResponse {
    statusCode: number;
    message: string;
    data: PaginatedOrders;
}

export interface PaginatedOrders {
    status: boolean;
    total: number;
    page: number;
    limit: number;
    data: Order[];
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    tripId: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    amount: number | null;
    canceledAt: string | null;
    createdAt: string;
    completedAt: string | null;
    updatedAt: string;
    trip: Trip;
    user: User;
}

// export type OrderStatus = 'PENDING' | 'VALIDATED' | 'CANCELLED' | 'COMPLETED';
// export type PaymentMethod = 'ON_ARRIVAL' | 'ONLINE' | string;

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
    date: string;
    departureTime: string | null;
    arrivalTime: string | null;
    estimatedArrival: string;
    availableSeats: number;
    distance: number;
    price: number;
    description: string;
    instructions: string;
    status: TripStatus;
    createdAt: string;
    updatedAt: string;
    driver: User;
    vehicle: Vehicle;
}

// export type TripStatus = 'PENDING' | 'VALIDATED' | 'CANCELLED' | 'COMPLETED';

export interface User {
    id: string;
    email: string;
    password: string;
    passwordGenerate: string | null;
    name: string;
    role: User;
    status: OrderStatus;
    phoneCountryCode: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    partnerId: string | null;
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
    type: string;
    partnerId: string;
    createdAt: string;
    updatedAt: string;
}
