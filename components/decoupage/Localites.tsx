'use client';

import { useEffect, useState } from "react";
import { LocaliteResponse } from "@/types/ApiReponse/ListeResponse";
import { getLocalites } from "@/api/services/decoupageServices";
import { DataTable } from '@/components/table/dataTable';
import { columns as columnLocalites } from "@/types/columns/localitesColumns";

export default function Localites() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [localites, setLocalites] = useState<LocaliteResponse[]>([]);

    const fetchLocalites = async () => {
        try {
            const res = await getLocalites(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setLocalites(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des localités :", error);
        }
    };

    useEffect(() => {
        fetchLocalites();
    }, [currentPage]);

    const handleChangeState = (row: LocaliteResponse, newStates: string[]) => {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    };

    const handleUpdate = (row: LocaliteResponse) => {
        console.log("Update localité:", row);
    };

    const handleDelete = (row: LocaliteResponse) => {
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
                <h3 className="text-lg font-semibold">Liste des localités</h3>
                <p className="text-sm text-gray-600">{localites.length} résultats trouvés</p>
            </div>

            <DataTable
                columns={columnLocalites}
                data={localites}
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
