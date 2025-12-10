import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EcommerceOrder } from "../ApiReponse/EcommerceOrderResponse";
import { orderStatusToFrench } from "@/types/mapping/orderStatusToFrench";
import { paymentMethodToFrench } from "@/types/mapping/paymentMethodToFrench";
import { deliveryMethodToFrench } from "@/types/mapping/deliveryMethodToFrench";

export const columns: ColumnDef<EcommerceOrder>[] = [
    {
        accessorKey: "ordersNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                N° COMMANDE
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-semibold">{row.original.ordersNumber}</span>
        ),
    },
    {
        accessorKey: "user.name",
        header: "CLIENT",
        cell: ({ row }) => <span>{row.original.user?.name ?? "N/A"}</span>,
    },
    {
        accessorKey: "amount",
        header: "MONTANT",
        cell: ({ row }) => (
            <span>{row.original.amount.toLocaleString()} FCFA</span>
        ),
    },
    {
        accessorKey: "status",
        header: "STATUT",
        cell: ({ row }) => {
            const status = row.original.status;
            const colorMap: Record<string, string> = {
                PENDING: "bg-yellow-500",
                VALIDATED: "bg-green-600",
                IN_PROGRESS: "bg-blue-600",
                COMPLETED: "bg-orange-600",
                CANCELLED: "bg-red-600",
            };

            const label = orderStatusToFrench[status] ?? status;
            console.log(colorMap[status]);
            return (
                <Badge className={`${colorMap[status] || "bg-gray-400"} text-white`} >
                    {label}
                </Badge>
            );
        },
    }
    ,
    {
        accessorKey: "paymentMethod",
        header: "PAIEMENT",
        cell: ({ row }) => (
            <Badge variant="outline" className="bg-gray-100 text-black"> {paymentMethodToFrench[row.original.paymentMethod] ??
                    row.original.paymentMethod}
            </Badge>
        ),
    },
    {
        accessorKey: "deliveryMethod",
        header: "LIVRAISON",
        cell: ({ row }) => (
            <span> {deliveryMethodToFrench[row.original.deliveryMethod] ?? row.original.deliveryMethod} </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "DATE",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return (
                <span>
                    {date.toLocaleDateString()} -{" "}
                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            );
        },
    },
];
