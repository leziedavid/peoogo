export interface Producer {
    id: string;
    email: string;
    password: string;
    codeGenerate: string;
    passwordGenerate: string;
    enrollementsId: string;
    name: string;
    role: string;
    status: string;
    phoneCountryCode: string | null;
    phoneNumber: string;
    typeCompte: string;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    ordersNumber: string;
    userId: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    deliveryMethod: string;
    network: string | null;
    paiementNumber: string;
    amount: number;
    canceledAt: string | null;
    createdAt: string;
    updatedAt: string;
    addedById: string;
}

export interface Transaction {
    id: string;
    amount: number;
    transactionNumber: string | null;
    type: string;
    walletId: string;
    userId: string;
    reference: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface Wallet {
    id: string;
    balance: number;
    userId: string;
    paymentMethod: string;
    rechargeType: string;
    createdAt: string;
    updatedAt: string;
    accountNumber: string;
}

export interface ReversementData {
    id: string;
    producerId: string;
    orderId: string;
    totalQuantity: number;
    totalAmount: number;
    platformCommission: number;
    producerEarnings: number;
    walletId: string;
    transactionId: string;
    transactionNumber: string;
    createdAt: string;
    updatedAt: string;
    producer: Producer;
    order: Order;
    transaction: Transaction;
    wallet: Wallet;
}

export interface ReversementResponseData {
    status: boolean;
    total: number;
    page: number;
    limit: number;
    data: ReversementData[];
}

export interface ReversementResponse {
    statusCode: number;
    message: string;
    data: ReversementResponseData;
}

export interface ReversementStats {
    totalReversements: number;
    totalAmount: number;
    totalPlatformCommission: number;
    totalProducerEarnings: number;
}