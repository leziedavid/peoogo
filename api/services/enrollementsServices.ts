

import { EnrollementData } from '@/types/ApiReponse/enrollementControleResponse'
import { ActiviteResponse, DepartmentResponse, DistrictResponse, LocaliteResponse, RegionResponse, SousPrefectureResponse, StatusDossier } from '@/types/ApiReponse/ListeResponse'
import { EnrollementStatByDate, GeoCoord } from '@/types/ApiReponse/StatistiquesEnrollementResponse'
import { BaseResponse } from '@/types/BaseResponse'
import { getBaseUrl } from '@/types/baseUrl'
import { Pagination } from '@/types/pagination'
import { tr } from 'date-fns/locale'
import { toast } from 'sonner'
import { secureFetch } from './auth'

// get allActivite

export const getAllActivite = async (): Promise<BaseResponse<ActiviteResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/activites`, {
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

export const getAllSpeculations = async (): Promise<BaseResponse<ActiviteResponse[]>> => {
    try {

        const response = await fetch(`${getBaseUrl()}/speculations`, {
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

export  const getAllDistricts = async (): Promise<BaseResponse<DistrictResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/districts`, {
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

export const getAllRegions = async (): Promise<BaseResponse<RegionResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/regions`, {
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

// getAllDepartments
export const getAllDepartments = async (): Promise<BaseResponse<DepartmentResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments`, {
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

export const getAllSousPrefectures = async (): Promise<BaseResponse<SousPrefectureResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/sous-prefectures`, {
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

export const getAllLocalites = async (): Promise<BaseResponse<LocaliteResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/localites`, {
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

// posteEnrollements
export const createEnrollement = async (formData: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements`, {
            method: 'POST',
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la création du formulaire d'enrôlement :", error);
        throw error;
    }
};

export const updateEnrollement = async (id: string, formData: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/${id}`, {
            method: 'PATCH',
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du formulaire d'enrôlement :", error);
        throw error;
    }
};

export const deleteEnrollement = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/${id}`, {
            method: 'DELETE',
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du formulaire d'enrôlement :", error);
        throw error;
    }
};

export const getEnrollementsById = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollements/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des enrôlements :", error);
        throw error;
    }
};
// getAllEnrollements
export const getAllEnrollements = async (): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getAllEnrollements:', error);
        throw error;
    }
};

export const getAllEnrollementsByPage = async (page: number, limit: number): Promise<BaseResponse<Pagination<any>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getAllEnrollementsByPage:', error);
        throw error;
    }
}

// getAllPaginate
export const getAllPaginate = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<EnrollementData>>> => {

    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/paginates/listes/one/paginate-all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getAllPaginate:', error);
        throw error;
    }
}


// paginate/liste/all
// assignLotIfNeeded

export const assignLotIfNeeded = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<EnrollementData>>> => {

    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/paginate/liste/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getAllPaginate:', error);
        throw error;
    }
}

export const updateEnrollementPartialData = async (id: string, formData: any): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/${id}`, {
            method: 'PATCH',
            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du formulaire d'enrôlement :", error);
        throw error;
    }
};

// getAllDistricts
export const getAllDecoupageDistricts = async (): Promise<BaseResponse<DistrictResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/import-decoupage/districts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getAllDistricts:', error);
        throw error;
    }
};

// getRegionsByDistrict
export const getRegionsByDistrict = async (districtId: string): Promise<BaseResponse<RegionResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/import-decoupage/regions/${districtId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getRegionsByDistrict:', error);
        throw error;
    }
};

// getDepartmentsByRegion
export const getDepartmentsByRegion = async (regionId: string): Promise<BaseResponse<DepartmentResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/import-decoupage/departments/${regionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getDepartmentsByRegion:', error);
        throw error;
    }
};

// getSousPrefecturesByDepartment
export const getSousPrefecturesByDepartment = async (departmentId: string): Promise<BaseResponse<SousPrefectureResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/import-decoupage/sous-prefectures/${departmentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getSousPrefecturesByDepartment:', error);
        throw error;
    }
};

// getLocalitesBySousPrefecture
export const getLocalitesBySousPrefecture = async (sousPrefectureId: string): Promise<BaseResponse<LocaliteResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/import-decoupage/localites/${sousPrefectureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur dans getLocalitesBySousPrefecture:', error);
        throw error;
    }
};

export const controlEnrollement = async ( id: string,payload: {sexe : string, status_dossier: string, commentaire_controle?: string, numeroLot?: string }): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/${id}/controle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return await response.json();

    } catch (error) {

        console.error("Erreur lors du contrôle de l'enrôlement :", error);
        throw error;
    }
};

// filterEnrollements

export const filterEnrollementsTableau = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<Pagination<EnrollementData>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/admin/filter/modeAffichage/params?page=${page}&limit=${limit}`, {
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

export const filterEnrollementsmodeCarte = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<GeoCoord[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/enrollements/admin/filter/modeAffichage/params?page=${page}&limit=${limit}`, {
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

export const filterEnrollementsmodeGraphique = async (filters: FilterRequest, page: number, limit: number): Promise<BaseResponse<EnrollementStatByDate[]>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/admin/filter/modeAffichage/params?page=${page}&limit=${limit}`, {
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


// getStatistiquesControle

export const getStatistiquesControle = async (numero_lot?: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/stats/controle${numero_lot ? `?numero_lot=${numero_lot}` : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des enrôlements :', error);
        throw error;
    }
};

// getStatsAdmin

export const getStatsAdmin = async (filters: FilterRequest): Promise<BaseResponse<any>> => {

    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/stats/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des enrôlements :', error);
        throw error;
    }

};

export const getPaginatedByAgent = async (page: number, limit: number): Promise<BaseResponse<Pagination<EnrollementData>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/enrollements/liest/enrollement/paginate/by-agent?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();

    } catch (error) {
        console.error('Erreur lors du filtrage des enrôlements :', error);
        throw error;
    }
};

