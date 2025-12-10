import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoader() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2 cursor-pointer">
                    <div className="relative w-full bg-muted rounded-md aspect-video mb-1 overflow-hidden w-full h-32 md:h-40">
                        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
                        <div className="absolute top-2 right-2">
                            {/* <Skeleton className="h-5 w-14 rounded-md bg-black/10" /> */}
                        </div>
                    </div>
                    <div className="p-3 text-sm flex flex-col gap-2">
                        <Skeleton className="h-4 w-2/3 rounded-md" />
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                        <Skeleton className="h-3 w-full rounded-md" />
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <Skeleton className="h-3 w-1/2 rounded-md" />
                        <Skeleton className="h-3 w-1/3 rounded-md" />
                        <Skeleton className="h-3 w-2/3 rounded-md" />
                        <Skeleton className="h-8 w-full rounded-md mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
