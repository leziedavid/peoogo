
"use client";

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserFormSchema, UserFormValues, Role, TypeCompte, UserStatus } from '@/types/ApiRequest/User';
import { toast } from 'sonner';
import { SelectWithSearch } from '../select/SelectWithSearch';
import { Label } from '../ui/label';
import {User, Lock,Phone, Camera,EyeOff, Eye, X } from "lucide-react"
import { FileUploader } from '../upload/FileUploader';
import { signUp, updateUser } from '@/api/services/auth';


interface AddUsersFormsProps {
    initialValue?: Partial<UserFormValues>;
    roleIsDisable?: boolean;
    typeCompteIsDisable?: boolean;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

interface Option {
    id: string;  // id en string uniquement
    nom: string;
}

export default function AddUsersForms({ initialValue, roleIsDisable = false, typeCompteIsDisable = false, isOpen, onClose, fetchData }: AddUsersFormsProps) {

    const [showPassword, setShowPassword] = useState(false);
        const [files, setFiles] = useState<Record<string, File[]>>({});
        const [progresses, setProgresses] = useState<Record<string, Record<string, number>>>({});

    // Valeurs par défaut forcées si disable
    const defaultValues: Partial<UserFormValues> = {
        ...initialValue,
        ...(roleIsDisable ? { role: Role.USER } : {}),
        ...(typeCompteIsDisable ? { typeCompte: TypeCompte.ACHETEUR } : {}),
    };

    // useForm avec validation "mode: all" pour valider à chaque changement
    const form = useForm<UserFormValues>({ resolver: zodResolver(UserFormSchema), defaultValues, mode: 'all',});

    const {register,control,handleSubmit, formState: { errors, isValid }, setValue,} = form;

    const { reset } = form;
    useEffect(() => {
        if (initialValue) {
            reset({
                ...initialValue,
                role: initialValue.role ?? Role.USER,
                typeCompte: initialValue.typeCompte ?? TypeCompte.ACHETEUR,
            });
        }
    }, [initialValue, reset]);

    const roleOptions: Option[] = Object.values(Role).map(r => ({ id: String(r), nom: r }));
    const typeCompteOptions: Option[] = Object.values(TypeCompte).map(t => ({ id: String(t), nom: t }));
    // const statusOptions: Option[] = Object.values(UserStatus).map(s => ({ id: String(s), nom: s }));

    // Handle fichiers upload
    const handleValueChange = (name: string, fileList: File[]) => {
        setFiles((prev) => ({ ...prev, [name]: fileList }));
        setValue(name as any, fileList[0] ?? null, { shouldValidate: true });
    };

    const handleUpload = async (name: string, files: File[]) => {
        const fileProgress: Record<string, number> = {};
        for (const file of files) {
            fileProgress[file.name] = 0;
            setProgresses((prev) => ({
                ...prev,
                [name]: { ...(prev[name] || {}), ...fileProgress },
            }));
            await new Promise((res) => setTimeout(res, 300));
            fileProgress[file.name] = 100;
            setProgresses((prev) => ({
                ...prev,
                [name]: { ...(prev[name] || {}), ...fileProgress },
            }));
        }
    };

    // Fonction exécutée lors de la soumission du formulaire
    const onSubmit = async (values: UserFormValues) => {

        const formData = new FormData(); // Pour envoyer texte + fichiers
        const excludedKeys = ['file'];

        // Valeurs par défaut si undefined
        if (values.role === undefined) {
            values.role = Role.USER;
        }
        if (values.typeCompte === undefined) {
            values.typeCompte = TypeCompte.ACHETEUR;
        }

        // Validation mot de passe obligatoire seulement à la création (pas si initialValue.id existe)
        if ((values.password === undefined || values.password === "") && !initialValue?.id) {
            toast.error("Le mot de passe est obligatoire");
            return;
        }

        // Ajout des champs texte dans formData, sauf ceux exclus
        Object.entries(values).forEach(([key, value]) => {
            if (excludedKeys.includes(key)) return; // skip les clés exclues

            if (value !== undefined && value !== null) {
                formData.append(key, String(value)); // forcer en string car FormData attend string ou Blob
            }
        });

        // Ajout du fichier si présent
        if (values.file) {
            formData.append('file', values.file);
        }

        // Debug: afficher le contenu du FormData
        console.log('FormData contents:');
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        try {

            if (!initialValue?.id) {
                const res = await signUp(formData);

                if (res.statusCode === 201) {
                    toast.success("Compte créé avec succès");
                    fetchData();
                    onClose();
                } else {
                    toast.error("Erreur lors de la création du compte");
                }
            } else {

                const res = await updateUser(initialValue.id, formData);

                if (res.statusCode === 200) {
                    toast.success("Compte mis à jour avec succès");
                    fetchData();
                    onClose();
                } else {
                    toast.error("Erreur lors de la mise à jour du compte");
                }
            }

        } catch (error) {
            toast.error("Erreur réseau ou serveur");
        }
    };

    return (


        <div className="fixed inset-0 bg-black/50 z-50">
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform ${isOpen ? 'translate-x-0 w-full md:w-[50vw] shadow-xl' : 'translate-x-full w-100'} bg-white`}>
                <h2 className="text-xl font-bold mb-4">{initialValue?.id ? "Modifier l'utilisateur" : "Créer un utilisateur"}</h2>
                <Button onClick={onClose} className="absolute top-2.5 end-2.5 bg-red-500 text-white rounded-full w-8 h-8">
                    <X className="w-4 h-4" />
                </Button>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

                    <div>
                        <Label htmlFor="email mb-4">Nom & Prénom</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mb-2">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input className="w-full py-2 pl-12 pr-12 text-base rounded-md border border-gray-300 outline-none focus:border-orange-600 focus:ring-0 bg-white placeholder-gray-400" placeholder="Nom complet" {...register('name')}
                            />
                        </div>
                        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email mb-4"> Email </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input className="w-full py-2 pl-12 pr-12 text-base rounded-md border border-gray-300 outline-none focus:border-orange-600 focus:ring-0 bg-white placeholder-gray-400" placeholder="Email" type="email" {...register('email')} />
                        </div>
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                    </div>

                    {!initialValue?.id && (
                        <>
                            {/* Mot de passe */}
                            <div>
                                <Label htmlFor="password" className="mb-2 block text-lg font-medium"> Mot de passe </Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className="w-full py-2 pl-12 pr-12 text-base rounded-md border border-gray-300 outline-none focus:border-orange-600 focus:ring-0 bg-white placeholder-gray-400"
                                        placeholder="Mot de passe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>

                            {/* Confirmation mot de passe */}
                            <div>
                                <Label htmlFor="confirmPassword" className="mb-2 block text-lg font-medium">
                                    Confirmer le mot de passe
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        className="w-full py-2 pl-12 pr-12 text-base rounded-md border border-gray-300 outline-none focus:border-orange-600 focus:ring-0 bg-white placeholder-gray-400"
                                        placeholder="Confirmez le mot de passe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Sélecteur Rôle */}
                    <div>
                        <Label className="block mb-1 font-semibold">Rôle</Label>
                        <Controller
                            control={control}
                            name="role"
                            render={({ field }) => (
                                <SelectWithSearch
                                    options={roleOptions}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="Sélectionnez un rôle"
                                    disabled={roleIsDisable}
                                />
                            )}
                        />
                        {errors.role && <p className="text-red-600">{errors.role.message}</p>}
                    </div>

                    {/* Sélecteur Type de compte */}
                    <div>
                        <Label className="block mb-1 font-semibold">Type de compte</Label>
                        <Controller
                            control={control}
                            name="typeCompte"
                            render={({ field }) => (
                                <SelectWithSearch
                                    options={typeCompteOptions}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="Sélectionnez un type de compte"
                                    disabled={typeCompteIsDisable}
                                />
                            )}
                        />
                        {errors.typeCompte && <p className="text-red-600">{errors.typeCompte.message}</p>}
                    </div>

                    {/* Numéro de téléphone */}

                    <div>
                        <Label htmlFor="email mb-4"> Numéro de téléphone </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input className="w-full py-2 pl-12 pr-12 text-base rounded-md border border-gray-300 outline-none focus:border-orange-600 focus:ring-0 bg-white placeholder-gray-400" placeholder="Numéro de téléphone"  {...register('phoneNumber')} />
                        </div>
                        {errors.phoneNumber && <p className="text-red-600">{errors.phoneNumber.message}</p>}
                    </div>

                    {/* Upload fichiers */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Camera className="h-5 w-5 text-gray-600" />
                            <h3 className="font-semibold">Photo</h3>
                        </div>
                        <FileUploader name="file" multiple={false} value={files} onValueChange={handleValueChange} onUpload={handleUpload} progresses={progresses} />
                        {errors.file && (
                            <p className="text-sm text-red-500">{String(errors.file.message)}</p>
                        )}
                    </div>
                    {/* disabled={formDisabled}  */}
                    <Button type="submit" className="w-full bg-[#B07B5E] hover:bg-[#045d28] text-white font-semibold py-3 px-8 rounded-sm transition-colors duration-200" >
                        {initialValue ? 'Mettre à jour le compte' : 'Créer le compte'}
                    </Button>

                </form>

            </div>
        </div>
    );
}