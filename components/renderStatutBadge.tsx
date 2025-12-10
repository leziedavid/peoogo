// utils/renderStatutBadge.tsx
"use client";


import React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// À adapter selon ton chemin d'import

export enum StatusDossier {
    NON_TRAITE = 'NON_TRAITE',
    VAL = 'VAL',
    REJ = 'REJ',
    DOUBLON = 'DOUBLON',
    ENCOURS = 'ENCOURS',
    DEL = 'DEL',
    IMAGE_INCOR = 'IMAGE_INCOR',
    DOUBLON_NUMBER = 'DOUBLON_NUMBER',
}

export function renderStatutBadge(status?: string | null) {
    const map: Record<string, { label: string; color: string }> = {
        NON_TRAITE: { label: "NON TRAITÉ", color: "bg-gray-500" },
        VAL: { label: "VALIDÉ", color: "bg-green-500" },
        REJ: { label: "REJETÉ", color: "bg-red-500" },
        DOUBLON: { label: "DOUBLON", color: "bg-yellow-500" },
        ENCOURS: { label: "EN COURS", color: "bg-blue-500" },
        DEL: { label: "SUPPRIMÉ", color: "bg-gray-700" },
        IMAGE_INCOR: { label: "IMAGE INCORRECTE", color: "bg-pink-500" },
        DOUBLON_NUMBER: { label: "DOUBLON NUMÉRO", color: "bg-orange-500" },
    };

    const statut = map[status ?? ""] ?? { label: "INCONNU", color: "bg-gray-300" };

    return (
        <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-700">STATUT :</Label>
            <Badge className={`${statut.color} hover:${statut.color} text-white font-medium`}>
                {statut.label}
            </Badge>
        </div>
    );
}

