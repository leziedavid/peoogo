
import { getUserInfos } from '@/app/middleware'
import { ReversementData, ReversementStats } from '@/types/ApiReponse/reversementResponse'
import { BaseResponse } from '@/types/BaseResponse'
import { getBaseUrl } from '@/types/baseUrl'
import { Pagination } from '@/types/pagination'
import { tr } from 'date-fns/locale'
import { secureFetch } from './auth'

// Créer un reversement pour un producteur

export const createReversement = async (data: any): Promise<BaseResponse<ReversementData>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reversement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'
            },
            body: JSON.stringify(data), // 🔹 IMPORTANT : stringify l'objet
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la création du reversement :', error)
        throw error
    }
}

// Récupérer tous les reversements avec pagination
export const getAllReversements = async (page: number, limit: number): Promise<BaseResponse<Pagination<ReversementData>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reversement?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des reversements :', error)
        throw error
    }
}

// Récupérer un reversement par ID
export const getReversementById = async (id: string): Promise<BaseResponse<ReversementData>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reversement/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération du reversement :', error)
        throw error
    }
}

// Supprimer un reversement
export const deleteReversement = async (id: string): Promise<BaseResponse<ReversementData>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reversement/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la suppression du reversement :', error)
        throw error
    }
}

// Récupérer les reversements d’un producteur
export const getReversementsByProducer = async (producerId: string, page: number, limit: number): Promise<BaseResponse<Pagination<ReversementData>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reversement/producer/${producerId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des reversements :', error)
        throw error
    }
}

// Statistiques globales des reversements et gains
export const getReversementStats = async (): Promise<BaseResponse<ReversementStats>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/reversement/stats/total-gains`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error)
        throw error
    }
}

