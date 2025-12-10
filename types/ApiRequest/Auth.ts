import { Role, UserStatus } from "../AllTypes"

export interface LoginDto {
    email?: string
    password: string
    phoneNumber?: string
}

export interface RegisterDto {
    email: string
    name: string
    password: string
    role: Role
    status?: UserStatus
    phoneCountryCode?: string
    phoneNumber?: string
    file?: File
    carte?: File
    permis?: File
}


export interface User {
    id: string
    email: string
    name: string
    role: Role
    status: UserStatus
    imageUrl: string | null
}

export interface UserAuth {
    access_token: string
    refresh_token: string
    user: User
}

export interface RefreshTokenResponse {
    access_token: string
}

