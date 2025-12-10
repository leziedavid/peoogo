"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnrollementData } from "../ApiReponse/enrollementControleResponse";

// Pour les colonnes de tableau des enrôlements
export const columns: ColumnDef<EnrollementData>[] = [

    {
        accessorKey: "code",
        header: "CODE",
        cell: ({ row }) => <span>{row.original.code}</span>,
    },
    {
        accessorKey: "nom",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                NOM <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.original.nom}</div>,
    },
    {
        accessorKey: "prenom",
        header: "PRÉNOM",
        cell: ({ row }) => <div>{row.original.prenom}</div>,
    },
    {
        accessorKey: "datedenaissance",
        header: "DATE NAISS.",
        cell: ({ row }) => {
            const date = new Date(row.original.datedenaissance);
            return <span>{date.toLocaleDateString()}</span>;
        },
    },
    {
        accessorKey: "lieudenaissance",
        header: "LIEU NAISS.",
    },
    {
        accessorKey: "sexe",
        header: "SEXE",
        cell: ({ row }) => (
            <Badge className="capitalize">
                {row.original.sexe.toLowerCase()}
            </Badge>
        ),
    },
    {
        accessorKey: "numroprincipal",
        header: "TÉLÉPHONE",
    },
    // {
    //     accessorKey: "site",
    //     header: "SITE",
    // },
    {
        accessorKey: "TypeCompte",
        header: "TYPE COMPTE",
    },
    {
        accessorKey: "status_dossier",
        header: "STATUT DOSSIER",
        cell: ({ row }) => {
            const status = row.original.status_dossier ?? "NON_TRAITE"; // valeur par défaut
            const statusMap: Record<string, { label: string, color: string }> = {
                NON_TRAITE: { label: "NON TRAITÉ", color: "bg-red-100 text-gray-800" },
                VAL: { label: "VALIDÉ", color: "bg-green-100 text-green-700" },
                REJ: { label: "REJETÉ", color: "bg-red-100 text-red-700" },
                DOUBLON: { label: "DOUBLON", color: "bg-yellow-100 text-yellow-700" },
                ENCOURS: { label: "EN COURS", color: "bg-blue-100 text-blue-700" },
                DEL: { label: "SUPPRIMÉ", color: "bg-red-100 text-red-700" },
                IMAGE_INCOR: { label: "IMAGE INCORRECTE", color: "bg-orange-100 text-orange-700" },
                DOUBLON_NUMBER: { label: "DOUBLON NUMÉRO", color: "bg-yellow-100 text-yellow-800" },
            };


            const badge = statusMap[status] ?? { label: status, color: "bg-muted text-muted-foreground" };
            return <Badge className={badge.color}>{badge.label}</Badge>;
        },
    },


    // {
    //     accessorKey: "activitprincipale.nom",
    //     header: "ACTIVITÉ PRINCIPALE",
    //     cell: ({ row }) => <span>{row.original.activitprincipale?.nom ?? "—"}</span>,
    // },
    // {
    //     accessorKey: "spculationprincipale.nom",
    //     header: "SPÉCULATION",
    //     cell: ({ row }) => <span>{row.original.spculationprincipale?.nom ?? "—"}</span>,
    // },
    // {
    //     accessorKey: "superficiedevotreparcellecultu",
    //     header: "SUPERFICIE CULTIVÉE",
    //     cell: ({ row }) => <span>{row.original.superficiedevotreparcellecultu ?? 0} ha</span>,
    // },

    {
        accessorKey: "createdAt",
        header: "DATE ENRÔLEMENT",
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

    {
        accessorKey: "agent_enroleur.name",
        header: "AGENT ENRÔLEUR",
        cell: ({ row }) => <span>{row.original.agent_enroleur?.name ?? "—"}</span>,
    },

];
