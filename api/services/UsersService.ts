import { BaseResponse } from '@/types/BaseResponse'
import { getBaseUrl } from '@/types/baseUrl'
import { Pagination } from '@/types/pagination'
import { User } from '@/types/ApiReponse/UsersResponse'
import { EnrollementStatByDate, GeoCoord } from '@/types/ApiReponse/StatistiquesEnrollementResponse'
import { secureFetch } from './auth'

// filterUtilisateur

export const filterUsersTableau = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<Pagination<User>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/admin/filter/modeAffichage/params?page=${page}&limit=${limit}`, {
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
        const response = await secureFetch(`${getBaseUrl()}/auth/admin/filter/modeAffichage/params?page=${page}&limit=${limit}`, {
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

export const filterUsersmodeGraphique = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<EnrollementStatByDate[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/admin/filter/modeAffichage/params?page=${page}&limit=${limit}`, {
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