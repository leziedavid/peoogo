'use client';

import { useEffect, useState } from "react";
import { DistrictResponse } from "@/types/ApiReponse/ListeResponse";
import { getDistricts } from "@/api/services/decoupageServices";
import { DataTable } from '@/components/table/dataTable';
import { columns as columnDistricts } from "@/types/columns/districtColumns";

export default function District() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [districts, setDistricts] = useState<DistrictResponse[]>([]);

    // Pour la suppression / sélection

    const fetchDistricts = async () => {
        try {
            const res = await getDistricts(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setDistricts(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des districts :", error);
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, [currentPage]);

    const handleChangeState = (row: DistrictResponse, newStates: string[]) => {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    };

    const handleUpdate = (row: DistrictResponse) => {
        console.log("Update district:", row);
    };

    const handleDelete = (row: DistrictResponse) => {
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
                <h3 className="text-lg font-semibold">Liste des districts</h3>
                <p className="text-sm text-gray-600">{districts.length} résultats trouvés</p>
            </div>

            <DataTable
                columns={columnDistricts}
                data={districts}
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
