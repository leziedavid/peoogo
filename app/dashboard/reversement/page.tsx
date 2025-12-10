"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/dataTable";
import { ShoppingCart, StretchHorizontal } from "lucide-react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useOrderSocket } from '@/lib/socket/useOrderSocket';
import { getUserRole } from "@/app/middleware";
import { columns as reversementColumns } from "@/types/columns/reversementColumns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { transactionTypeToFrench } from "@/types/mapping/transactionTypeToFrench";
import { ReversementData, ReversementStats } from "@/types/ApiReponse/reversementResponse";
import { getAllReversements, getReversementStats } from "@/api/services/reversementServices";

export default function Page() {

    // useOrderSocket()
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [reversement, setReversement] = useState<ReversementData[]>([]);
    const [roles, setRoles] = useState<string>("");
    const [reversementStat, setReversementStats] = useState<ReversementStats | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const router = useRouter();

    const fetchroles = async () => {
        const roles = await getUserRole();
        if (roles) {
            setRoles(roles);
        }
    }

    const getAllReversement = async () => {
        try {
            const res = await getAllReversements(currentPage, limit);
            if (res.data) {
                setReversement(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (e) {
            console.error(e);
        }
    };


    // Statistiques des transactions Admin par type
    const getreversementStat = async () => {
        try {
            const res = await getReversementStats();
            if (res.data) {
                setReversementStats(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchroles();
        if (roles === "ADMIN") {
            getAllReversement();
            getreversementStat();
        }
    }, [roles, startDate, endDate]);


    function closeForm() {
    }

    async function handleChangeState(row: ReversementData, newStates: string[]) {

    }

    function handleUpdate(row: ReversementData) {

    }

    function handleDelete(row: ReversementData) {

    }

    function handleNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            alert("Vous êtes déjà sur la dernière page.");
        }
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            alert("Vous êtes déjà sur la première page.");
        }
    }

    const isDataEmpty = !reversement || reversement.length <= 0;

    return (
        <div className="w-full overflow-x-auto">

            {reversementStat ? (
                <div className="col-span-3 md:col-span-2 flex flex-col items-center md:items-start gap-4 pt-1 px-2">
                    <p className="flex w-full gap-2 pt-4 font-extrabold text-2xl md:text-3xl dark:text-white">
                        <span>Mes transactions</span>
                        <ShoppingCart className="w-6 h-6" />
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8 pt-4 mx-auto w-full">

                        <div title="Nombre total de transactions" className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200" >
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-2xl">
                                    {reversementStat.totalReversements}
                                </span>
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center">Nombre total de reversements</span>
                        </div>

                        <div title="Nombre total de transactions" className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200" >
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-2xl">
                                    {reversementStat.totalAmount}
                                </span>
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center">Somme total des transactions</span>
                        </div>


                        <div title="Nombre total de transactions" className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200" >
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-2xl">
                                    {reversementStat.totalPlatformCommission}
                                </span>
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center">Gain plateforme</span>
                        </div>


                        <div title="Nombre total de transactions" className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200" >
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-2xl">
                                    {reversementStat.totalProducerEarnings}
                                </span>
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center">Gain du producteur</span>
                        </div>

                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-400 py-8">Chargement des statistiques...</p>
            )}

            {isDataEmpty ? (

                <DataTableSkeleton columnCount={5} rowCount={10} />

            ) : (

                <DataTable
                    columns={reversementColumns}
                    data={reversement}
                    onChangeState={handleChangeState}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                />

            )}

        </div>
    );
}



