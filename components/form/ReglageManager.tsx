'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReglageFormValues, reglageSchema } from '@/types/ApiRequest/Allinterfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Edit, Plus, Save, Settings, X } from 'lucide-react';
import { createReglage, deleteReglage, getAllReglages, updateReglage } from '@/api/services/reglageServices';
import RichTextEditor from '../rich-text-editor';
import Image from "next/image";


interface ReglageData extends ReglageFormValues {
    id: string;
    headerLogo?: string;
    footerLogo?: string;
}

export default function ReglageManager() {

    const [reglages, setReglages] = useState<ReglageData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const fetchReglages = async () => {
        try {
            const res = await getAllReglages(currentPage, limit);
            if (res.data) {
                setReglages(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des réglages');
        }
    };

    useEffect(() => {
        fetchReglages();
    }, [currentPage]);

    const onSubmitHandler = async (data: ReglageFormValues, id?: string) => {
        const formData = new FormData();

        // Champs texte
        Object.entries(data).forEach(([key, value]) => {
            if (value && key !== 'headerLogo' && key !== 'footerLogo') {
                formData.append(key, value);
            }
        });

        // Fichiers optionnels
        if (data.headerLogo && data.headerLogo.length > 0) {
            formData.append('headerLogo', data.headerLogo[0]);
        }
        if (data.footerLogo && data.footerLogo.length > 0) {
            formData.append('footerLogo', data.footerLogo[0]);
        }

        try {
            let res;
            if (id) {
                res = await updateReglage(id, formData);
            } else {
                res = await createReglage(formData);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (id ? 'Réglage mis à jour' : 'Réglage créé'));
                fetchReglages();
                setEditingId(null);
                setCreating(false);
            } else {
                toast.error(res.message || 'Erreur serveur');
            }
        } catch (error) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error('Erreur lors du submit réglage :', error);
        }
    };

    // Nouvelle fonction pour supprimer
    const handleDeleteSlider = async (sliderId: string) => {

        if (!confirm("Voulez-vous vraiment supprimer ce slider ?")) return;

        try {
            const res = await deleteReglage(sliderId);
            if (res.statusCode === 200) {
                toast.success(res.message || "Slider supprimé avec succès");
                fetchReglages();
            } else {
                toast.error(res.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            toast.error("Erreur serveur lors de la suppression");
            console.error("Erreur delete slider :", error);
        }
    };

    function handleNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            alert("Vous êtes déjà sur la dernière page.");
        }
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            alert("Vous êtes déjà sur la première page.");
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B07B5E] rounded-lg">
                        <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Réglages du site</h1>
                        <p className="text-gray-500">Configurez les paramètres généraux</p>
                    </div>
                </div>
                <Button onClick={() => { setCreating(true); setEditingId(null); }} className="bg-[#B07B5E] hover:bg-green-800" >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau réglage
                </Button>
            </div>

            {creating && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
                    <ReglageForm
                        reglage={{ id: 'new', footerDescription: '', assistanceLine: '', emplacement: '', email: '' }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-4">

                {reglages.map((reglage) => (

                    <div key={reglage.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden" >
                        <div className="p-6 space-y-4">
                            {/* Titre + Infos principales */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Configuration Générale
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Email:</span>
                                        <p className="font-medium">{reglage.email || "Non défini"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Assistance:</span>
                                        <p className="font-medium">{reglage.assistanceLine || "Non défini"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Emplacement:</span>
                                        <p className="font-medium">{reglage.emplacement || "Non défini"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description en bas */}
                            <div>
                                <span className="text-gray-500">Description:</span>
                                <p className="font-medium mt-1">
                                    {reglage.footerDescription ? (
                                        <span
                                            dangerouslySetInnerHTML={{ __html: reglage.footerDescription }}
                                        />
                                    ) : (
                                        "Non défini"
                                    )}
                                </p>
                            </div>

                            {/* Boutons Modifier & Supprimer */}
                            <div className="flex items-center gap-3">

                                <Button variant="outline" size="sm"
                                    onClick={() =>
                                        setEditingId(editingId === reglage.id ? null : reglage.id)
                                    }
                                    className="flex items-center gap-2" >
                                    {editingId === reglage.id ? (
                                        <>
                                            <X className="h-4 w-4" />
                                            Annuler
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="h-4 w-4" />
                                            Modifier
                                        </>
                                    )}
                                </Button>

                                <Button variant="destructive" size="sm" onClick={() => handleDeleteSlider(reglage.id)} className="flex items-center gap-2" >
                                    <X className="h-4 w-4" />
                                    Supprimer
                                </Button>
                            </div>

                            {/* Formulaire si en édition */}
                            {editingId === reglage.id && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <ReglageForm
                                        reglage={reglage}
                                        onSubmit={(data) => onSubmitHandler(data, reglage.id)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}



                {reglages.length > 0 && (

                    <div className="flex flex-col items-center justify-center space-y-2 py-4">
                        <div className="text-muted-foreground text-xs sm:text-sm text-center">
                            Page {currentPage} sur {Math.ceil(totalItems / limit)}
                        </div>

                        <div className="flex justify-center space-x-2">
                            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage <= 1} className="text-xs sm:text-sm" >
                                <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Précédent</span>
                            </Button>

                            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalItems / limit)} className="text-xs sm:text-sm">
                                <span className="hidden sm:inline">Suivant</span>
                                <ChevronRight className="h-4 w-4 sm:ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

}

function ReglageForm({ reglage, onSubmit, onCancel }: {
    reglage: ReglageData;
    onSubmit: (data: ReglageFormValues) => void;
    onCancel: () => void;
}) {
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm<ReglageFormValues>({
        resolver: zodResolver(reglageSchema),
        defaultValues: {
            footerDescription: reglage.footerDescription,
            assistanceLine: reglage.assistanceLine,
            emplacement: reglage.emplacement,
            email: reglage.email,
            fbUrl: reglage.fbUrl,
            linkedinUrl: reglage.linkedinUrl,
            xUrl: reglage.xUrl,
            headerLogo: undefined,
            footerLogo: undefined,
        },
    });

    const headerFile = watch('headerLogo');
    const footerFile = watch('footerLogo');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {/* ✅ RichTextEditor à la place de Textarea */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description du footer</label>
                    <Controller
                        name="footerDescription"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                content={field.value || ""}
                                onChange={field.onChange}
                                editable={true}
                            />
                        )}
                    />
                    {errors.footerDescription && (
                        <p className="text-red-500 text-sm">{errors.footerDescription.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ligne d'assistance</label>
                    <Input {...register('assistanceLine')} placeholder="Ligne d'assistance" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emplacement</label>
                    <Input {...register('emplacement')} placeholder="Emplacement" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input {...register('email')} placeholder="Email" type="email" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Facebook</label>
                    <Input {...register('fbUrl')} placeholder="URL Facebook" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL LinkedIn</label>
                    <Input {...register('linkedinUrl')} placeholder="URL LinkedIn" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL X</label>
                    <Input {...register('xUrl')} placeholder="URL X" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Header Logo</label>
                        {reglage.headerLogo && !headerFile && (
                            <Image src={reglage.headerLogo} alt="Logo" width={30} height={30} className="h-16 w-16 object-cover rounded-lg mb-2 border border-gray-200" unoptimized />
                        )}
                        <input type="file" {...register('headerLogo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#B07B5E]-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo</label>
                        {reglage.footerLogo && !footerFile && (
                            <Image src={reglage.footerLogo} alt="Logo" width={30} height={30} className="h-16 w-16 object-cover rounded-lg mb-2 border border-gray-200" unoptimized />
                        )}
                        <input
                            type="file"
                            {...register('footerLogo')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#B07B5E]-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="submit" className="bg-[#B07B5E] hover:bg-green-800">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                </Button>
            </div>
        </form>
    );
}
