// src/dto/response/user-list.dto.ts

import { AllRole } from "../AllTypes";

export interface UserListDto {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    status: AllRole;
    wallet: {
        balance: number;
        accountNumber: string;
    } | null;
    imageUrl: string | null;
}
