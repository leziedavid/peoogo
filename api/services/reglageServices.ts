// api/adminApi.ts
import { BaseResponse } from '@/types/BaseResponse';
import { getBaseUrl } from '@/types/baseUrl';
import { secureFetch } from './auth';
import { Pagination } from '@/types/pagination';
import { Partenaire, PaymentMethode, Publicite, Reglage, Slider } from '@/types/ApiReponse/adminApi';

export interface FolderResponse {
    name: string;
    fileCount: number;
}

/* -------------------- SLIDER -------------------- */
export const createSlider = async (formData: FormData): Promise<BaseResponse<Slider>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/slider`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création du slider :', error);
        throw error;
    }
};

export const updateSlider = async (id: string, formData: FormData): Promise<BaseResponse<Slider>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/slider/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du slider :', error);
        throw error;
    }
};

export const deleteSlider = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/slider/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la suppression du slider :', error);
        throw error;
    }
};

export const getSliderById = async (id: string): Promise<BaseResponse<Slider>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/slider/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération du slider :', error);
        throw error;
    }
};

export const getAllSliders = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Slider>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/slider?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des sliders :', error);
        throw error;
    }
};

/* -------------------- PUBLICITE -------------------- */
export const createPublicite = async (formData: FormData): Promise<BaseResponse<Publicite>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/publicite`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création de la publicité :', error);
        throw error;
    }
};

export const updatePublicite = async (id: string, formData: FormData): Promise<BaseResponse<Publicite>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/publicite/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la publicité :', error);
        throw error;
    }
};

export const deletePublicite = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/publicite/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la suppression de la publicité :', error);
        throw error;
    }
};

export const getPubliciteById = async (id: string): Promise<BaseResponse<Publicite>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/publicite/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération de la publicité :', error);
        throw error;
    }
};

export const getAllPublicites = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Publicite>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/publicite?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des publicités :', error);
        throw error;
    }
};

export const getAllPublicitesHome = async (): Promise<BaseResponse<Publicite[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/publicite/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des publicités :', error);
        throw error;
    }
};

/* -------------------- REGLAGE -------------------- */
export const createReglage = async (formData: FormData): Promise<BaseResponse<Reglage>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reglage`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création du réglage :', error);
        throw error;
    }
};

export const updateReglage = async (id: string, formData: FormData): Promise<BaseResponse<Reglage>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reglage/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du réglage :', error);
        throw error;
    }
};

export const deleteReglage = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reglage/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la suppression du réglage :', error);
        throw error;
    }
};

export const getReglageById = async (id: string): Promise<BaseResponse<Reglage>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reglage/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération du réglage :', error);
        throw error;
    }
};

export const getAllReglages = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Reglage>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/reglage?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },

        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des réglages :', error);
        throw error;
    }
};


export const getAllReglagesHome = async (): Promise<BaseResponse<Reglage[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/reglage/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },

        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des réglages :', error);
        throw error;
    }
};

/* -------------------- PARTENAIRE -------------------- */

export const createPartenaire = async (formData: FormData): Promise<BaseResponse<Partenaire>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/partenaire`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création du partenaire :', error);
        throw error;
    }
};

export const updatePartenaire = async (id: string, formData: FormData): Promise<BaseResponse<Partenaire>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/partenaire/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du partenaire :', error);
        throw error;
    }
};

export const deletePartenaire = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/partenaire/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la suppression du partenaire :', error);
        throw error;
    }
};

export const getAllPartenairesHomes = async (): Promise<BaseResponse<Partenaire[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/partenaire/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des partenaires :', error);
        throw error;
    }
};

export const getAllPartenaires = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Partenaire>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/partenaire`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des partenaires :', error);
        throw error;
    }
};


/* -------------------- PAYMENT METHODES -------------------- */

export const createPaymentMethode = async (formData: FormData): Promise<BaseResponse<PaymentMethode>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode`, {
            method: 'POST',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la création de la méthode de paiement :", error);
        throw error;
    }
};

export const updatePaymentMethode = async (id: string, formData: FormData): Promise<BaseResponse<PaymentMethode>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode/${id}`, {
            method: 'PATCH',
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la méthode de paiement :", error);
        throw error;
    }
};

export const deletePaymentMethode = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression de la méthode de paiement :", error);
        throw error;
    }
};

export const getPaymentMethodeById = async (id: string): Promise<BaseResponse<PaymentMethode>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/payment-methode/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération de la méthode de paiement :", error);
        throw error;
    }
};

export const getAllPaymentMethodes = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<PaymentMethode>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/payment-methode?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des méthodes de paiement :", error);
        throw error;
    }
};

export const getAllPaymentMethodesHome = async (): Promise<BaseResponse<PaymentMethode[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/payment-methode/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des méthodes de paiement (home) :", error);
        throw error;
    }
};


/**
 * Récupérer la liste des dossiers
 */
export const fetchFolders = async (): Promise<BaseResponse<FolderResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/statistique/images/folders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });

        return (await response.json()) as BaseResponse<FolderResponse[]>;
    } catch (error) {
        console.error("Erreur lors de la récupération des dossiers :", error);
        throw error;
    }
};


// Récupère l'URL du zip généré
export const downloadFolderApi = async (folder: string): Promise<BaseResponse<{ zipUrl: string }>> => {
    const folderQuery = folder === 'Tous' ? '' : `?folder=${encodeURIComponent(folder)}`;
    const response = await fetch(`${getBaseUrl()}/statistique/images/backup${folderQuery}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    return (await response.json()) as BaseResponse<{ zipUrl: string }>;
};

