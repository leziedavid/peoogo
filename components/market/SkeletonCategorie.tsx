"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCategorie() {
    return (
        <div className="flex gap-2 flex-wrap mb-6 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-8 w-20 rounded-full bg-gray-200"
                />
            ))}
        </div>
    );
}
