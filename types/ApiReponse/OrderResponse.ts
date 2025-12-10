import { OrderStatus, PaymentMethod, StopPoint, TripStatus, User, VehicleType } from "../AllTypes";

export interface Order {
    id: string;
    orderNumber: string;
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

export interface Trip {
    id: string;
    createdById: string;
    driverId: string;
    vehicleId: string;
    vehicle: Vehicle;
    stopPoints?: StopPoint[] | null;
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