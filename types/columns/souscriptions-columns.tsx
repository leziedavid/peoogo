import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { ServiceSubscription } from "../ApiReponse/ServiceSubscriptionResponse"

// ✅ Composant pour le switch de statut
interface StatutCellProps {
    row: any;
}
export const columns: ColumnDef<ServiceSubscription>[] = [
    {
        accessorKey: "service.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                NOM DU SERVICE
                < ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium" > {row.original.service.name} </div>,
    },
    // {
    //     accessorKey: "service.icon",
    //     header: "ICÔNE",
    //     cell: ({ row }) => {
    //         const icon = row.original.service.icon;
    //         return (
    //             <Badge className="bg-blue-100 text-blue-600 capitalize" >
    //                 {icon || "—"
    //                 }
    //             </Badge>
    //         );
    //     },
    // },
    {
        accessorKey: "service.type",
        header: "TYPE DE SERVICE",
        cell: ({ row }) => (
            <div className="uppercase font-semibold" >
                {row.original.service.type}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "STATUT",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusColor =
                status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700";

            return (
                <Badge className={statusColor} >
                    {status}
                </Badge>
            );
        },
    },

    {
        accessorKey: "startDate",
        header: "DÉBUT",
        cell: ({ row }) => {
            const date = new Date(row.original.startDate);
            return (
                <span>{date.toLocaleDateString()} </span>
            );
        },
    },
    {
        accessorKey: "endDate",
        header: "FIN",
        cell: ({ row }) => {
            const date = new Date(row.original.endDate);
            return (
                <span>{date.toLocaleDateString()} </span>
            );
        },
    },
    {
        accessorKey: "service.price",
        header: "PRIX",
        cell: ({ row }) => {
            const price = row.original.service.promoPrice || row.original.service.price;
            return <span>{price} FCFA </span>;
        },
    },
    {
        accessorKey: "subscribedAt",
        header: "DATE D’INSCRIPTION",
        cell: ({ row }) => {
            const date = new Date(row.original.subscribedAt);
            return (
                <div className="text-sm text-muted-foreground" >
                    {date.toLocaleDateString()} - {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
            );
        },
    },
]
