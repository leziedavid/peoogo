'use client';

import { useEffect, useState } from "react";
import { DepartmentResponse } from "@/types/ApiReponse/ListeResponse";
import { getDepartments } from "@/api/services/decoupageServices";
import { DataTable } from '@/components/table/dataTable';
import { columns as columnDepartement } from "@/types/columns/departementsColumns";

export default function Departements() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

    const fetchDepartments = async () => {
        try {
            const res = await getDepartments(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setDepartments(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des départements :", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [currentPage]);

    const handleChangeState = (row: DepartmentResponse, newStates: string[]) => {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    };

    const handleUpdate = (row: DepartmentResponse) => {
        console.log("Update row:", row);
    };

    const handleDelete = (row: DepartmentResponse) => {
        console.log("Delete row:", row);
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
                <h3 className="text-lg font-semibold">Liste des départements</h3>
                <p className="text-sm text-gray-600">{departments.length} résultats trouvés</p>
            </div>

            <DataTable
                columns={columnDepartement}
                data={departments}
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
