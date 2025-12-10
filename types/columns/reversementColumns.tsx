import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { ReversementData } from "../ApiReponse/reversementResponse";

export const columns: ColumnDef<ReversementData>[] = [
    {
        accessorKey: "transactionNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                N° Reversement
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <span className="font-semibold">{row.original.transactionNumber}</span>,
    },
    {
        accessorKey: "producer.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Producteur
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <span>{row.original.producer.name}</span>,
    },
    {
        accessorKey: "order.ordersNumber",
        header: "Commande",
        cell: ({ row }) => <span>{row.original.order.ordersNumber}</span>,
    },
    {
        accessorKey: "totalQuantity",
        header: "Quantité totale",
        cell: ({ row }) => <span>{row.original.totalQuantity}</span>,
    },
    {
        accessorKey: "totalAmount",
        header: "Montant total",
        cell: ({ row }) => <span>{row.original.totalAmount} F CFA</span>,
    },
    {
        accessorKey: "producerEarnings",
        header: "Gains producteur",
        cell: ({ row }) => <span>{row.original.producerEarnings} F CFA</span>,
    },
    {
        accessorKey: "platformCommission",
        header: "Gains plateforme",
        cell: ({ row }) => <span>{row.original.platformCommission} F CFA</span>,
    },
    {
        accessorKey: "wallet.balance",
        header: "Solde Wallet",
        cell: ({ row }) => <span>{row.original.wallet.balance} F CFA</span>,
    },
    {
        accessorKey: "createdAt",
        header: "Date de création",
        cell: ({ row }) => (
            <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: "updatedAt",
        header: "Dernière mise à jour",
        cell: ({ row }) => (
            <span>{new Date(row.original.updatedAt).toLocaleDateString()}</span>
        ),
    },
];
