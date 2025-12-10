// app/(your-path)/your-data-file.ts

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const data: Payment[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@example.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
]

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "status", header: "SATUT", cell: ({ row }) => <div className="capitalize"> {row.getValue("status")} </div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
                    EMAIL< ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase" > {row.getValue("email")} </div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right" > MONTANT </div>,
        cell: ({ row }) => { const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD",}).format(amount)
            return <div className="text-right font-medium" > {formatted} </div>
        },
    },
]
