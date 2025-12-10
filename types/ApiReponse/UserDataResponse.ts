// Interface pour typer les données utilisateur
export interface UserWallet {
    id: string
    balance: number
    userId: string
    paymentMethod: string
    rechargeType: string
    createdAt: string
    updatedAt: string
    accountNumber: string
    transactions: any[]
}

export interface UserData {
    id: string
    imageUrl: string
    email: string
    password: string
    passwordGenerate: string | null
    name: string
    role: string
    status: string
    phoneCountryCode: string
    phoneNumber: string
    createdAt: string
    updatedAt: string
    partnerId: string | null
    wallet: UserWallet
}
