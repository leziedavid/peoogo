
"use client";


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserFormSchema, UserFormValues, Role, TypeCompte, UserStatus } from '@/types/ApiRequest/User';
import { toast } from 'sonner';
import {User, Lock,Phone, Camera, EyeOff, Eye } from "lucide-react"
import { signUp } from '@/api/services/auth';
import { useRouter } from 'next/navigation'
import { FileUploader } from '../upload/FileUploader1';
interface UsersFormsProps {
    initialValue?: Partial<UserFormValues>;
    roleIsDisable?: boolean;
    typeCompteIsDisable?: boolean;
}

interface Option {
    id: string;  // id en string uniquement
    nom: string;
}

export default function UsersForms({ initialValue, roleIsDisable = false, typeCompteIsDisable = false, }: UsersFormsProps) {

    const [showPassword, setShowPassword] = useState(false);
    const [files, setFiles] = useState<Record<string, File[]>>({});
    const [progresses, setProgresses] = useState<Record<string, Record<string, number>>>({});
    const router = useRouter();

    // Valeurs par défaut forcées si disable
    const defaultValues: Partial<UserFormValues> = {
        ...initialValue,
        ...(roleIsDisable ? { role: Role.USER } : {}),
        ...(typeCompteIsDisable ? { typeCompte: TypeCompte.ACHETEUR } : {}),
    };

    // useForm avec validation "mode: all" pour valider à chaque changement
    const form = useForm<UserFormValues>({
        resolver: zodResolver(UserFormSchema),
        defaultValues,
        mode: 'all',
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
    } = form;

    // const roleOptions: Option[] = Object.values(Role).map(r => ({ id: String(r), nom: r }));
    // const typeCompteOptions: Option[] = Object.values(TypeCompte).map(t => ({ id: String(t), nom: t }));
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
            const res = await signUp(formData);

            if (res.statusCode === 201) {
                toast.success("Compte créé avec succès");
                router.push('/auth/login');

            } else {
                toast.error("Erreur lors de la création du compte");
            }
        } catch (error) {
            console.error("Erreur lors de la requête signUp:", error);
            toast.error("Erreur réseau ou serveur");
        }
    };



    const formDisabled = !isValid;

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

            <div>
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
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input className="w-full py-2 pl-12 pr-12 text-base rounded-md border border-gray-300 outline-none focus:border-orange-600 focus:ring-0 bg-white placeholder-gray-400" placeholder="Email" type="email" {...register('email')} />
                </div>
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
            {/* Mot de passe */}
            <div>
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

            {/* Numéro de téléphone */}
            <div>
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

            <Button type="submit" disabled={formDisabled} className="w-full bg-[#B07B5E] hover:bg-[#045d28] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200" >
                {initialValue ? 'Mettre à jour le compte' : 'Créer le compte'}
            </Button>
        </form>
    );
}