'use client';

import { useEffect, useState } from "react";
import { RegionResponse } from "@/types/ApiReponse/ListeResponse";
import { getRegions } from "@/api/services/decoupageServices";
import { DataTable } from '@/components/table/dataTable';
import { columns as columnRegions } from "@/types/columns/regionColumns";

export default function Region() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [regions, setRegions] = useState<RegionResponse[]>([]);

    const fetchRegions = async () => {
        try {
            const res = await getRegions(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setRegions(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des régions :", error);
        }
    };

    useEffect(() => {
        fetchRegions();
    }, [currentPage]);

    const handleChangeState = (row: RegionResponse, newStates: string[]) => {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    };

    const handleUpdate = (row: RegionResponse) => {
        console.log("Update région:", row);
    };

    const handleDelete = (row: RegionResponse) => {
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            alert("Vous êtes déjà sur la dernière page.");
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            alert("Vous êtes déjà sur la première page.");
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Liste des régions</h3>
                <p className="text-sm text-gray-600">{regions.length} résultats trouvés</p>
            </div>

            <DataTable
                columns={columnRegions}
                data={regions}
                onChangeState={handleChangeState}
                onUpdateData={handleUpdate}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
            />
        </div>
    );
}
