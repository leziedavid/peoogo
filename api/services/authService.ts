import { LoginDto, RefreshTokenResponse, RegisterDto, UserAuth } from '@/types/ApiRequest/Auth'
import { BaseResponse } from '@/types/BaseResponse'
import { getBaseUrl } from '@/types/baseUrl'
import { Pagination } from '@/types/pagination'
import { User } from '@/types/ApiReponse/UsersResponse'
import {OrderStatus} from '@/types/AllTypes'
import { StatistiquesCommandesResponse } from '@/types/ApiReponse/StatistiquesCommandesResponse'
import { OrderPayload } from '@/types/ApiRequest/OrderPayloadRequest'
import { EcommerceOrder } from '@/types/ApiReponse/EcommerceOrderResponse'
import { MonthlyTransactionStat } from '@/types/ApiReponse/MonthlyTransactionStatsResponse'
import { TransactionResponse } from '@/types/ApiReponse/TransactionResponse'
import { StatistiquesTransactionResponse } from '@/types/ApiReponse/StatistiquesTransactionResponse'
import { Message } from '@/types/ApiReponse/MessagesResponse'
import { DashboardStatsResponse } from '@/types/ApiReponse/dashboardStatsResponse'
import { UserListDto } from '@/types/ApiReponse/userListResponse'
import { secureFetch } from './auth'
import { EnrollementStatByDate, GeoCoord } from '@/types/ApiReponse/StatistiquesEnrollementResponse'


// ✅ Récupérer tous les utilisateurs
export const getAllUser = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<User>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/users?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error)
        throw error
    }
};


// filterUsers

export const filterUsersTableau = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<Pagination<User>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/users/filters?page=${page}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur lors du filtrage des enrôlements :', error);
        throw error;
    }
};

export const filterUsersmodeCarte = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<GeoCoord[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/users/filters?page=${page}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(filters),
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur lors du filtrage des enrôlements :', error);
        throw error;
    }
};

export const filterUsersmodeGraphique = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<EnrollementStatByDate[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/users/filters?page=${page}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur lors du filtrage des enrôlements :', error);
        throw error;
    }
};

export const getOrdersAndRevenueStats = async (startDate?: string, endDate?: string): Promise<BaseResponse<StatistiquesCommandesResponse>> => {
    try {
        const url = new URL(`${getBaseUrl()}/products/admin/stats/orders-revenue`);
        if (startDate) url.searchParams.append('startDate', startDate);
        if (endDate) url.searchParams.append('endDate', endDate);

        const response = await secureFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des graphiques commandes/revenus :', error);
        throw error;
    }

};

// Créer une commande e-commerce
export const submitOrder = async (payload: OrderPayload): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la création de la commande :", error);
        throw error;
    }
};

// Annuler une commande e-commerce
export const cancelEcommerceOrder = async (orderId: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order/${orderId}/cancel`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data: BaseResponse<any> = await response.json();
        return data; // ✅ on retourne bien la réponse

    } catch (error) {
        console.error("Erreur lors de l'annulation de la commande :", error);
        throw error;
    }
};

// ✅ Mettre à jour le statut d’une commande via URL (car backend : /:id/status/:status)
export const updateOrderStatusEcommerce = async (orderId: string, newStatus: OrderStatus): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order/${orderId}/status/${newStatus}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                // ⚠️ Pas besoin de body ici !
            }
        );
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la commande :", error);
        throw error;
    }
};

// Commandes contenant des produits créés par l’utilisateur connecté
export const getOrdersByCreator = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<EcommerceOrder>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order/creator/orders/me?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes créées par l’utilisateur :', error);
        throw error;
    }
};

// Récupérer toutes les commandes e-commerce
export const getAllOrders = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<EcommerceOrder>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
        throw error;
    }
};

// Récupérer toutes les commandes e-commerce de l'utilisateur connecté getOrdersByUserId
export const getOrdersByUserId = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<EcommerceOrder>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order/user/me?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
        throw error;
    }
};

export const getOrdersHistoryByUserId = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<EcommerceOrder>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order/user/me/history/by-user?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
        throw error;
    }
};

// Statistiques globales des commandes et gains Ecommerce
export const getOrderStatsAndGains = async (): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/ecommerce-order/stats/orders-gains`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques globales des commandes et gains :', error);
        throw error;
    }
};
// Statistiques des commandes et revenus par mois Ecommerce
export const getOrdersAndRevenueStatsEcommerce = async (startDate?: string, endDate?: string): Promise<BaseResponse<StatistiquesCommandesResponse>> => {
    try {
        const url = new URL(`${getBaseUrl()}/ecommerce-order/stats/orders-revenue`);
        if (startDate) url.searchParams.append('startDate', startDate);
        if (endDate) url.searchParams.append('endDate', endDate);

        const response = await secureFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des commandes et revenus par mois  :', error);
        throw error;
    }


}

// "Liste paginée de toutes les commandes (admin)"
export const getAllTransactions = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<TransactionResponse>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/transactions?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error)
        throw error
    }
};

// Statistiques mensuelles  Admin des transactions

export const getMonthlyTransactionStats = async (startDate?: string, endDate?: string): Promise<BaseResponse<MonthlyTransactionStat[]>> => {
    try {
        const url = new URL(`${getBaseUrl()}/transactions/stats/monthly`);
        if (startDate) url.searchParams.append('startDate', startDate);
        if (endDate) url.searchParams.append('endDate', endDate);

        const response = await secureFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques mensuelles des transactions :', error);
        throw error;
    }
};

export const getMonthlyUsersTransactionStats = async (startDate?: string, endDate?: string): Promise<BaseResponse<MonthlyTransactionStat[]>> => {
    try {
        const url = new URL(`${getBaseUrl()}/transactions/stats/monthly/user`);
        if (startDate) url.searchParams.append('startDate', startDate);
        if (endDate) url.searchParams.append('endDate', endDate);

        const response = await secureFetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques mensuelles des transactions :', error);
        throw error;
    }
};

// "Transactions paginées d'un utilisateur par ID"
export const getTransactionsByUser = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<TransactionResponse>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/transactions/user/me?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error)
        throw error
    }
};

//  Statistiques utilisateur par type
export const getUserTransactionStat = async (): Promise<BaseResponse<StatistiquesTransactionResponse>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/transactions/stats/user/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error)
        throw error
    }
};

//  Statistiques Admin par type
export const getAllTransactionStat = async (): Promise<BaseResponse<StatistiquesTransactionResponse>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/transactions/stats/global`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error)
        throw error
    }
};

// Messages API
// Créer un message (texte et/ou image)
export const createMessage = async (payload: FormData): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages`, {
            method: 'POST',
            body: payload,
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la création du message :", error);
        throw error;
    }
};

// Mettre à jour un message
export const updateMessage = async (id: string, payload: FormData): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/${id}`, {
            method: 'PATCH',
            body: payload,
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du message :", error);
        throw error;
    }
};


// Supprimer un message
export const deleteMessage = async (id: string): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du message :", error);
        throw error;
    }
};

// Récupère tous les messages liés à une commande (lastOrderId)
export const getMessagesByOrderId = async (lastOrderId: string): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/order/${lastOrderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        throw error;
    }
};

// Récupère les messages liés à une commande avec pagination
export const getMessagesByOrderIdPaginated = async (lastOrderId: string, page: number, limit: number): Promise<any> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/order/${lastOrderId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        throw error;
    }
};

// Récupère les messages envoyés par un utilisateur avec pagination (userId)
export const getMessagesByUserIdPaginated = async (page: number, limit: number): Promise<BaseResponse<Pagination<Message>>> => {
    try {

        const response = await secureFetch(`${getBaseUrl()}/messages/user/messages?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        throw error;
    }
};

// getMessagesBySenderIdPaginated

export const getMessagesBySenderIdPaginated = async (senderId: string, page: number, limit: number): Promise<BaseResponse<Pagination<Message>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/user/messages/senderId/${senderId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        throw error;
    }
};

/** Récupère tous les messages avec pagination */
//  getAllMessagesPaginated
export const getAllMessagesPaginated = async (page: number, limit: number): Promise<BaseResponse<Pagination<Message>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/messages/user/messages/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        throw error;
    }
};

// getDashboardStats
// getDashboardStats
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/statistique/dashboard/compte`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        throw error;
    }
};

// export Users filtré par createdAt
export const exportUsersExcel = async (filter: any): Promise<void> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/statistique/users/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filter),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'users.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erreur lors de l’export des utilisateurs :', error);
        throw error;
    }
};

// export Enrollements filtré par status_dossier et période start_date / end_date
export const exportEnrollementsExcel = async (filter: any): Promise<void> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/statistique/enrollements/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filter),
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'enrollements.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erreur lors de l’export des enrôlements :', error);
        throw error;
    }
};


// agents/enroleurs
export const getAgentsEnroleurs = async (): Promise<BaseResponse<UserListDto[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/agents/enroleurs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        throw error;
    }
};

// agents/controle

export const getAgentsControles = async (): Promise<BaseResponse<UserListDto[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/agents/controle`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        throw error;
    }
};

// Ontermined
export const Ontermined = async (agent_enroleur_id: string, numero_lot: string) => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/agents/${agent_enroleur_id}/lots/${numero_lot}/terminate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        throw error;
    }
};
