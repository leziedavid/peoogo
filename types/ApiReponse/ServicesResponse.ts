// types/ServicesResponse.ts

import { ServiceType, User } from "../AllTypes";
import type { LucideIcon } from 'lucide-react'

export interface Service {
    id: string;
    name: string;
    description: string;
    type: ServiceType;
    imageUrl: string | null;
    icon: LucideIcon | null;
    partnerId: string;
    createdAt: string;
    updatedAt: string;
    price: number;
    promoPrice: number;
    isActivePromo: boolean;
    statusService: boolean;
    partner: User;
    files: any[]; // Si tu as un type pour les fichiers, remplace `any`
}

export interface Partner {
    id: string;
    email: string;
    password: string;
    name: string;
    role: "ADMIN" | "USER" | "PARTNER"; // Ajuste selon ton enum Role
    status: "ACTIVE" | "INACTIVE";       // Idem pour UserStatus
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    createdAt: string;
    updatedAt: string;
    partnerId: string | null;
}
