"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/dataTable";
import { OrderStatus, OrderStatusFrench } from "@/types/AllTypes";
import { Link2, Plus, ShoppingCart, StretchHorizontal, SwatchBook } from "lucide-react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Flame, Send, Users, Heart, Eye } from 'lucide-react';
import { useOrderSocket } from '@/lib/socket/useOrderSocket';
import { getAllTransactions, getAllTransactionStat, getMonthlyTransactionStats, getMonthlyUsersTransactionStats, getTransactionsByUser, getUserTransactionStat, updateOrderStatusEcommerce } from "@/api/services/authService";
import { getUserRole } from "@/app/middleware";
import { columns as transactioncolumns } from "@/types/columns/transaction-columns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MonthlyTransactionStat } from "@/types/ApiReponse/MonthlyTransactionStatsResponse";
import TransactionLineChart from "@/components/chart/TransactionLineChart";
import { TransactionResponse } from "@/types/ApiReponse/TransactionResponse";
import { StatistiquesTransactionResponse } from "@/types/ApiReponse/StatistiquesTransactionResponse";
import { transactionTypeToFrench } from "@/types/mapping/transactionTypeToFrench";

export default function Page() {

    // useOrderSocket() 

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
    const [data, setFormInitialValues] = useState<TransactionResponse | undefined>(undefined);
    const [allTransaction, setAllTransaction] = useState<TransactionResponse[]>([]);
    const [roles, setRoles] = useState<string>("");
    const [globalTransactionStats, setGlobalTransactionStats] = useState<StatistiquesTransactionResponse | null>(null);
    const [ordersAndRevenueStats, setMonthlyTransactionStats] = useState<MonthlyTransactionStat[]>([]);
    // startDate
    const [startDate, setStartDate] = useState<string | null>(null);
    // endDate
    const [endDate, setEndDate] = useState<string | null>(null);

    const router = useRouter();
    const [tab, setTab] = useState<'products' | 'orders'>('orders');

    // getUserroles
    const fetchroles = async () => {
        const roles = await getUserRole();
        if (roles) {
            setRoles(roles);
        }
    }

    // Récupérer toutes les Transactions admin
    const getAllTransaction = async () => {
        try {
            const res = await getAllTransactions(currentPage, limit);
            if (res.data) {
                setAllTransaction(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // liste des produit d'un utilisateur connnecté getAllValidProducts
    const gteUsersAllTransaction = async () => {
        try {
            const res = await getTransactionsByUser(currentPage, limit);
            if (res.data) {
                setAllTransaction(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Statistiques des transactions mensuelles
    const fetchAllTransactionStats = async (startDate?: string, endDate?: string) => {
        try {
            const res = await getMonthlyTransactionStats(startDate, endDate);
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                setMonthlyTransactionStats(res.data); // ✅ on envoie le tableau entier
                console.log('Transaction stats:', res.data);
            } else {
                setMonthlyTransactionStats([]); // en cas de tableau vide
            }
        } catch (e) {
            console.error("Erreur dans fetchAllTransactionStats:", e);
            setMonthlyTransactionStats([]); // fallback en cas d’erreur
        }
    };


    // Statistiques des transactions mensuelles
    const fetchAllUserTransactionStats = async (startDate?: string, endDate?: string) => {
        try {
            const res = await getMonthlyUsersTransactionStats(startDate, endDate);
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                setMonthlyTransactionStats(res.data); // ✅ on envoie le tableau entier
                console.log('Transaction stats:', res.data);
            } else {
                setMonthlyTransactionStats([]); // en cas de tableau vide
            }
        } catch (e) {
            console.error("Erreur dans fetchAllTransactionStats:", e);
            setMonthlyTransactionStats([]); // fallback en cas d’erreur
        }
    };


    //  Statistiques utilisateur par type
    const getUserTransactionStats = async () => {
        try {
            const res = await getUserTransactionStat();
            if (res.data) {
                setGlobalTransactionStats(res.data); // Ici res.data doit être de type StatistiquesTransactionResponse
                console.log('Global stats:', res.data);

            }
        } catch (e) {
            console.error(e);
        }
    };

    // Statistiques des transactions Admin par type
    const getAllTransactionStats = async () => {
        try {
            const res = await getAllTransactionStat();
            if (res.data) {
                setGlobalTransactionStats(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchroles();
        console.log('roles', roles);

        if (roles === "ADMIN") {
            getAllTransactionStats();
            getAllTransaction();
            fetchAllTransactionStats();
        }
        else if(roles === "USER") {
            getUserTransactionStats();
            gteUsersAllTransaction();
            fetchAllUserTransactionStats();
        }

    }, [roles, startDate, endDate]);


    function closeForm() {
        setIsFormOpen(false);
        setFormInitialValues(undefined);
    }

    async function handleChangeState(row: TransactionResponse, newStates: string[]) {
        try {
            const translatedStates = newStates.map((frValue) => {
                const match = Object.entries(OrderStatusFrench).find(
                    ([, value]) => value === frValue
                );
                return match?.[0] as OrderStatus;
            }).filter(Boolean); // supprime les undefined

            if (!translatedStates.length) {
                toast.error("Statut invalide.");
                return;
            }

            const res = await updateOrderStatusEcommerce(row.id, translatedStates[0]);

            if (res.statusCode === 200) {
                toast.success(`Commande mise à jour avec succès.`);
                fetchroles();
                if (roles === "ADMIN") {
                    getAllTransaction();
                    fetchAllTransactionStats();
                }
                else {
                    gteUsersAllTransaction();
                    fetchAllTransactionStats();
                }

            } else if (res.statusCode === 404) {
                toast.error(res.message || "Commande introuvable.");

            } else if (res.statusCode === 403) {
                toast.error(res.message || "Action interdite, seul le chauffeur peut réserver.");
            }
            else {
                toast.error(res.message || "Erreur lors de la mise à jour de la commande.");
            }

        } catch (error) {
            toast.error("Une erreur s’est produite lors de la mise à jour.");
        }
    }

    function handleUpdate(row: TransactionResponse) {
        setFormInitialValues(row);
        setIsFormOpen(true);

    }

    function handleDelete(row: TransactionResponse) {

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

    const isDataEmpty = !allTransaction || allTransaction.length <= 0;

    return (
        <div className="w-full overflow-x-auto">

            {globalTransactionStats ? (
                <div className="col-span-3 md:col-span-2 flex flex-col items-center md:items-start gap-4 pt-1 px-2">
                    <p className="flex w-full gap-2 pt-4 font-extrabold text-2xl md:text-3xl dark:text-white">
                        <span>Mes transactions</span>
                        <ShoppingCart className="w-6 h-6" />
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8 pt-4 mx-auto w-full">
                        {/* <div
                            title="Montant total"
                            className="md:col-start-2 lg:col-auto flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200"
                        >
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-2xl">
                                    {globalTransactionStats.totalAmount.toLocaleString()}
                                </span>
                                <StretchHorizontal className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center">Montant</span>
                        </div> */}

                        <div
                            title="Nombre total de transactions"
                            className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200"
                        >
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-2xl">
                                    {globalTransactionStats.totalCount}
                                </span>
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center">Total Transactions</span>
                        </div>

                        {globalTransactionStats.sumsByType.map((typeItem) => (
                            <div key={typeItem.type} title={transactionTypeToFrench[typeItem.type] ?? typeItem.type} className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200" >
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold text-xl md:text-2xl">
                                        {typeItem.amount.toLocaleString()}
                                    </span>
                                    <StretchHorizontal className="w-6 h-6" />
                                </div>
                                <span className="font-semibold text-sm text-center">
                                    {transactionTypeToFrench[typeItem.type] ?? typeItem.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-400 py-8">Chargement des statistiques...</p>
            )}


            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <TransactionLineChart data={ordersAndRevenueStats} />
            </div>

            {isDataEmpty ? (

                <DataTableSkeleton columnCount={5} rowCount={10} />

            ) : (

                <DataTable
                    columns={transactioncolumns}
                    data={allTransaction}
                    onChangeState={handleChangeState}
                    // onUpdateData={handleUpdate}
                    // stateOptions={Object.values(OrderStatusFrench)} // 👈 Ici on injecte les statuts
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                />

            )}

            {/* {isFormOpen && (
                <OrdersEcommerceDetail
                    data={data}
                    onClose={closeForm}
                    isOpen={isFormOpen}
                />
            )} */}

        </div>
    );
}



