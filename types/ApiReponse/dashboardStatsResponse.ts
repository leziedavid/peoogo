export interface GraphItem {
    date: string;
    total: number;
}

export interface TotalsResponse {
    orders: number;
    products: number;
    transactions: number;
    enrollements: number;
    users: number;
    notifications: number;
}

export interface GraphsResponse {
    orders: GraphItem[];
    products: GraphItem[];
    transactions: GraphItem[];
    enrollements: GraphItem[];
    users: GraphItem[];
    notifications: GraphItem[];
}

export interface DashboardStatsData {
    totals: TotalsResponse;
    graphs: GraphsResponse;
}

export interface DashboardStatsResponse {
    statusCode: number;
    message: string;
    data: DashboardStatsData;
}
