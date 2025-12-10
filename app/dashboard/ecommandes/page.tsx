"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/dataTable";
import { OrderStatus, OrderStatusFrench } from "@/types/AllTypes";
import { ShoppingCart, StretchHorizontal, SwatchBook } from "lucide-react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heart } from 'lucide-react';
import { getAllOrders, getOrdersAndRevenueStatsEcommerce, getOrdersByCreator, getOrderStatsAndGains, updateOrderStatusEcommerce } from "@/api/services/authService";
import { getUserRole } from "@/app/middleware";
import { columns as columnsEcommercecolumns } from "@/types/columns/columnsEcommerce-columns";
import { StatistiquesCommandesResponse } from "@/types/ApiReponse/StatistiquesCommandesResponse";
import LineChart from "@/components/chart/LineChart";
import { useRouter } from "next/navigation";
import { EcommerceOrder } from "@/types/ApiReponse/EcommerceOrderResponse";
import { StatistiquesEcommerceOrderResponse } from "@/types/ApiReponse/StatistiquesEcommerceOrderResponse";
import { toast } from "sonner";
import OrderDetails from "@/components/market/OrderDetails";
import Reversement from "@/components/form/Reversement";

export default function Page() {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
    const [data, setFormInitialValues] = useState<EcommerceOrder | undefined>(undefined);
    const [ecommerceOrder, setEcommerceOrder] = useState<EcommerceOrder[]>([]);
    const [roles, setRoles] = useState<string>("");
    const [userProductStats, setUserProductStats] = useState<StatistiquesEcommerceOrderResponse | null>(null);
    const [globalProductStats, setGlobalProductStats] = useState<StatistiquesEcommerceOrderResponse | null>(null);
    const [ordersAndRevenueStats, setOrdersAndRevenueStats] = useState<StatistiquesCommandesResponse | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false)
    const [isReversementOpen, setIsReversementOpen] = useState(false)
    const [endDate, setEndDate] = useState<string | null>(null);

    const router = useRouter();
    const [tab, setTab] = useState<'products' | 'orders'>('orders');

    // getUserroles
    const fetchroles = async () => {
        const roles = await getUserRole();

    }

    // Récupérer toutes les commandes e-commerce
    const getAllProduct = async () => {
        try {
            const res = await getAllOrders(currentPage, limit);
            if (res.data) {
                setEcommerceOrder(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // liste des produit d'un utilisateur connnecté getAllValidProducts
    const getOrdersByCreators = async () => {
        try {
            const res = await getOrdersByCreator(currentPage, limit);
            if (res.data) {
                setEcommerceOrder(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Statistiques globales des commandes et gains Ecommerce
    const getOrderStatsAndGain = async () => {
        try {
            const res = await getOrderStatsAndGains();
            if (res.data) {
                setUserProductStats(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Statistiques des commandes et revenus par mois Ecommerce
    const fetchOrdersAndRevenueStats = async (startDate?: string, endDate?: string) => {
        try {
            const res = await getOrdersAndRevenueStatsEcommerce(startDate, endDate);
            if (res.data) {
                setOrdersAndRevenueStats(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };


    useEffect(() => {
        fetchroles();
        if (roles === "ADMIN") {
            getAllProduct();
            fetchOrdersAndRevenueStats();
            getOrderStatsAndGain();

        }
        else {
            getAllProduct();
            // getOrdersByCreators();
            getOrderStatsAndGain();
            fetchOrdersAndRevenueStats();

        }

    }, [roles, startDate, endDate]);


    function closeForm() {
        setIsFormOpen(false);
        setFormInitialValues(undefined);
    }

    async function handleChangeState(row: EcommerceOrder, newStates: string[]) {
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
                    getAllProduct();
                    fetchOrdersAndRevenueStats();
                }
                else {
                    getOrdersByCreators();
                    getOrderStatsAndGain();
                    fetchOrdersAndRevenueStats();

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

    function handleUpdate(row: EcommerceOrder) {
        setFormInitialValues(row);
        setIsOpen(true);
    }

    function handleAddReversement(row: EcommerceOrder) {
        console.log("row", row);
        setFormInitialValues(row);
        setIsReversementOpen(true);
    }

    function handleDelete(row: EcommerceOrder) {

    }

    function handleValidate(row: EcommerceOrder, val: string | number) {
        alert(`Validate ${row.id} with value: ${val}`);
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

    const handleTabChange = (value: string) => {
        setTab(value as 'products' | 'orders');
        if (value === 'products') router.push('/dashboard/boutiques');
        if (value === 'orders') router.push('/dashboard/ecommandes');
    };

    const isDataEmpty = !ecommerceOrder || ecommerceOrder.length <= 0;

    return (
        <div className="w-full overflow-x-auto">

            <div className="dark:bg-gray-800">

                <div className="col-span-3 md:col-span-2 flex flex-col items-center md:items-start gap-4 pt-1 px-2">

                    <p className="flex  w-full gap-2 pt-4 font-extrabold text-1xl md:text-3xl dark:text-white ">
                        <span>Mes commandes</span>
                        <ShoppingCart className="w-8 h-8" />
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8 pt-4 mx-auto  w-full">

                        <div title="component views"
                            className="md:col-start-2 lg:col-auto flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-1xl"> {userProductStats?.totalGains} </span>
                                <StretchHorizontal className="w-6 h-6" />

                            </div>
                            <span className="font-semibold text-sm text-center"> Gains</span>
                        </div>

                        <div title="All contributed components"
                            className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-1xl">{userProductStats?.totalOrders} </span>
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center"> Total Commandes</span>
                        </div>

                        <div title="Users got help"
                            className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-1xl">{userProductStats?.totalOrdersCancelled} </span>
                                <Heart className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center"> Total Annulées</span>
                        </div>

                        <div title="Total favorites received on components"
                            className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-1xl"> {userProductStats?.totalOrdersCompleted} </span>
                                <SwatchBook className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm text-center"> Total Terminées</span>
                        </div>

                        <div title="component views"
                            className="md:col-start-2 lg:col-auto flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                            <div className="flex gap-2 items-center">
                                <span className="font-bold text-xl md:text-1xl"> {userProductStats?.totalOrdersValidated} </span>
                                <StretchHorizontal className="w-6 h-6" />

                            </div>
                            <span className="font-semibold text-sm text-center"> Total Validées</span>
                        </div>

                    </div>

                </div>

            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <LineChart data={ordersAndRevenueStats ?? null} />
            </div>

            {isDataEmpty ? (

                <DataTableSkeleton columnCount={5} rowCount={10} />

            ) : (

                <DataTable
                    columns={columnsEcommercecolumns}
                    data={ecommerceOrder}
                    onChangeState={handleChangeState}
                    onUpdateData={handleUpdate}
                    stateOptions={Object.values(OrderStatusFrench)} // 👈 Ici on injecte les statuts
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onAddReversement={handleAddReversement}
                />

            )}
            <OrderDetails isOpen={isOpen} onClose={() => setIsOpen(false)} order={data} />

            {isReversementOpen && (
                <Reversement isOpen={isReversementOpen} onClose={() => setIsReversementOpen(false)} initialValue={data} fetchData={getAllProduct} />
            )}

        </div>
    );
}



