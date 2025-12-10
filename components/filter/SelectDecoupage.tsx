'use client';

import React, { useEffect, useState } from 'react';
import { Save, OctagonX } from 'lucide-react';
import {
    getAllDecoupageDistricts,
    getRegionsByDistrict,
    getDepartmentsByRegion,
    getSousPrefecturesByDepartment,
    getLocalitesBySousPrefecture
} from '@/api/services/enrollementsServices';
import SearchableSelect from './SearchableSelect';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface SelectOption {
    id: string;
    nom: string;
}

interface DecoupageData {
    districtId?: string;
    regionId?: string;
    departmentId?: string;
    sousPrefectureId?: string;
    localiteId?: string;
}

const LOCALSTORAGE_DECOUPAGE_KEY = 'enrollement_decoupage';

interface SelectDecoupageProps {
    onChange?: (value: DecoupageData) => void;
}

export default function SelectDecoupage({ onChange }: SelectDecoupageProps) {
    const [decoupage, setDecoupage] = useState<DecoupageData>({});
    const [options, setOptions] = useState<{
        districts: SelectOption[];
        regions: SelectOption[];
        departments: SelectOption[];
        sousPrefectures: SelectOption[];
        localites: SelectOption[];
    }>({
        districts: [],
        regions: [],
        departments: [],
        sousPrefectures: [],
        localites: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);

    const fetchCascade = async (stored: DecoupageData) => {
        if (stored.districtId) {
            const regionRes = await getRegionsByDistrict(stored.districtId);
            if (regionRes.statusCode === 200) setOptions(prev => ({ ...prev, regions: regionRes.data ?? [] }));
        }
        if (stored.regionId) {
            const depRes = await getDepartmentsByRegion(stored.regionId);
            if (depRes.statusCode === 200) setOptions(prev => ({ ...prev, departments: depRes.data ?? [] }));
        }
        if (stored.departmentId) {
            const sousRes = await getSousPrefecturesByDepartment(stored.departmentId);
            if (sousRes.statusCode === 200) setOptions(prev => ({ ...prev, sousPrefectures: sousRes.data ?? [] }));
        }
        if (stored.sousPrefectureId) {
            const locRes = await getLocalitesBySousPrefecture(stored.sousPrefectureId);
            if (locRes.statusCode === 200) setOptions(prev => ({ ...prev, localites: locRes.data ?? [] }));
        }
    };

    const fetchDistricts = async () => {
        const res = await getAllDecoupageDistricts();
        if (res.statusCode === 200) setOptions(prev => ({ ...prev, districts: res.data ?? [] }));
    };

    useEffect(() => {
        const stored = localStorage.getItem(LOCALSTORAGE_DECOUPAGE_KEY);
        fetchDistricts().then(() => {
            if (stored) {
                const parsed: DecoupageData = JSON.parse(stored);
                setDecoupage(parsed);
                setIsLocked(true);
                fetchCascade(parsed);
            }
            setIsLoading(false);
        });
    }, []);

    const updateDecoupage = (key: keyof DecoupageData, value: string) => {
        const resetCascade = {
            regionId: undefined,
            departmentId: undefined,
            sousPrefectureId: undefined,
            localiteId: undefined
        };

        const reset: DecoupageData = {
            ...decoupage,
            ...(key === 'districtId'
                ? resetCascade
                : key === 'regionId'
                    ? { departmentId: undefined, sousPrefectureId: undefined, localiteId: undefined }
                    : key === 'departmentId'
                        ? { sousPrefectureId: undefined, localiteId: undefined }
                        : key === 'sousPrefectureId'
                            ? { localiteId: undefined }
                            : {}),
            [key]: value
        };

        setDecoupage(reset);
        onChange?.(reset);

        if (key === 'districtId') getRegionsByDistrict(value).then(r => setOptions(o => ({ ...o, regions: r.data ?? [] })));
        if (key === 'regionId') getDepartmentsByRegion(value).then(r => setOptions(o => ({ ...o, departments: r.data ?? [] })));
        if (key === 'departmentId') getSousPrefecturesByDepartment(value).then(r => setOptions(o => ({ ...o, sousPrefectures: r.data ?? [] })));
        if (key === 'sousPrefectureId') getLocalitesBySousPrefecture(value).then(r => setOptions(o => ({ ...o, localites: r.data ?? [] })));
    };

    const saveDecoupage = () => {
        // 🟢 Utiliser '_' correctement pour ESLint
        const cleaned = Object.fromEntries(
            Object.entries(decoupage).filter(([key, value]) => value)
        );
        localStorage.setItem(LOCALSTORAGE_DECOUPAGE_KEY, JSON.stringify(cleaned));
        toast.success('Découpage sauvegardé localement !');
        setIsLocked(true);
    };

    const resetDecoupage = () => {
        setDecoupage({});
        localStorage.removeItem(LOCALSTORAGE_DECOUPAGE_KEY);
        setIsLocked(false);
        toast.success('Découpage réinitialisé !');
    };

    if (isLoading) return <div className="p-4 text-center">Chargement du découpage...</div>;

    return (
        <Card>
            <CardHeader>
                <h2 className="text-lg font-semibold">Sélectionner un découpage</h2>
            </CardHeader>

            <CardContent className="space-y-4">
                <SearchableSelect value={decoupage.districtId} onValueChange={v => updateDecoupage('districtId', v)} options={options.districts} placeholder="Choisir un district" disabled={isLocked} />

                {decoupage.districtId && (
                    <SearchableSelect value={decoupage.regionId} onValueChange={v => updateDecoupage('regionId', v)} options={options.regions} placeholder="Choisir une région" disabled={isLocked} />
                )}

                {decoupage.regionId && (
                    <SearchableSelect value={decoupage.departmentId} onValueChange={v => updateDecoupage('departmentId', v)} options={options.departments} placeholder="Choisir un département" disabled={isLocked} />
                )}

                {decoupage.departmentId && (
                    <SearchableSelect value={decoupage.sousPrefectureId} onValueChange={v => updateDecoupage('sousPrefectureId', v)} options={options.sousPrefectures} placeholder="Choisir une sous-préfecture" disabled={isLocked} />
                )}

                {decoupage.sousPrefectureId && (
                    <SearchableSelect value={decoupage.localiteId} onValueChange={v => updateDecoupage('localiteId', v)} options={options.localites} placeholder="Choisir une localité" disabled={isLocked} />
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button type="button" onClick={saveDecoupage} variant="outline" className="gap-2" disabled={!decoupage.districtId || isLocked}>
                    <Save size={16} />
                    Sauvegarder découpage
                </Button>

                <Button type="button" onClick={resetDecoupage} variant="ghost" className="gap-2 text-red-600" disabled={!decoupage.districtId}>
                    <OctagonX size={50} />
                </Button>
            </CardFooter>
        </Card>
    );
}
