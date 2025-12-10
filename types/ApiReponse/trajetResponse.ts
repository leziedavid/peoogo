import { Order, StopPoint, TripStatus, Vehicle } from "../AllTypes"


// Trajet principal
export interface Trip {
    id: string
    createdById: string
    driverId: string
    vehicleId: string
    departure: string
    departureLatitude: number
    departureLongitude: number
    arrival: string
    arrivalLatitude: number
    arrivalLongitude: number
    date: string
    departureTime: string | null
    arrivalTime: string | null
    estimatedArrival: string
    availableSeats: number
    distance: number
    price: number
    description: string
    instructions: string
    status: TripStatus;
    createdAt: Date;
    updatedAt: Date;
    vehicle: Vehicle
    stopPoints: StopPoint[]
    orders: Order[] // Remplace `any` par un type `Order` si tu en as un
}
