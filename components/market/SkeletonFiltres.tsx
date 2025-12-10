"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonFiltres() {
    return (

        <div className="space-y-4">
            {/* Type de vente */}
            <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </div>

            {/* Catégories */}
            <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-20 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Découpage */}
            <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-9 w-full rounded-md" />
            </div>

            {/* Spéculations */}
            <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-9 w-full rounded-md" />
            </div>

            {/* Prix */}
            <div className="flex gap-2">
                <Skeleton className="h-14 w-full rounded-md" />
                <Skeleton className="h-14 w-full rounded-md" />
            </div>

            {/* Quantité */}
            <div className="flex gap-2">
                <Skeleton className="h-14 w-full rounded-md" />
                <Skeleton className="h-14 w-full rounded-md" />
            </div>

            {/* Période */}
            <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-9 w-full rounded-md" />
            </div>

            {/* Boutons */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
    );
}
