'use client';

import { useEffect, useState } from "react";
import { SousPrefectureResponse } from "@/types/ApiReponse/ListeResponse";
import { getSousPrefectures } from "@/api/services/decoupageServices";
import { DataTable } from '@/components/table/dataTable';
import { columns as columnSousPrefecture } from "@/types/columns/sousPrefecturesColumns";

export default function SousPrefectures() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [sousPrefectures, setSousPrefectures] = useState<SousPrefectureResponse[]>([]);

    const fetchSousPrefectures = async () => {
        try {
            const res = await getSousPrefectures(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setSousPrefectures(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des sous-préfectures :", error);
        }
    };

    useEffect(() => {
        fetchSousPrefectures();
    }, [currentPage]);

    const handleChangeState = (row: SousPrefectureResponse, newStates: string[]) => {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    };

    const handleUpdate = (row: SousPrefectureResponse) => {
        console.log("Update sous-préfecture:", row);
    };

    const handleDelete = (row: SousPrefectureResponse) => {
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
                <h3 className="text-lg font-semibold">Liste des sous-préfectures</h3>
                <p className="text-sm text-gray-600">{sousPrefectures.length} résultats trouvés</p>
            </div>

            <DataTable
                columns={columnSousPrefecture}
                data={sousPrefectures}
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
