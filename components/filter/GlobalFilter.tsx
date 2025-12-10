'use client';

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter} from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import { getAllDecoupageDistricts, getDepartmentsByRegion, getLocalitesBySousPrefecture, getRegionsByDistrict, getSousPrefecturesByDepartment } from '@/api/services/enrollementsServices';
import { UserListDto } from '@/types/ApiReponse/userListResponse';
import { getAgentsControles, getAgentsEnroleurs } from '@/api/services/authService';

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

// Interface pour le filtre étendue
interface FilterRequest {
    modeAffichage?: string;
    typeActeur?: string;
    controleurAgriDash?: string;
    agent?: string;
    // Découpage géographique
    districtId?: string;
    regionId?: string;
    departmentId?: string;
    sousPrefectureId?: string;
    localiteId?: string;
    // Autres champs
    periode?: string;
    statutDossier?: string;
    heureDebutEnrolement?: string;
    heureFinEnrolement?: string;
}

// Interface générique pour les options
interface SelectOption {
    id: string;
    nom: string;
}

// Props pour les composants
interface CardProps {
    children: React.ReactNode;
    className?: string;
}

interface SelectItemProps {
    value: string;
    onSelect: (value: string) => void;
    children: React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'destructive';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    children: React.ReactNode;
}

interface SearchFilterProps {
    onFilter: (filter: FilterRequest) => void;
}

interface LoadingState {
    districts: boolean;
    regions: boolean;
    departments: boolean;
    sousPrefectures: boolean;
    localites: boolean;
}

interface ResultItem {
    id: number;
    nom: string;
    type: string;
    district: string;
}


// Composant Card simple
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

const CardContent: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

// Composant Input simple
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
    <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 ${className}`}
        {...props}
    />
);


// Hook pour gérer les données géographiques
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

    // Simuler des APIs (remplacez par vos vrais endpoints)
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

// Composant principal de filtre

export default function SearchFilter({ onFilter }: SearchFilterProps) {

    const [filter, setFilter] = useState<FilterRequest>({});
    const { districts, regions, departments, sousPrefectures, localites, loading, fetchDistricts, fetchRegions, fetchDepartments, fetchSousPrefectures, fetchLocalites } = useGeographicData();
    const [agentsEnroleurs, setAgentsEnroleurs] = useState<UserListDto[]>([]);
    const [agentsControle, setAgentsControle] = useState<UserListDto[]>([]);


    const dataType = [
        { id: 'tableau', nom: 'Tableau' },
        { id: 'carte', nom: 'Carte' },
        { id: 'graphique', nom: 'Graphique' }
    ];

    // getAgentsEnroleurs
    const getAgentsEnroleur = async () => {
        const response = await getAgentsEnroleurs();
        if (response.statusCode === 200 && response.data) {
            setAgentsEnroleurs(response.data);
        }
    };

    const getAgentsControle = async () => {
        const response = await getAgentsControles();
        if (response.statusCode === 200 && response.data) {
            setAgentsControle(response.data);
        }
    };



    // Charger les districts au montage du composant
    useEffect(() => {
        fetchDistricts();
        getAgentsEnroleur();
        getAgentsControle();
    }, []);

    const handleInputChange = (key: keyof FilterRequest, value: string | number): void => {
        setFilter(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Gérer les changements de découpage géographique
    const handleDistrictChange = (districtId: string): void => {
        setFilter(prev => ({
            ...prev,
            districtId,
            regionId: undefined,
            departmentId: undefined,
            sousPrefectureId: undefined,
            localiteId: undefined
        }));

        if (districtId) {
            fetchRegions(districtId);
        }
    };

    const handleRegionChange = (regionId: string): void => {
        setFilter(prev => ({
            ...prev,
            regionId,
            departmentId: undefined,
            sousPrefectureId: undefined,
            localiteId: undefined
        }));

        if (regionId) {
            fetchDepartments(regionId);
        }
    };

    const handleDepartmentChange = (departmentId: string): void => {
        setFilter(prev => ({
            ...prev,
            departmentId,
            sousPrefectureId: undefined,
            localiteId: undefined
        }));

        if (departmentId) {
            fetchSousPrefectures(departmentId);
        }
    };

    const handleSousPrefectureChange = (sousPrefectureId: string): void => {
        setFilter(prev => ({
            ...prev,
            sousPrefectureId,
            localiteId: undefined
        }));

        if (sousPrefectureId) {
            fetchLocalites(sousPrefectureId);
        }
    };

    const handleLocaliteChange = (localiteId: string): void => {
        setFilter(prev => ({
            ...prev,
            localiteId
        }));
    };

    const handleSearch = (): void => {
        onFilter(filter);
    };

    const handleReset = (): void => {
        setFilter({});
        onFilter({});
    };

    return (
        <Card className="w-full max-w-7xl mx-auto mt-6 p-1">

            <CardHeader className="bg-white text-black rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Recherche</h2>
                    <p className="text-sm text-black ml-2">
                        Veuillez renseigner les informations ci-dessous pour faire une recherche.
                    </p>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* Première ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                            Mode d&apos;affichage<span className="text-red-500">*</span>
                        </label>
                        <SearchableSelect
                            value={filter.modeAffichage}
                            onValueChange={(value: string) => handleInputChange('modeAffichage', value)}
                            options={dataType}
                            placeholder="Tableau" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Type d&apos;acteurs / Consultation<span className="text-red-500">*</span>
                        </label>
                        <SearchableSelect
                            value={filter.typeActeur}
                            onValueChange={(value: string) => handleInputChange('typeActeur', value)}
                            options={[
                                { id: 'AQUACULTEURS', nom: 'AQUACULTEURS' },
                                { id: 'AGRICULTEURS', nom: 'AGRICULTEURS' },
                                { id: 'ÉLEVEURS', nom: 'ÉLEVEURS' },
                                { id: 'APICULTEURS', nom: 'APICULTEURS' },
                                { id: 'REVENDEUR', nom: 'REVENDEUR' },
                                { id: 'TRANSFORMATEUR', nom: 'TRANSFORMATEUR' },
                                { id: 'ACHETEUR', nom: 'ACHETEUR' },
                                { id: 'AUTRE_ACTEURS', nom: 'AUTRE_ACTEURS' }
                            ]}
                            placeholder="AGRICULTEURS"
                        />
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Agent Enrolleur
                        </label>
                        <SearchableSelect
                            value={filter.controleurAgriDash}
                            onValueChange={(value: string) => handleInputChange('controleurAgriDash', value)}
                            options={agentsEnroleurs ? agentsEnroleurs.map(enroleur => ({
                                id: enroleur.id,
                                nom: enroleur.name,
                            })) : []} // si null, options = tableau vide
                            placeholder="Choisir un contrôleur AgriDash"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Agent contrôleur
                        </label>
                        <SearchableSelect
                            value={filter.agent}
                            onValueChange={(value: string) => handleInputChange('agent', value)}
                            options={agentsControle ? agentsControle.map(agent => ({
                                id: agent.id,
                                nom: agent.name,
                            })) : []} // si null, options = tableau vide
                            placeholder="Choisir un rôle"
                        />
                    </div>

                    {/* Ligne de découpage géographique */}

                    {/* District */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">District</label>
                        <SearchableSelect
                            value={filter.districtId}
                            onValueChange={handleDistrictChange}
                            options={districts}
                            placeholder="Choisir un district"
                            loading={loading.districts}
                        />
                    </div>

                    {/* Région */}
                    {filter.districtId && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Région</label>
                            <SearchableSelect
                                value={filter.regionId}
                                onValueChange={handleRegionChange}
                                options={regions}
                                placeholder="Choisir une région"
                                loading={loading.regions}
                            />
                        </div>
                    )}

                    {/* Département */}
                    {filter.regionId && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Département</label>
                            <SearchableSelect
                                value={filter.departmentId}
                                onValueChange={handleDepartmentChange}
                                options={departments}
                                placeholder="Choisir un département"
                                loading={loading.departments}
                            />
                        </div>
                    )}

                    {/* Sous-préfecture */}
                    {filter.departmentId && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sous-préfecture</label>
                            <SearchableSelect
                                value={filter.sousPrefectureId}
                                onValueChange={handleSousPrefectureChange}
                                options={sousPrefectures}
                                placeholder="Choisir une sous-préfecture"
                                loading={loading.sousPrefectures}
                            />
                        </div>
                    )}

                    {/* Localité */}
                    {filter.sousPrefectureId && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Localité</label>
                            <SearchableSelect
                                value={filter.localiteId}
                                onValueChange={handleLocaliteChange}
                                options={localites}
                                placeholder="Choisir une localité"
                                loading={loading.localites}
                            />
                        </div>
                    )}

                </div>


                {/* Troisième ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700"> Période </label>
                        <SearchableSelect
                            value={filter.periode}
                            onValueChange={(value: string) => handleInputChange('periode', value)}
                            options={[
                                { id: 'superviseur', nom: ' Aujourd\'hui' },
                                { id: '"cette-semaine', nom: ' Cette semaine' },
                                { id: 'ce-mois', nom: ' Ce mois' }
                            ]}
                            placeholder="Choisir une période"
                        />
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Statut du dossier</label>

                        <SearchableSelect
                            value={filter.statutDossier}
                            onValueChange={(value: string) => handleInputChange('statutDossier', value)}
                            options={[
                                { id: 'NON_TRAITE', nom: 'Non traité' },
                                { id: 'VAL', nom: 'Validé' },
                                { id: 'REJ', nom: 'Rejeté' },
                                { id: 'DOUBLON', nom: 'Doublon' },
                                { id: 'ENCOURS', nom: 'En cours' },
                                { id: 'DEL', nom: 'Del' },
                                { id: 'IMAGE_INCOR', nom: 'Image incorecte' },
                                { id: 'DOUBLON_NUMBER', nom: 'Doublon de numéro' },
                            ]}
                            placeholder="Choisir un Statut"
                        />

                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Heures d&apos;enrôlement</label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="time"
                                value={filter.heureDebutEnrolement || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('heureDebutEnrolement', e.target.value)}
                                placeholder="Début"
                                className="flex-1"
                            />
                            <span className="text-gray-500">→</span>
                            <Input
                                type="time"
                                value={filter.heureFinEnrolement || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('heureFinEnrolement', e.target.value)}
                                placeholder="Fin"
                                className="flex-1"
                            />
                        </div>
                    </div>

                </div>
                <div className="flex justify-end gap-2 pt-4 mb-4">
                    <button
                        onClick={handleReset}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-sm font-medium rounded-md hover:bg-gray-200"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Réinitialiser
                    </button>
                    <button onClick={handleSearch} className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark">
                        <Filter className="w-4 h-4 mr-2" /> Rechercher
                    </button>
                </div>

            </CardContent>

        </Card>
    );

};

