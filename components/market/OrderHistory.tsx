"use client";

import { useEffect, useState } from "react";
import {ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/AllTypes";
import { EcommerceOrder } from "@/types/ApiReponse/EcommerceOrderResponse";
import {getOrdersHistoryByUserId } from "@/api/services/authService";
import { getUserRole } from "@/app/middleware";
import { orderStatusToFrench, paymentMethodToFrench } from "@/types/mapping/translations";
import OrderDetails from "./OrderDetails";
import { OrderCardSkeleton } from "./OrderCardSkeleton";

export default function OrderHistory() {

    // useOrderSocket()
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [data, setDataValues] = useState<EcommerceOrder | undefined>(undefined);
    const [ecommerceOrder, setEcommerceOrder] = useState<EcommerceOrder[]>([]);
    const [roles, setRoles] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true);

    // getUserroles
    const fetchroles = async () => {
        const roles = await getUserRole();
        if (roles) {
            setRoles(roles);
        }
    }
    // Récupérer toutes les commandes e-commerce
    const getAllProduct = async () => {
        try {
            setLoading(true);
            const res = await getOrdersHistoryByUserId(currentPage, limit);
            if (res.data) {
                setEcommerceOrder(res.data.data);
                // setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchroles();

        console.log("Role détecté :", roles);

        if (roles === "AGENT_ENROLEUR") {
            getAllProduct();
        }
        else if (roles === "USER" || roles === "ADMIN") {
            getAllProduct();

        }
    }, [roles]);



    function handleUpdate(row: EcommerceOrder) {
        setDataValues(row);
        setIsOpen(true);

    }

    // function handleNextPage() {
    //     if (currentPage < Math.ceil(totalItems / limit)) {
    //         setCurrentPage(currentPage + 1);
    //     } else {
    //         alert("Vous êtes déjà sur la dernière page.");
    //     }
    // }

    // function handlePreviousPage() {
    //     if (currentPage > 1) {
    //         setCurrentPage(currentPage - 1);
    //     } else {
    //         alert("Vous êtes déjà sur la première page.");
    //     }
    // }


    return (

        <div className="p-4 space-y-4">
            {loading ? Array.from({ length: 5 }).map((_, i) => <OrderCardSkeleton key={i} />) :ecommerceOrder.map((order, index) => (
                    <div key={order.id} className="rounded-lg bg-gray-50">
                        <div onClick={() => handleUpdate(order)} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                {/* Icône pour type de commande (ex: Livraison ou Pickup) */}
                                <ClipboardList className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-medium text-sm">
                                        {orderStatusToFrench(order.status)},{" "}
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {paymentMethodToFrench(order.paymentMethod)}
                                    </p>
                                    {order.status === OrderStatus.CANCELLED && (
                                        <p className="text-sm text-red-500"> {orderStatusToFrench(OrderStatus.CANCELLED)} </p>
                                    )}
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={cn("font-semibold", !order.amount || order.amount === 0 ? "text-gray-400" : "text-black")}  >
                                    {order.amount} XOF
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            <OrderDetails isOpen={isOpen} onClose={() => setIsOpen(false)} order={data} />
        </div>

    );
};
