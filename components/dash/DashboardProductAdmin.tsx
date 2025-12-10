'use client';

import {ShoppingCart, Heart, SwatchBook, StretchHorizontal } from "lucide-react";
import { StatistiquesDesProduitsResponse } from "@/types/ApiReponse/StatistiquesDesProduitsResponse";

interface DashboardProductGridProps {
    userName: string | null
    onChangeTab: (tab: 'liste' | 'ajout') => void; // ✅ nouvelle prop
    activeTab: string,
    statistique: StatistiquesDesProduitsResponse | null

}

export default function DashboardProductAdmin({activeTab, statistique }: DashboardProductGridProps) {

    return (

        <div className="p-6 space-y-3">
            {/* Header */}
            <div className="text-2xl text-[#B07B5E] font-bold">Liest de tous les produits 🌟</div>

            {activeTab === "liste" && (

                <div className="dark:bg-gray-800">

                    <div className="col-span-3 md:col-span-2 flex flex-col items-center md:items-start gap-4 pt-1 px-2">

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8 pt-0 mx-auto  w-full">

                            <div title="All contributed components"
                                className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold text-xl md:text-2xl">{statistique?.totalOrders} </span>
                                    <ShoppingCart className="w-6 h-6 text-[#B07B5E]" />
                                </div>
                                <span className="font-semibold text-sm text-center text-[#B07B5E]"> Total Commandes</span>
                            </div>

                            <div title="Users got help"
                                className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold text-xl md:text-2xl">{statistique?.totalSoldProducts} </span>
                                    <Heart className="w-6 h-6 text-[#B07B5E]" />
                                </div>
                                <span className="font-semibold text-sm text-center text-[#B07B5E]"> Total Vendus</span>
                            </div>

                            <div title="Total favorites received on components"
                                className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold text-xl md:text-2xl"> {statistique?.totalProducts} </span>
                                    <SwatchBook className="w-6 h-6 text-[#B07B5E]" />
                                </div>
                                <span className="font-semibold text-sm text-center text-[#B07B5E]"> Total Produits</span>
                            </div>

                            <div title="component views"
                                className="md:col-start-2 lg:col-auto flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200">
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold text-xl md:text-2xl"> {statistique?.totalStock} </span>
                                    <StretchHorizontal className="w-6 h-6 text-[#B07B5E]" />

                                </div>
                                <span className="font-semibold text-sm text-center text-[#B07B5E]"> Stock Total</span>
                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}
