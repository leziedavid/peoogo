'use client';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PubliciteFormValues, publiciteSchema } from '@/types/ApiRequest/Allinterfaces';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Edit, FileText, Plus, Save, X } from 'lucide-react';
import { Publicite } from '@/types/ApiReponse/adminApi';
import { createPublicite, deletePublicite, getAllPublicites, updatePublicite } from '@/api/services/reglageServices';
import RichTextEditor from '../rich-text-editor';
import Video from '../market/Video';
import Image from "next/image";


interface PubliciteData extends PubliciteFormValues {
    id: string;
    filesUrl?: string;
}

export default function PubliciteManager() {
    const [publicites, setPublicites] = useState<Publicite[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    // Charger toutes les publicités via le service
    const fetchPublicites = async () => {
        try {
            const res = await getAllPublicites(1, 50); // pagination par défaut
            if (res.data) {
                setPublicites(res.data.data);
            } else {
                setPublicites([]);
                toast.error('Aucune publicité trouvée');
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des publicités');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPublicites();
    }, []);

    // Submit handler pour création et modification
    const onSubmitHandler = async (data: PubliciteFormValues, id?: string) => {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.smallTitle) formData.append('smallTitle', data.smallTitle);
        if (data.description) formData.append('description', data.description);
        formData.append('typeFiles', data.typeFiles);
        if (data.files && data.files.length > 0) formData.append('files', data.files[0]);

        try {
            let res;
            if (id) {
                res = await updatePublicite(id, formData);
            } else {
                res = await createPublicite(formData);
            }

            if (res.statusCode === 200 || res.statusCode === 201) {
                toast.success(res.message || (id ? 'Publicité mise à jour' : 'Publicité créée'));
                fetchPublicites();
                setEditingId(null);
                setCreating(false);
            } else {
                toast.error(res.message || 'Erreur serveur');
            }
        } catch (err) {
            toast.error('Erreur serveur, veuillez réessayer');
            console.error(err);
        }
    };

    // Nouvelle fonction pour supprimer
    const handleDeleteSlider = async (id: string) => {

        if (!confirm("Voulez-vous vraiment supprimer cette publicité ?")) return;

        try {
            const res = await deletePublicite(id);
            if (res.statusCode === 200) {
                toast.success(res.message || "publicité supprimé avec succès");
                fetchPublicites();
            } else {
                toast.error(res.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            toast.error("Erreur serveur lors de la suppression");
            console.error("Erreur delete publicité :", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#B07B5E] rounded-lg">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des Publicités</h1>
                        <p className="text-gray-500">Gérez vos campagnes publicitaires</p>
                    </div>
                </div>
                <Button onClick={() => { setCreating(true); setEditingId(null); }} className="bg-[#B07B5E] hover:bg-green-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une publicité
                </Button>
            </div>

            {creating && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
                    <PubliciteForm
                        publicite={{ id: 'new', title: '', typeFiles: 'IMAGE' }}
                        onSubmit={(data) => onSubmitHandler(data)}
                        onCancel={() => setCreating(false)}
                    />
                </div>
            )}

            <div className="space-y-4">
                {publicites.map((publicite) => (
                    <div key={publicite.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 space-y-4">

                            {/* Boutons Modifier & Supprimer collés */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingId(editingId === publicite.id ? null : publicite.id)}
                                    className="flex items-center gap-2"
                                >
                                    {editingId === publicite.id ? (
                                        <>
                                            <X className="h-4 w-4" /> Annuler
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="h-4 w-4" /> Modifier
                                        </>
                                    )}
                                </Button>

                                <Button variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteSlider(publicite.id)}
                                    className="flex items-center gap-2" >
                                    <X className="h-4 w-4" /> Supprimer
                                </Button>
                            </div>

                            {/* Infos en haut */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{publicite.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${publicite.typeFiles === 'IMAGE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                        {publicite.typeFiles}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-gray-500">Description:</span>
                                    <p className="font-medium mt-1 bg-[#B07B5E]/50">
                                        {publicite.description ? ( <span dangerouslySetInnerHTML={{ __html: publicite.description }} /> ) : 'Non défini'}
                                    </p>
                                </div>

                                {publicite.smallTitle && <p className="text-sm text-gray-400">{publicite.smallTitle}</p>}
                            </div>

                            {/* IMAGE ou VIDEO en bas */}
                            <div className="mt-2">
                                {publicite.typeFiles === 'IMAGE' && publicite.files && (
                                    <Image src={publicite.files} alt="Photo utilisateur" className="w-full max-h-64 object-cover rounded-lg border border-gray-200" width={30} height={30} unoptimized />
                                    // <img src={publicite.files} alt={publicite.title} className="w-full max-h-64 object-cover rounded-lg border border-gray-200" />
                                )}
                                {publicite.typeFiles === 'VIDEO' && publicite.files && (
                                    <Video src={publicite.files} className="w-full max-h-64 rounded-lg border border-gray-200" />
                                )}
                            </div>

                            {editingId === publicite.id && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <PubliciteForm  publicite={publicite} onSubmit={(data) => onSubmitHandler(data, publicite.id)} onCancel={() => setEditingId(null)} />
                                </div>
                            )}

                        </div>
                    </div>
                ))}

            </div>


        </div>
    );
}

function PubliciteForm({ publicite, onSubmit, onCancel }: { publicite: PubliciteData; onSubmit: (data: PubliciteFormValues) => void; onCancel: () => void; }) {

    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<PubliciteFormValues>({
        resolver: zodResolver(publiciteSchema),
        defaultValues: {
            title: publicite.title,
            smallTitle: publicite.smallTitle,
            description: publicite.description || "", // Important pour RichTextEditor
            typeFiles: publicite.typeFiles || 'IMAGE',
            files: undefined,
        },
    });

    const file = watch('files');
    const typeFiles = watch('typeFiles');

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                    <Input {...register('title')} placeholder="Titre" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Petit titre (optionnel)</label>
                    <Input {...register('smallTitle')} placeholder="Petit titre (optionnel)" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (optionnel)</label>
                    <Controller name="description" control={control} render={({ field }) => ( <RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />  )} />
                    {errors.description && ( <p className="text-red-500 text-sm">{errors.description.message}</p> )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de fichier</label>
                    <Select value={typeFiles} onValueChange={(val) => setValue('typeFiles', val as 'IMAGE' | 'VIDEO')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Type de fichier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IMAGE">IMAGE</SelectItem>
                            <SelectItem value="VIDEO">VIDEO</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fichier {typeFiles}</label>
                    {publicite.filesUrl && !file && (
                        typeFiles === 'IMAGE' ? (
                            <Image src={publicite.filesUrl} alt="Photo utilisateur" className="h-16 w-16 object-cover rounded-lg mb-2 border border-gray-200" width={30} height={30} unoptimized />
                            // <img src={publicite.filesUrl} className="h-16 w-16 object-cover rounded-lg mb-2 border border-gray-200" />
                        ) : (
                            <video src={publicite.filesUrl} className="h-24 w-40 mb-2 rounded-lg" controls />
                        )
                    )}
                    <input type="file" {...register('files')} accept={typeFiles === 'IMAGE' ? 'image/*' : 'video/*'} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}> Annuler </Button>
                <Button type="submit" className="bg-[#B07B5E] hover:bg-green-700"> <Save className="h-4 w-4 mr-2" /> Sauvegarder </Button>
            </div>
        </form>

    );
}
