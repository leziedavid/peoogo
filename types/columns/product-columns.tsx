
'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '../ApiReponse/ProduitsResponse';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PeriodeDisponibiliteCell } from './PeriodeDisponibiliteCell';
import { QuantiteCell } from './QuantiteCell';
import { updateProductStatus } from '@/api/services/productServices';
import { toast } from 'sonner';


function calculerStatutProduit(disponibleDe: string, disponibleJusqua: string): 'disponible' | 'indisponible' {
    const maintenant = new Date();
    const debut = new Date(disponibleDe);
    const fin = new Date(disponibleJusqua);

    return maintenant >= debut && maintenant <= fin ? 'disponible' : 'indisponible';
}


// 📦 API de mise à jour du status (à adapter selon ton service réel)
const ProductStatusSwitchUpdate = async (id: string, newStatus: 'ACTIVE' | 'INACTIVE') => {

    try {
        const response = await updateProductStatus(id, newStatus);
        if (response.statusCode === 200) {
            toast.success('Statut mis à jour avec succès');
        }
        console.log(`Produit ${id} mis à jour vers le statut : ${newStatus}`);
        // await tonService.updateStatus(id, newStatus);
    } catch (error) {
        toast.error('Erreur de mise à jour du statut');
        console.error('Erreur de mise à jour du statut', error);
    }
};

// ✅ Switch personnalisé pour le statut actif/inactif
const ProductStatusSwitch: React.FC<{ row: any }> = ({ row }) => {
    const id = row.original.id;
    const currentStatus = row.original.status; // ACTIVE, INACTIVE, BLOCKED

    const [checked, setChecked] = useState(currentStatus === 'ACTIVE');

    const handleToggle = async (value: boolean) => {
        setChecked(value);
        const newStatus = value ? 'ACTIVE' : 'INACTIVE';
        await ProductStatusSwitchUpdate(id, newStatus);
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch checked={checked} onCheckedChange={handleToggle} id={`statut-${id}`} />
            <Label htmlFor={`statut-${id}`} className="text-xs">
                {checked ? "Publié" : "En attente"}
            </Label>
        </div>
    );
};

export const columns: ColumnDef<Product>[] = [

    {
        accessorKey: 'imageUrl',
        header: 'Image',
        cell: ({ row }) => {
            const imageUrl = row.original.imageUrl || '/products.jpg';
            return (
                <div className="relative w-20 h-20">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Produit"
                            className="object-cover w-full h-full rounded-lg"
                            width={100}
                            height={100}
                            unoptimized // ⚡ Permet de charger toutes les images sans restriction de domaine
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                            No image
                        </div>
                    )}
                </div>
            );
        }
    },
    // nom du producteur et code

    {
        header: 'Nom du producteur',
        cell: ({ row }) => {
            const d = row.original.userInfo;
            return (
                <div className="text-sm leading-tight space-y-1">
                    <div> <strong>Nom :</strong> {d.name}</div>
                    <div> <strong>code :</strong> {d.code} </div>
                    <div> <strong>Téléphone :</strong> {d.phoneNumber} </div>
                </div>
            );
        }
    },
    {
        accessorKey: 'categories',
        header: 'Catégorie',
        cell: ({ row }) => {
            const d = row.original.categories;
            return (
                <div className="text-sm leading-tight space-y-1">
                    {d.map((categorie, index) => (
                        <div key={index}>
                            <strong>{categorie.nom}</strong>
                        </div>
                    ))}
                </div>
            );
        }
    },

    {
        accessorKey: 'nom',
        header: 'Nom du produit',
    },
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => <span className="uppercase">{row.getValue('code')}</span>
    },
    {
        header: 'Période de disponibilité',
        cell: ({ row }) => <PeriodeDisponibiliteCell row={row} />
    }
    ,
    {
        accessorKey: 'quantite',
        header: 'Quantité',
        cell: ({ row }) => <QuantiteCell row={row} />
    },
    {
        accessorKey: 'prixUnitaire',
        header: 'Prix unitaire',
        cell: ({ row }) => <>{row.getValue('prixUnitaire')} FCFA</>
    },
    {
        accessorKey: 'disponibleJusqua',
        header: "Date d'expiration",
        cell: ({ row }) => formatDate(row.getValue('disponibleJusqua'))
    },

    {
        header: 'Découpage',
        cell: ({ row }) => {
            const d = row.original.decoupage;
            return (
                <div className="text-sm leading-tight space-y-1">
                    <div><strong>District:</strong> {d.district?.nom}</div>
                    <div><strong>Région:</strong> {d.region?.nom}</div>
                    <div><strong>Département:</strong> {d.department?.nom}</div>
                    <div><strong>Sous-préfecture:</strong> {d.sousPrefecture?.nom}</div>
                    <div><strong>Localité:</strong> {d.localite?.nom}</div>
                </div>
            );
        }
    },
    {
        header: 'Statut',
        cell: ({ row }) => {
            const disponibleDe = row.original.disponibleDe;
            const disponibleJusqua = row.original.disponibleJusqua;
            const statut = calculerStatutProduit(disponibleDe, disponibleJusqua);

            const variant =
                statut === 'disponible' ? 'default' : 'destructive';

            return <Badge variant={variant}>{statut}</Badge>;
        }
    },

    {
        id: 'switch-status',
        header: 'Status',
        cell: ({ row }) => <ProductStatusSwitch row={row} />
    },

    {
        accessorKey: 'createdAt',
        header: 'Date de création',
        cell: ({ row }) => formatDate(row.getValue('createdAt'))
    }
];

// 📅 Formatage de date
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}
