
import { getUserInfos } from '@/app/middleware'
import { ContactResponse } from '@/types/ApiReponse/contactResponse'
import { BaseResponse } from '@/types/BaseResponse'
import { getBaseUrl } from '@/types/baseUrl'
import { Pagination } from '@/types/pagination'
import { tr } from 'date-fns/locale'

// Créer un contact
export const create = async (data: any): Promise<BaseResponse<ContactResponse>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(data), // 🔹 IMPORTANT : stringify l'objet
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la création du reversement :', error)
        throw error
    }
}

export const update = async (data: any): Promise<BaseResponse<ContactResponse>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/update`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(data), // 🔹 IMPORTANT : stringify l'objet
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la création du reversement :', error)
        throw error
    }
}

export const deleteContact = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la suppression du reversement :', error)
        throw error
    }
}

export const getAllPaginateContact = async (page: number, limit: number): Promise<BaseResponse<Pagination<ContactResponse>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/contact?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des reversements :', error)
        throw error
    }
}








