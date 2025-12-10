// types/api/Pagination.ts
export interface Pagination<T> {
    status: boolean;
    total: number;
    page: number;
    limit: number;
    data: T[];
}

// types/models/Service.ts
export interface Service {
    id: string;
    name: string;
    description: string;
    type: string;
    imageUrl: string | null;
    icon: string;
    partnerId: string;
    createdAt: string;
    updatedAt: string;
    price: number;
    promoPrice: number;
    isActivePromo: boolean;
    statusService: boolean;
}

// types/models/ServiceSubscription.ts
export interface ServiceSubscription {
    id: string;
    userId: string;
    serviceId: string;
    subscribedAt: string;
    startDate: string;
    endDate: string;
    status: string;
    service: Service;
}
