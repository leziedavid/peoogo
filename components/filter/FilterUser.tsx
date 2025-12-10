import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { getAllDecoupageDistricts, getAllDepartments, getDepartmentsByRegion, getLocalitesBySousPrefecture, getRegionsByDistrict, getSousPrefecturesByDepartment } from '@/api/services/enrollementsServices';
import { Card, CardContent, CardHeader } from '../ui/card';


// Interfaces pour les données géographiques
interface District {
    id: string;
    nom: string;
    statut?: boolean;
}

interface Region {
    id: string;
    nom: string;
    statut?: boolean;
    districtId: string;
}

interface Department {
    id: string;
    nom: string;
    regionId: string;
}

interface SousPrefecture {
    id: string;
    nom: string;
    departmentId: string;
}

interface Localite {
    id: string;
    nom: string;
    sousPrefectureId: string;
}

interface FilterRequest {
    status?: string;
    role?: string;
    typeActeur?: string;
    modeAffichage?: string;
    districtId?: string;
    regionId?: string;
    departmentId?: string;
    sousPrefectureId?: string;
    localiteId?: string;
}


interface FilterUserProps {
    onFilter: (filter: FilterRequest) => void;
}

interface LoadingState {
    districts: boolean;
    regions: boolean;
    departments: boolean;
    sousPrefectures: boolean;
    localites: boolean;
}


const useGeographicData = () => {


    const [districts, setDistricts] = useState<District[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [sousPrefectures, setSousPrefectures] = useState<SousPrefecture[]>([]);
    const [localites, setLocalites] = useState<Localite[]>([]);

    const [loading, setLoading] = useState<LoadingState>({
        districts: false,
        regions: false,
        departments: false,
        sousPrefectures: false,
        localites: false
    });

    const fetchDistricts = async (): Promise<void> => {

        setLoading(prev => ({ ...prev, districts: true }));

        try {

            const res = await getAllDecoupageDistricts()
            if (res && res.statusCode === 200) {
                setDistricts(res.data as District[]);
            } else {
                console.error('Erreur lors du chargement des districts:', res.message);
            }

        } catch (error) {
            console.error('Erreur lors du chargement des districts:', error);
        } finally {
            setLoading(prev => ({ ...prev, districts: false }));
        }

    };

    const fetchRegions = async (districtId: string): Promise<void> => {
        setLoading(prev => ({ ...prev, regions: true }));
        try {

            const res = await getRegionsByDistrict(districtId)
            if (res && res.statusCode === 200) {
                setRegions(res.data as Region[]);
            } else {
                console.error('Erreur lors du chargement des régions:', res.message);
            }

        } catch (error) {
            console.error('Erreur lors du chargement des régions:', error);
        } finally {
            setLoading(prev => ({ ...prev, regions: false }));
        }
    };

    const fetchDepartments = async (regionId: string): Promise<void> => {
        setLoading(prev => ({ ...prev, departments: true }));
        try {

            const res = await getDepartmentsByRegion(regionId)
            if (res && res.statusCode === 200) {
                setDepartments(res.data as Department[]);
            } else {
                console.error('Erreur lors du chargement des départements:', res.message);
            }

        } catch (error) {
            console.error('Erreur lors du chargement des départements:', error);
        } finally {
            setLoading(prev => ({ ...prev, departments: false }));
        }
    };

    const fetchSousPrefectures = async (departmentId: string): Promise<void> => {
        setLoading(prev => ({ ...prev, sousPrefectures: true }));

        try {

            const res = await getSousPrefecturesByDepartment(departmentId)

            if (res && res.statusCode === 200) {
                setSousPrefectures(res.data as SousPrefecture[]);
            } else {
                console.error('Erreur lors du chargement des sous-préfectures:', res.message);
            };

        } catch (error) {
            console.error('Erreur lors du chargement des sous-préfectures:', error);
        } finally {
            setLoading(prev => ({ ...prev, sousPrefectures: false }));
        }
    };

    const fetchLocalites = async (sousPrefectureId: string): Promise<void> => {
        setLoading(prev => ({ ...prev, localites: true }));
        try {

            const res = await getLocalitesBySousPrefecture(sousPrefectureId)
            if (res && res.statusCode === 200) {
                setLocalites(res.data as Localite[]);
            } else {
                console.error('Erreur lors du chargement des localités:', res.message);
            }

        } catch (error) {
            console.error('Erreur lors du chargement des localités:', error);
        } finally {
            setLoading(prev => ({ ...prev, localites: false }));
        }
    };

    return {
        districts,
        regions,
        departments,
        sousPrefectures,
        localites,
        loading,
        fetchDistricts,
        fetchRegions,
        fetchDepartments,
        fetchSousPrefectures,
        fetchLocalites
    };
};

export default function FilterUser({ onFilter }: FilterUserProps) {
    const [filter, setFilter] = useState<FilterRequest>({});
    const {
        districts,
        regions,
        departments,
        sousPrefectures,
        localites,
        loading,
        fetchDistricts,
        fetchRegions,
        fetchDepartments,
        fetchSousPrefectures,
        fetchLocalites
    } = useGeographicData();

    useEffect(() => {
        fetchDistricts();
    }, []);

    const handleInputChange = (key: keyof FilterRequest, value: string) => {
        setFilter(prev => ({ ...prev, [key]: value }));
    };

    const handleDistrictChange = (districtId: string) => {
        setFilter(prev => ({
            ...prev,
            districtId,
            regionId: undefined,
            departmentId: undefined,
            sousPrefectureId: undefined,
            localiteId: undefined
        }));
        fetchRegions(districtId);
    };

    const handleRegionChange = (regionId: string) => {
        setFilter(prev => ({
            ...prev,
            regionId,
            departmentId: undefined,
            sousPrefectureId: undefined,
            localiteId: undefined
        }));
        fetchDepartments(regionId);
    };

    const handleDepartmentChange = (departmentId: string) => {
        setFilter(prev => ({
            ...prev,
            departmentId,
            sousPrefectureId: undefined,
            localiteId: undefined
        }));
        fetchSousPrefectures(departmentId);
    };

    const handleSousPrefectureChange = (sousPrefectureId: string) => {
        setFilter(prev => ({
            ...prev,
            sousPrefectureId,
            localiteId: undefined
        }));
        fetchLocalites(sousPrefectureId);
    };

    const handleLocaliteChange = (localiteId: string) => {
        setFilter(prev => ({ ...prev, localiteId }));
    };

    const handleSearch = () => {
        onFilter(filter);
    };

    const handleReset = () => {
        setFilter({});
        onFilter({});
    };

    return (
        <Card className="w-full max-w-7xl mx-auto mt-6 p-1 mb-8">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Recherche</h2>
                    <p className="text-sm text-black ml-2">Veuillez renseigner les informations pour faire une recherche.</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Mode d&apos;affichage</label>
                        <SearchableSelect
                            value={filter.modeAffichage}
                            onValueChange={value => handleInputChange('modeAffichage', value)}
                            options={[
                                { id: 'tableau', nom: 'Tableau' },
                                { id: 'carte', nom: 'Carte' },
                                { id: 'graphique', nom: 'Graphique' }
                            ]}
                            placeholder="Choisir un mode"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Type d’acteur</label>
                        <SearchableSelect
                            value={filter.typeActeur}
                            onValueChange={value => handleInputChange('typeActeur', value)}
                            options={[
                                { id: 'AGRICULTEURS', nom: 'AGRICULTEURS' },
                                { id: 'AQUACULTEURS', nom: 'AQUACULTEURS' },
                                { id: 'APICULTEURS', nom: 'APICULTEURS' },
                                { id: 'REVENDEUR', nom: 'REVENDEUR' },
                                { id: 'TRANSFORMATEUR', nom: 'TRANSFORMATEUR' },
                                { id: 'ACHETEUR', nom: 'ACHETEUR' },
                                { id: 'AUTRE_ACTEURS', nom: 'AUTRE ACTEURS' },
                                { id: 'RELAIS', nom: 'RELAIS' },
                                { id: 'SUPPERVISEUR', nom: 'SUPPERVISEUR' },
                                { id: 'UTILISATEUR', nom: 'UTILISATEUR' },
                                { id: 'ADMINISTRATEUR', nom: 'ADMINISTRATEUR' },
                                { id: 'ELEVEURS', nom: 'ÉLEVEURS' },
                            ]}
                            placeholder="AGRICULTEURS"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Statut du compte</label>
                        <SearchableSelect
                            value={filter.status}
                            onValueChange={value => handleInputChange('status', value)}
                            options={[
                                { id: 'ACTIVE', nom: 'VALIDER' },
                                { id: 'INACTIVE', nom: 'INACTIF' }
                            ]}
                            placeholder="Choisir un statut"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Rôle</label>
                        <SearchableSelect
                            value={filter.role}
                            onValueChange={value => handleInputChange('role', value)}
                            options={[
                                { id: 'ADMIN', nom: 'ADMINISTRATEUR' },
                                { id: 'AGENT', nom: 'AGENT' },
                                { id: 'SUPERVISEUR', nom: 'AGENT SUPERVISEUR' },
                                { id: 'USER', nom: 'UTILISATEUR' },
                                { id: 'AGENT_ENROLEUR', nom: 'AGENT ENROLEUR' },
                                { id: 'AGENT_CONTROLE', nom: 'AGENT CONTROLE' },
                                { id: 'PRODUCTEUR', nom: 'UTILISATEUR ENROLER' },
                            ]}
                            placeholder="Choisir un rôle"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">District</label>
                        <SearchableSelect
                            value={filter.districtId}
                            onValueChange={handleDistrictChange}
                            options={districts}
                            loading={loading.districts}
                            placeholder="Choisir un district"
                        />
                    </div>

                    {filter.districtId && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Région</label>
                            <SearchableSelect
                                value={filter.regionId}
                                onValueChange={handleRegionChange}
                                options={regions}
                                loading={loading.regions}
                                placeholder="Choisir une région"
                            />
                        </div>
                    )}

                    {filter.regionId && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Département</label>
                            <SearchableSelect
                                value={filter.departmentId}
                                onValueChange={handleDepartmentChange}
                                options={departments}
                                loading={loading.departments}
                                placeholder="Choisir un département"
                            />
                        </div>
                    )}

                    {filter.departmentId && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Sous-préfecture</label>
                            <SearchableSelect
                                value={filter.sousPrefectureId}
                                onValueChange={handleSousPrefectureChange}
                                options={sousPrefectures}
                                loading={loading.sousPrefectures}
                                placeholder="Choisir une sous-préfecture"
                            />
                        </div>
                    )}

                    {filter.sousPrefectureId && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Localité</label>
                            <SearchableSelect
                                value={filter.localiteId}
                                onValueChange={handleLocaliteChange}
                                options={localites}
                                loading={loading.localites}
                                placeholder="Choisir une localité"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4 mb-4">
                    <button
                        onClick={handleReset}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-sm font-medium rounded-md hover:bg-gray-200"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Réinitialiser
                    </button>
                    <button
                        onClick={handleSearch}
                        className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark"
                    >
                        <Filter className="w-4 h-4 mr-2" /> Rechercher
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
