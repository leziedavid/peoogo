import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { transactionTypeToFrench } from "@/types/mapping/transactionTypeToFrench";
import { TransactionResponse } from "../ApiReponse/TransactionResponse";

export const columns: ColumnDef<TransactionResponse>[] = [
    {
        accessorKey: "transactionNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                N° TRANSACTION
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-semibold">{row.original.transactionNumber}</span>
        ),
    },
    {
        accessorKey: "type",
        header: "TYPE",
        cell: ({ row }) => {
            const type = row.original.type;
            const label = transactionTypeToFrench[type] ?? type;
            const colorMap: Record<string, string> = {
                DEPOSIT: "bg-green-600",
                PAYMENT: "bg-blue-600",
                COMMISSION: "bg-yellow-500",
                REFUND: "bg-red-600",
            };
            return (
                <Badge className={`${colorMap[type] ?? "bg-gray-400"} text-white`}>
                    {label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amount",
        header: "MONTANT",
        cell: ({ row }) => (
            <span>{row.original.amount.toLocaleString()} FCFA</span>
        ),
    },
    {
        accessorKey: "description",
        header: "DESCRIPTION",
        cell: ({ row }) => (
            <span>{row.original.description ?? "—"}</span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "DATE",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return (
                <span>
                    {date.toLocaleDateString()}{" "}
                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            );
        },
    },
];
