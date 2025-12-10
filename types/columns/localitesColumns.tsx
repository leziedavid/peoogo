import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // ou le toast que tu utilises
import { useState } from "react";
import { LocaliteResponse } from "../ApiReponse/ListeResponse";


export const columns: ColumnDef<LocaliteResponse>[] = [
    {
        accessorKey: "nom",
        header: "Nom de la localité",
    },
    {
        accessorKey: "sousPrefecture.nom",
        header: "Sous-préfecture",
        cell: ({ row }) => row.original.sousPrefecture?.nom ?? "-",
    },
    {
        id: "statut",
        header: "STATUT",
        cell: ({ row }) => {
            const id = row.original.id;
            const currentStatus = row.original.statut;
            const [checked, setChecked] = useState(
                currentStatus === null || currentStatus === true
            );
            const [loading, setLoading] = useState(false);

            const handleToggle = async (value: boolean) => {
                setLoading(true);
                try {
                    const newStatus = value; // boolean attendu par l'API
                    // await validateDistrict(id, newStatus);
                    setChecked(value);
                    toast.success(`District ${row.original.nom} ${value ? "activé" : "désactivé"}.`);
                } catch (error) {
                    setChecked(!value);
                    toast.error("Erreur lors de la mise à jour du statut du district.");
                } finally {
                    setLoading(false);
                }
            };

            return (
                <div className="flex items-center space-x-2">
                    <Switch checked={checked} disabled={loading} onCheckedChange={handleToggle} id={`district-status-${id}`} />
                    <Label htmlFor={`district-status-${id}`} className="text-xs">
                        {/* {checked ? "Actif" : "Inactif"} */}
                    </Label>
                </div>
            );
        },
    },
];
