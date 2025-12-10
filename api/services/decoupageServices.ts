
import { getUserInfos } from '@/app/middleware'
import { EnrollementData } from '@/types/ApiReponse/enrollementControleResponse'
import { ActiviteResponse, DepartmentResponse, DistrictResponse, LocaliteResponse, RegionResponse, SousPrefectureResponse, StatusDossier } from '@/types/ApiReponse/ListeResponse'
import { EnrollementStatByDate, GeoCoord } from '@/types/ApiReponse/StatistiquesEnrollementResponse'
import { BaseResponse } from '@/types/BaseResponse'
import { getBaseUrl } from '@/types/baseUrl'
import { Pagination } from '@/types/pagination'
import { tr } from 'date-fns/locale'

// POST
// /api/import-decoupage/upload
// Importer un fichier CSV ou Excel pour le découpage

export const uploadFile = async (formData: FormData): Promise<any> => {
    try {
        const response = await fetch(`${getBaseUrl()}/import-decoupage/upload`, {
            method: 'POST',
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'enrôlement :', error);
        throw error;
    }
};

// Lister les districts'
export const getDistricts =  async (page: number, limit: number): Promise<BaseResponse<Pagination<DistrictResponse>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/districts/paginate/liste/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

export const getDistrictById = async (id: string): Promise<DistrictResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/districts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

export const updateDistrict = async (id: string, dto: any): Promise<DistrictResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/districts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(dto),
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
export const deleteDistrict = async (id: string): Promise<void> => {
    try {
        await fetch(`${getBaseUrl()}/districts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

// Lister les régions'
export const getRegions = async (page: number, limit: number): Promise<BaseResponse<Pagination<RegionResponse>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/regions/paginate/liste/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

export const getRegionById = async (id: string): Promise<RegionResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/regions/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

export const updateRegion = async (id: string, dto: any): Promise<RegionResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/regions/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(dto),
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

export const deleteRegion = async (id: string): Promise<void> => {
    try {
        await fetch(`${getBaseUrl()}/regions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
// Lister les départements'
export const getDepartments = async (page: number, limit: number): Promise<BaseResponse<Pagination<DepartmentResponse>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments/paginate/liste/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
export const getDepartmentById = async (id: string): Promise<DepartmentResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

export const updateDepartment = async (id: string, dto: any): Promise<DepartmentResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(dto),
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
export const deleteDepartment = async (id: string): Promise<void> => {
    try {
        await fetch(`${getBaseUrl()}/departments/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

// Lister les sous-préfectures'
export const getSousPrefectures = async (page: number, limit: number): Promise<BaseResponse<Pagination<SousPrefectureResponse>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/sous-prefectures/paginate/liste/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
export const getSousPrefectureById = async (id: string): Promise<SousPrefectureResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/sous-prefectures/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
export const updateSousPrefecture = async (id: string, dto: any): Promise<SousPrefectureResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/sous-prefectures/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(dto),
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
// Supprimer un sous-préfecture
export const deleteSousPrefecture = async (id: string): Promise<void> => {
    try {
        await fetch(`${getBaseUrl()}/sous-prefectures/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}

// Lister les localités'
export const getLocalites = async (page: number, limit: number): Promise<BaseResponse<Pagination<LocaliteResponse>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/localites/paginate/liste/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
export const getLocaliteById = async (id: string): Promise<LocaliteResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/localites/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
export const updateLocalite = async (id: string, dto: any): Promise<LocaliteResponse> => {
    try {
        const response = await fetch(`${getBaseUrl()}/localites/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
            body: JSON.stringify(dto),
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
// Supprimer un localité
export const deleteLocalite = async (id: string): Promise<void> => {
    try {
        await fetch(`${getBaseUrl()}/localites/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        })
    } catch (error) {
        console.error('Erreur dans allActivite:', error)
        throw error
    }
}
