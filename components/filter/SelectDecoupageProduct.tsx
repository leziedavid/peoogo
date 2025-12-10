'use client';

import React, { useEffect, useState } from 'react';
import {getAllDecoupageDistricts,getRegionsByDistrict,getDepartmentsByRegion,getSousPrefecturesByDepartment,getLocalitesBySousPrefecture} from '@/api/services/enrollementsServices';
import SearchableSelect from './SearchableSelect';

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

interface SelectDecoupageProductProps {
    initialDecoupage?: DecoupageData;  // nouveau prop optionnel
    onChange?: (value: DecoupageData) => void;
}

export default function SelectDecoupageProduct({ onChange, initialDecoupage }: SelectDecoupageProductProps) {

    const [decoupage, setDecoupage] = useState<DecoupageData>(initialDecoupage ?? {});
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
            if (regionRes.statusCode === 200) {
                setOptions(prev => ({ ...prev, regions: regionRes.data ?? [] }));
            }
        }

        if (stored.regionId) {
            const depRes = await getDepartmentsByRegion(stored.regionId);
            if (depRes.statusCode === 200) {
                setOptions(prev => ({ ...prev, departments: depRes.data ?? [] }));
            }
        }

        if (stored.departmentId) {
            const sousRes = await getSousPrefecturesByDepartment(stored.departmentId);
            if (sousRes.statusCode === 200) {
                setOptions(prev => ({ ...prev, sousPrefectures: sousRes.data ?? [] }));
            }
        }

        if (stored.sousPrefectureId) {
            const locRes = await getLocalitesBySousPrefecture(stored.sousPrefectureId);
            if (locRes.statusCode === 200) {
                setOptions(prev => ({ ...prev, localites: locRes.data ?? [] }));
            }
        }
    };

    // Appel la cascade d’options selon initialDecoupage au montage
    useEffect(() => {
        const fetchData = async () => {
            await fetchDistricts();

            if (initialDecoupage) {
                setDecoupage(initialDecoupage);
                setIsLocked(true);
                await fetchCascade(initialDecoupage);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [initialDecoupage]);

    const fetchDistricts = async () => {
        const res = await getAllDecoupageDistricts();
        if (res.statusCode === 200) {
            setOptions(prev => ({ ...prev, districts: res.data ?? [] }));
        }
    };

    const updateDecoupage = (key: keyof DecoupageData, value: string) => {

        const resetCascade = {
            regionId: undefined,
            departmentId: undefined,
            sousPrefectureId: undefined,
            localiteId: undefined
        };

        const reset: DecoupageData = {
            ...decoupage,
            ...key === 'districtId' ? resetCascade :
                key === 'regionId' ? { departmentId: undefined, sousPrefectureId: undefined, localiteId: undefined } :
                    key === 'departmentId' ? { sousPrefectureId: undefined, localiteId: undefined } :
                        key === 'sousPrefectureId' ? { localiteId: undefined } :
                            {},
            [key]: value
        };

        setDecoupage(reset);
         onChange?.(reset); // 🟢 Appelle le parent
        if (key === 'districtId') getRegionsByDistrict(value).then(r => setOptions(o => ({ ...o, regions: r.data ?? [] })));
        if (key === 'regionId') getDepartmentsByRegion(value).then(r => setOptions(o => ({ ...o, departments: r.data ?? [] })));
        if (key === 'departmentId') getSousPrefecturesByDepartment(value).then(r => setOptions(o => ({ ...o, sousPrefectures: r.data ?? [] })));
        if (key === 'sousPrefectureId') getLocalitesBySousPrefecture(value).then(r => setOptions(o => ({ ...o, localites: r.data ?? [] })));
    };

    if (isLoading) {
        return <div className="p-4 text-center">Chargement du découpage...</div>;
    }

    return (
        <div className="">
            <div className="space-y-4">
                <SearchableSelect value={decoupage.districtId} onValueChange={v => updateDecoupage('districtId', v)} options={options.districts} placeholder="Choisir un district" disabled={isLocked}/>

                {decoupage.districtId && (
                    <SearchableSelect value={decoupage.regionId} onValueChange={v => updateDecoupage('regionId', v)} options={options.regions} placeholder="Choisir une région" disabled={isLocked} />
                )}

                {decoupage.regionId && (
                    <SearchableSelect value={decoupage.departmentId} onValueChange={v => updateDecoupage('departmentId', v)} options={options.departments} placeholder="Choisir un département" disabled={isLocked} />
                )}

                {decoupage.departmentId && (
                    <SearchableSelect value={decoupage.sousPrefectureId}  onValueChange={v => updateDecoupage('sousPrefectureId', v)} options={options.sousPrefectures} placeholder="Choisir une sous-préfecture" disabled={isLocked} />
                )}

                {decoupage.sousPrefectureId && (
                    <SearchableSelect value={decoupage.localiteId} onValueChange={v => updateDecoupage('localiteId', v)} options={options.localites} placeholder="Choisir une localité" disabled={isLocked} />
                )}

            </div>
        </div>
    );
}
