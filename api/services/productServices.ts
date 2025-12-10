
import { Filtre } from '@/components/market/Market'
import { EnrollementData } from '@/types/ApiReponse/enrollementControleResponse'
import { ActiviteResponse, CategorieResponse, DepartmentResponse, DistrictResponse, LocaliteResponse, RegionResponse, SousPrefectureResponse, StatusDossier } from '@/types/ApiReponse/ListeResponse'
import { Product } from '@/types/ApiReponse/ProduitsResponse'
import { StatistiquesDesProduitsResponse } from '@/types/ApiReponse/StatistiquesDesProduitsResponse'
import { UserEnrollementData } from '@/types/ApiReponse/userEnrollementData'
import { BaseResponse } from '@/types/BaseResponse'
import { getBaseUrl } from '@/types/baseUrl'
import { Pagination } from '@/types/pagination'
import { secureFetch } from './auth'

// getUserEnrollementDataByCode

export const getUserEnrollementDataByCode = async (code: string): Promise<BaseResponse<UserEnrollementData>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/auth/parametres/code/${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'enrôlement et découpage :', error)
        throw error
    }
}

// 'Créer un nouveau produit
export const createProduct = async (formData: FormData): Promise<BaseResponse<Product>> => {
    console.log('🚀 FormData view:', formData);
    try {
        const response = await secureFetch(`${getBaseUrl()}/product`, {
            method: 'POST',
            body: formData, // ✅ envoyer le FormData tel quel
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la création du produit :', error)
        throw error
    }
}

// 'Mettre à jour un produit
export const updateProduct = async (id: string, formData: FormData): Promise<BaseResponse<Product>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/${id}`, {
            method: 'PATCH',
            body: formData, // ✅ envoyer le FormData tel quel
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error)
        throw error
    }
}

// 'Supprimer un produit'
export const deleteProduct = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error)
        throw error
    }
}

// ✅ Supprimer une ou plusieurs images d'un produit
export const deleteProductImages = async (productId: string,fileUrls: string[]): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/${productId}/images`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileUrls }),
        });
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la suppression des images du produit :", error);
        throw error;
    }
};


// getProductById
export const getProductById = async (id: string): Promise<BaseResponse<Product>> => {
    try {
        if (!id) throw new Error('ID du produit manquant')

        const response = await secureFetch(`${getBaseUrl()}/produit/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()

    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error)
        throw error
    }
}

// getAllProducts
export const getAllProducts = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Product>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/produits?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error)
        throw error
    }
}

// getAllProductsIsActive
export const getAllProductsIsActive = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Product>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/produits/actives/liste?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error)
        throw error
    }
}

// getAllProductsWithStatus
export const getAllProductsWithStatus = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Product>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/produits/admin/liste?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error)
        throw error
    }
}

export const getAllProductsWithStatusOne = async (page: number = 1, limit: number = 10, selectedCategory: string | null = null): Promise<BaseResponse<Pagination<Product>>> => {
    try {
        // Construire l'URL avec des paramètres conditionnels
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        // Ajouter catégorie uniquement si elle est définie et non vide
        if (selectedCategory?.trim()) {
            params.append('categorie', selectedCategory.trim());
        }

        const url = `${getBaseUrl()}/product/listes/produits-avec-statut?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        throw error;
    }
};

// geProduitstById

export const geProduitstById = async (id: string): Promise<BaseResponse<Product>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/product/get-produit/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error)
        throw error
    }
}

// all/produits-admin
export const getAllProductsAdmin = async (page: number = 1, limit: number = 10): Promise<BaseResponse<Pagination<Product>>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/all/produits-admin?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error)
        throw error
    }
}

// produit-produiteur/:code
export const getProducteurProductsByCode = async (code: string, page: number, limit: number): Promise<BaseResponse<Pagination<Product>>> => {
    try {

        const response = await secureFetch(`${getBaseUrl()}/product/donnees/produit-produiteur?page=${page}&limit=${limit}&code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()

    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error)
        throw error
    }
}
// produit-produiteur/:code/stats
export const getProducteurProductStats = async (code: string): Promise<BaseResponse<StatistiquesDesProduitsResponse>> => {
    try {
        // if (!code) throw new Error('Code produit manquant')

        const response = await secureFetch(`${getBaseUrl()}/product/produit-produiteur/statistiques/${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return await response.json()

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des produits :', error)
        throw error
    }
}

// getGlobalProductStats
export const getGlobalProductStats = async (): Promise<BaseResponse<StatistiquesDesProduitsResponse>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/lites/produit-global-admin-all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

            },
        })

        return await response.json()

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques globales des produits :', error)
        throw error
    }
}

// @Get('filter-produits-with-status')

export const filterProductsWithStatus = async (data: Filtre, page: number, limit: number): Promise<BaseResponse<Pagination<Product>>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/product/filter-produits-with-status?page=${page}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(data),
        })
        return await response.json()

    } catch (error) {
        console.error('Erreur lors de la récupération des produits filtrés :', error)
        throw error
    }
}

// ✅ Mettre à jour la période de disponibilité
export const updateProductAvailability = async (productId: string, disponibleDe: string, disponibleJusqua: string): Promise<BaseResponse<Product>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/${productId}/availability`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ disponibleDe, disponibleJusqua }),
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la disponibilité :', error);
        throw error;
    }
};

// ✅ Mettre à jour la quantité
export const updateProductQuantity = async (productId: string, quantite: number): Promise<BaseResponse<Product>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/${productId}/quantity/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantite }),
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité :', error);
        throw error;
    }
};


export const updateProductStatus = async (productId: string, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'): Promise<BaseResponse<Product>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/product/${productId}/status/update/product`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        throw error;
    }
};

// getAllCategories

export const getAllCategories = async (): Promise<BaseResponse<CategorieResponse[]>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error)
        throw error
    }
};

export const createCategory = async (formData: FormData): Promise<BaseResponse<CategorieResponse>> => {
    console.log('🚀 FormData view:', formData);
    try {
        const response = await secureFetch(`${getBaseUrl()}/categories`, {
            method: 'POST',
            body: formData, // ✅ envoyer le FormData tel quel
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la création du produit :', error)
        throw error
    }
};

export const updateCategory = async (id: string, formData: FormData): Promise<BaseResponse<CategorieResponse>> => {
    console.log('🚀 FormData view:', formData);
    try {
        const response = await secureFetch(`${getBaseUrl()}/categories/${id}`, {
            method: 'PATCH',
            body: formData, // ✅ envoyer le FormData tel quel
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error)
        throw error
    }
};

export const deleteCategory = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const response = await secureFetch(`${getBaseUrl()}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json()
    } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error)
        throw error
    }
};
