import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { getBaseUrl } from '@/types/baseUrl'
import { BaseResponse, PaymentResponse } from '@/types/BaseResponse';
import { toast } from "sonner";


interface DecodedToken {
    id: string;
    exp: number;
}


const WAVE_API_URL = 'https://api.wave.com/v1/checkout/sessions/';
const WAVE_API_KEY = 'wave_ci_prod_BRoKc90NC_ioDJ-csqkMIvPOMzidfGwFhjS7YNtk6T4ucmxisg5UI-tDCRyBc4gFy4qsaeaVL318WHkWC17Hj1KLF3mUeN3dxw';

interface LaunchPaymentResponse {
    wave_launch_url: string;
    id: string;
}

interface PaymentStatusResponse {
    payment_status: string;
    last_payment_error?: string;
}

interface PaymentPayload {
    phone: string;
    amount: number | string;
}

export const launchPayment = async (payload: PaymentPayload): Promise<BaseResponse<any>> => {
    try {

        const response = await fetch(`${getBaseUrl()}/transactions/send/wave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // ⚡️ si tu utilises un token JWT côté frontend :
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
                phone: payload.phone,
                amount: Number(payload.amount),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                message: data.message || "Erreur lors de l'initiation du paiement.",
                data: null,
            };
        }

        return {
            statusCode: 200,
            message: "Paiement lancé avec succès.",
            data,
        };
    } catch (error) {
        console.error("Erreur lors de l'initiation du paiement:", error);

        let messageErreur = "Une erreur inconnue est survenue.";
        if (error instanceof Error) {
            messageErreur = error.message;
        } else if (typeof error === "string") {
            messageErreur = error;
        }

        return {
            statusCode: 500,
            message: `Erreur lors de l'initiation du paiement : ${messageErreur}`,
            data: null,
        };
    }
};

export const requestToGetTransactionStatus = async (waveId: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/payments/${waveId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${WAVE_API_KEY}`,
            },
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                message: `Erreur HTTP lors de la récupération du statut du paiement (code ${response.status}).`,
                data: null,
            };
        }

        // ✅ tu forces toujours le retour dans le format BaseResponse
        const data = await response.json();
        return {
            statusCode: 200,
            message: "Statut du paiement récupéré avec succès.",
            data,
        };
    } catch (error) {
        console.error("Erreur lors de la connexion au serveur:", error);

        let messageErreur = "Une erreur inconnue est survenue.";
        if (error instanceof Error) {
            messageErreur = error.message;
        } else if (typeof error === "string") {
            messageErreur = error;
        }

        return {
            statusCode: 500,
            message: `Erreur lors de la récupération du statut du paiement : ${messageErreur}`,
            data: null,
        };
    }
};


export const getAllRechargements = async (page: number, limit: number): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${getBaseUrl()}/rechargements?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return await response.json();

    } catch (error) {
        console.error('Error getting trajets:', error);
        throw error;
    }
};

