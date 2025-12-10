"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import { User } from "../ApiReponse/UsersResponse";
import { useState } from "react";
import { validateCompte } from "@/api/services/auth";


// Fonction pour détecter les images
function isImage(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    try {
        const extension = url.split('.').pop()?.toLowerCase();
        return !!extension && imageExtensions.includes(extension);
    } catch {
        return false;
    }
}

// Cette fonction reçoit la callback onPreview depuis le parent
export function getUserColumns(onPreview: (url: string, isImage: boolean) => void): ColumnDef<User>[] {
    return [
        {
            accessorKey: "photo",
            header: "PHOTO",
            cell: ({ row }) => {
                const image = row.original.photo;
                return image ? (
                    <div className="w-15 h-15 relative rounded-full overflow-hidden cursor-pointer" onClick={() => onPreview(image, true)} >
                        <Image src={image} alt="Photo utilisateur" fill sizes="49px" className="object-cover rounded-full" unoptimized />
                    </div>
                ) : (
                    <Badge className="bg-gray-100 text-gray-600">Pas de photo</Badge>
                );
            },
        },
        {
            accessorKey: "fullName",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    NOM COMPLET <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
        },
        {
            accessorKey: "email",
            header: "EMAIL",
            cell: ({ row }) => <div>{row.original.email}</div>,
        },
        {
            accessorKey: "phone",
            header: "TÉLÉPHONE",
            cell: ({ row }) => <div>{row.original.phoneNumber}</div>,
        },
        // code
        {
            accessorKey: "code",
            header: "CODE",
            cell: ({ row }) => <div>{row.original.codeGenerate}</div>,
        }
        ,
        {
            accessorKey: "status",
            header: "STATUT",
            cell: ({ row }) => {
                const status = row.original.status;
                const statusColor = status === "ACTIVE" ? "bg-green-100 text-green-700" : status === "INACTIVE" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700";
                return <Badge className={statusColor}>{status}</Badge>;
            },
        },
        {
            id: "status-toggle",
            header: "ACTIVATION",
            cell: ({ row }) => {
                const id = row.original.id;
                const currentStatus = row.original.status;

                const [checked, setChecked] = useState(currentStatus === "ACTIVE");
                const [loading, setLoading] = useState(false);

                const isBlocked = currentStatus === "BLOCKED";

                const handleToggle = async (value: boolean) => {
                    setLoading(true);
                    try {
                        // Mapping du nouveau statut
                        const newStatus = value ? "ACTIVE" : "INACTIVE";

                        // ✅ Appel API pour valider le compte
                        await validateCompte(id, newStatus);

                        setChecked(value);
                        toast.success(`Utilisateur ${row.original.name} ${value ? "activé" : "désactivé"}.`);
                    } catch (error) {
                        setChecked(!value);
                        toast.error("Erreur lors de la mise à jour du statut.");
                    } finally {
                        setLoading(false);
                    }
                };

                return (
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={checked}
                            disabled={loading || isBlocked}
                            onCheckedChange={handleToggle}
                            id={`status-${id}`}
                        />
                        <Label htmlFor={`status-${id}`} className="text-xs">
                            {isBlocked ? "Bloqué" : checked ? "Actif" : "Inactif"}
                        </Label>
                    </div>
                );
            },
        },

        {
            accessorKey: "walletBalance",
            header: "SOLDE",
            cell: ({ row }) => {
                const balance = row.original.wallet?.balance ?? 0;
                return <div>{balance.toLocaleString()} FCFA</div>;
            },
        },
        {
            accessorKey: "document1",
            header: "CNI RECTO",
            cell: ({ row }) => {
                const document1 = row.original.document1;
                return document1 ? (
                    <Button  variant="link" onClick={() => onPreview(document1, isImage(document1))}
                        className="p-0 h-auto text-blue-600 hover:underline" >
                        Voir la carte
                    </Button>
                ) : (
                    <Badge className="bg-gray-100 text-gray-600">Non dispo</Badge>
                );
            },
        },
        {
            accessorKey: "document2",
            header: "CNI VERSO  ",
            cell: ({ row }) => {
                const document2 = row.original.document2;
                return document2 ? (
                    <Button
                        variant="link"
                        onClick={() => onPreview(document2, isImage(document2))}
                        className="p-0 h-auto text-blue-600 hover:underline"
                    >
                        Voir le permis
                    </Button>
                ) : (
                    <Badge className="bg-gray-100 text-gray-600">Non dispo</Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "INSCRIPTION",
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
}
