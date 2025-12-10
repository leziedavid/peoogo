// src/components/contact/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactResponse } from "../ApiReponse/contactResponse";

export const columns: ColumnDef<ContactResponse>[] = [
    {
        accessorKey: "nomPrenom",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nom & Prénom
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <span className="font-semibold">{row.original.nomPrenom}</span>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
        accessorKey: "phone",
        header: "Téléphone",
        cell: ({ row }) => <span>{row.original.phone}</span>,
    },
    {
        accessorKey: "objets",
        header: "Objet de contact",
        cell: ({ row }) => <span>{row.original.objets}</span>,
    },
    {
        accessorKey: "contents",
        header: "Message",
        cell: ({ row }) => <span>{row.original.contents}</span>,
    },
    {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => <span>{row.original.source ?? "contact_form_agricole"}</span>,
    },
    {
        accessorKey: "timestamp",
        header: "Date d'envoi",
        cell: ({ row }) => (
            <span>{new Date(row.original.timestamp).toLocaleString()}</span>
        ),
    },
];
