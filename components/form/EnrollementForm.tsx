'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler, } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CreditCard, FileText, Loader2, MapPin } from 'lucide-react';
import { EnrollementRequest, TypeCompte } from '@/types/ApiRequest/EnrollementRequest';
import { ActiviteResponse, SpeculationsResponse } from '@/types/ApiReponse/ListeResponse';
import { createEnrollement, getAllActivite, getAllEnrollements, getAllSpeculations, updateEnrollement } from '@/api/services/enrollementsServices';
import { toast } from 'sonner';
import { SelectWithSearch } from '../select/SelectWithSearch';
import SelectDecoupage from '../filter/SelectDecoupage';
import { SelectMultipleWithSearch } from '../filter/SelectMultipleWithSearch';
import { FileUploader } from "../upload/FileUploader1";
import { NotificationModal } from '../Dialog/NotificationModal';
import SelectWithSearchEnrollment from '../select/SelectWithSearchEnrollment';


// --- Key localStorage ---
const LOCALSTORAGE_DECOUPAGE_KEY = 'enrollement_decoupage';

// --- Main component ---
interface Props {
    initialValues?: Partial<EnrollementRequest>;
    setActiveTab: (tab: string) => void;
}

export default function EnrollementForm({ initialValues, setActiveTab }: Props) {

    const { register, control, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<EnrollementRequest>({
        mode: "onChange", // valide à chaque changement
        defaultValues: {
            ...initialValues,
            decoupage: {
                districtId: '',
                regionId: '',
                departmentId: '',
                sousPrefectureId: '',
                localiteId: '',
                ...initialValues?.decoupage,
            },
        },
    });

    const [files, setFiles] = useState<Record<string, File[]>>({});
    const [activite, setActivite] = useState<ActiviteResponse[]>([]);
    const [speculations, setSpeculations] = useState<SpeculationsResponse[]>([]);
    const [progresses, setProgresses] = useState<Record<string, Record<string, number>>>({});
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<string>("");
    const [statusCode, setStatusCode] = useState<number | null>(null);

    const [decoupage, setDecoupage] = useState({
        districtId: '',
        regionId: '',
        departmentId: '',
        sousPrefectureId: '',
        localiteId: ''
    });
    // --- état pour loader
    const [isSubmitting, setIsSubmitting] = useState(false);

    // État pour activer/désactiver le bouton submit
    const [canSubmit, setCanSubmit] = useState(false);
    // Fonction qui vérifie si un découpage est "valide" (= au moins un champ non vide)
    const hasValidDecoupage = (dec: typeof decoupage) => {
        return Object.values(dec).some(v => v && v.length > 0);
    };
    // Au montage, on vérifie le localStorage
    useEffect(() => {
        const storedRaw = localStorage.getItem(LOCALSTORAGE_DECOUPAGE_KEY);
        if (storedRaw) {
            try {
                const stored = JSON.parse(storedRaw);
                if (hasValidDecoupage(stored)) {
                    setCanSubmit(true);
                    setDecoupage(stored);
                    return;
                }
            } catch {
                // ignore JSON parse error
            }
        }
        // Sinon pas de découpage valide au départ => bouton désactivé
        setCanSubmit(false);
    }, []);

    // À chaque changement utilisateur, on met à jour canSubmit
    useEffect(() => {
        if (hasValidDecoupage(decoupage)) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [decoupage]);

    // Fonction pour obtenir les coordonnées géographiques automatiquement
    const getGeolocationAuto = (): Promise<{ latitude: number; longitude: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.log('❌ Géolocalisation non supportée');
                reject(new Error('Géolocalisation non supportée'));
                return;
            }

            const options = {
                enableHighAccuracy: true, // Utilise le GPS si disponible
                timeout: 5000, // Timeout réduit à 5 secondes pour plus de réactivité
                maximumAge: 60000 // Cache pendant 1 minute seulement
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    // On ne fait que logger l'erreur, pas d'alerte utilisateur
                    console.log('❌ Erreur géolocalisation:', error.code, error.message);
                    reject(error);
                },
                options
            );
        });
    };

    // Fonction pour remplir automatiquement les coordonnées
    const autoFillGeolocation = async () => {
        try {
            console.log('📍 Récupération automatique de la position...');

            const { latitude, longitude } = await getGeolocationAuto();

            // Formater les coordonnées (latitude, longitude avec 6 décimales)
            const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

            // Remplir le champ coordonneesgeo silencieusement
            setValue('coordonneesgeo', coordinates, {
                shouldValidate: false,
                shouldDirty: true,
                shouldTouch: false
            });

            console.log('✅ Position récupérée automatiquement:', coordinates);

        } catch (error) {
            // Erreur silencieuse - on ne bloque pas l'utilisateur
            console.log('⚠️ Impossible de récupérer la position automatiquement');
        }
    };

    // Fonction manuelle avec feedback utilisateur (pour le bouton)
    const handleGetLocationManual = async () => {
        try {
            console.log('📍 Récupération manuelle de la position...');

            const { latitude, longitude } = await getGeolocationAuto();

            // Formater les coordonnées (latitude, longitude avec 6 décimales)
            const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

            // Remplir le champ coordonneesgeo
            setValue('coordonneesgeo', coordinates, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            });

            // Notification de succès pour action manuelle
            alert(`✅ Coordonnées récupérées : ${coordinates}`);
            console.log('✅ Position récupérée manuellement:', coordinates);

        } catch (error) {
            // Afficher l'erreur pour action manuelle
            console.error('❌ Erreur géolocalisation manuelle:', error);
            alert('❌ Impossible de récupérer votre position. Vérifiez que la géolocalisation est activée.');
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            autoFillGeolocation();
        }, 1000);

        return () => clearTimeout(timer);
    }, [setValue]);


    useEffect(() => {
        setValue('decoupage', decoupage, {
            shouldValidate: true,
            shouldDirty: true
        });
    }, [decoupage, setValue]);

    const getAllActivites = async () => {
        const res = await getAllActivite();
        if (res.statusCode === 200 && res.data) {
            setActivite(res.data);
        }
    };

    const getAllSpeculation = async () => {
        const res = await getAllSpeculations();

        if (res.statusCode === 200 && res.data) {
            setSpeculations(res.data);
        }
    };

    // Chargement initial des données statiques

    useEffect(() => {
        getAllActivites();
        getAllSpeculation();
    }, []);

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


    // Submit
    const onSubmitHandler: SubmitHandler<EnrollementRequest> = async (data) => {
        try {

            setIsSubmitting(true); // active loader
            const agent_id = localStorage.getItem('agent_id') || '';
            const agent_superviseur_id = localStorage.getItem('agent_superviseur_id') || '';

            const formData = new FormData();

            formData.append('agent_id', agent_id);
            formData.append('agent_superviseur_id', agent_superviseur_id);

            // Récupérer le découpage depuis le localStorage si possible
            const storedDecoupageRaw = localStorage.getItem(LOCALSTORAGE_DECOUPAGE_KEY);
            let decoupageToSend = data.decoupage;

            if (storedDecoupageRaw) {
                try {
                    const storedDecoupage = JSON.parse(storedDecoupageRaw);
                    // Vérifier que storedDecoupage n'est pas vide
                    if (
                        storedDecoupage &&
                        (storedDecoupage.districtId || storedDecoupage.regionId || storedDecoupage.departmentId || storedDecoupage.sousPrefectureId || storedDecoupage.localiteId)
                    ) {
                        decoupageToSend = storedDecoupage;
                    }
                } catch {
                    // JSON mal formé dans le localStorage, on garde le data.decoupage du formulaire
                }
            }

            // On ajoute le découpage à formData uniquement s'il n'est pas vide
            const hasDecoupageData = Object.values(decoupageToSend).some(v => !!v);
            if (hasDecoupageData) {
                formData.append('decoupage', JSON.stringify(decoupageToSend));
                // console.log('Decoupage ajouté:', decoupageToSend);
            }
            // Champs à exclure de la boucle
            const excludedKeys = ['decoupage', 'photo', 'photo_document_1', 'photo_document_2'];

            // Pour les autres champs
            for (const [key, value] of Object.entries(data)) {

                // if (key === 'decoupage') {
                //     // On a déjà géré decoupage, on skip ici
                //     continue;
                // }
                if (excludedKeys.includes(key)) continue;

                if (key === 'typeCompte') {
                    formData.append('typeCompte', value);
                } else if (
                    typeof value === 'boolean' ||
                    typeof value === 'number' ||
                    typeof value === 'string'
                ) {
                    formData.append(key, String(value));
                } else if (value === null || value === undefined) {
                    // Skip
                } else {
                    formData.append(key, JSON.stringify(value));
                }
            }

            if (data.photo) {
                formData.append('photo', data.photo); // Pas de [0]
            }
            if (data.photo_document_1) {
                formData.append('photo_document_1', data.photo_document_1);
            }
            if (data.photo_document_2) {
                formData.append('photo_document_2', data.photo_document_2);
            }

            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File name: ${value.name}, type: ${value.type}, size: ${value.size}`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            // Ensuite, tu appelles ton API create ou update avec formData
            const isEdit = Boolean(initialValues?.id);
            if (isEdit) {
                const res = await updateEnrollement(initialValues?.id!, formData);
                if (res.statusCode === 200) {
                    setNotifications(res.message);
                    setStatusCode(res.statusCode);
                    setOpen(true);
                    getAllEnrollements();
                    // ✅ Reset si voulu aussi après update
                    reset();
                    setFiles({});
                    setIsSubmitting(false);
                } else {
                    setNotifications(res.message);
                    setStatusCode(res.statusCode);
                    setOpen(true);
                    setIsSubmitting(false);
                    reset();
                    setFiles({});
                    // setActiveTab('FORMULAIRE');
                    // toast.error(res.message);
                    // console.error('Erreur lors de la mise à jour du formulaire d\'enrôlement :', res.message);
                }

            } else {

                const res = await createEnrollement(formData);
                if (res.statusCode === 201) {
                    setNotifications(res.message);
                    setStatusCode(res.statusCode);
                    setOpen(true);
                    getAllEnrollements();
                    setIsSubmitting(false);
                    reset();
                    setFiles({});

                } else {
                    console.log(res.message)
                    setNotifications("Une erruer  c'est produit veiller renvoyer le form ");
                    setStatusCode(res.statusCode);
                    setOpen(true);
                    setIsSubmitting(false);
                    reset();
                    setFiles({});
                }

            }

        } catch (error) {
            setIsSubmitting(false); // désactive loader
            const msg = error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error); // fallback si c'est un objet ou autre
            toast.error(msg);
        }
    };

    return (
        <>

            <form onSubmit={handleSubmit(onSubmitHandler)} className="max-w-4xl mx-auto p-4 space-y-6" noValidate>

                {/* Type de compte */}
                <Card>
                    <CardHeader>
                        <CardTitle>Type de compte</CardTitle>
                        <CardDescription>
                            Veuillez sélectionner le type de compte correspondant à l'enrôlé.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="block mb-1 font-semibold" htmlFor="typeCompte">Type de compte</label>
                                <Controller control={control} name="typeCompte" rules={{ required: "Le type de compte est obligatoire" }}
                                    render={({ field }) => (
                                        <SelectWithSearchEnrollment value={field.value || ""} onChange={field.onChange} options={Object.values(TypeCompte).map((val) => ({ label: val, value: val }))} placeholder="Sélectionnez un type de compte" />
                                    )} />

                                {errors.typeCompte && (
                                    <p className="text-red-600 text-sm mt-1">{errors.typeCompte.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>

                </Card>

                <SelectDecoupage
                    onChange={(value) =>
                        setDecoupage({
                            districtId: value.districtId ?? '',
                            regionId: value.regionId ?? '',
                            departmentId: value.departmentId ?? '',
                            sousPrefectureId: value.sousPrefectureId ?? '',
                            localiteId: value.localiteId ?? '',
                        })
                    }
                />

                {/* <pre className="mt-6 bg-gray-100 p-4 rounded">
                {JSON.stringify(watch('decoupage'), null, 2)}
            </pre> */}

                {/* Infos personnels */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="nom">Nom</label>
                            <Input {...register('nom', { required: "Le nom est obligatoire" })} placeholder='Jean Dupont' />
                            {errors.nom && (
                                <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="prenom">Prénom</label>
                            <Input {...register('prenom', { required: "Le prénom est obligatoire" })} placeholder='Jean, Marie, etc.' />
                            {errors.prenom && (
                                <p className="text-red-600 text-sm mt-1">{errors.prenom.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="datedenaissance">Date de naissance</label>
                            <Input type="date" {...register('datedenaissance', { valueAsDate: true, required: "La date de naissance est obligatoire" })} />
                            {errors.datedenaissance && (
                                <p className="text-red-600 text-sm mt-1">{errors.datedenaissance.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="lieudenaissance">Lieu de naissance</label>
                            <Input {...register('lieudenaissance', { required: "Le lieu de naissance est obligatoire" })} placeholder='Paris, Marseille, etc.' />
                            {errors.lieudenaissance && (
                                <p className="text-red-600 text-sm mt-1">{errors.lieudenaissance.message}</p>
                            )}
                        </div>


                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="sexe">Sexe</label>
                            <Controller
                                control={control}
                                name="sexe"
                                rules={{ required: "Le sexe est obligatoire" }}
                                render={({ field }) => (
                                    <SelectWithSearchEnrollment value={field.value || ""}
                                        onChange={field.onChange}
                                        options={[ { label: "Homme", value: "HOMME" }, { label: "Femme", value: "FEMME" }, ]}
                                        placeholder="Sélectionnez le sexe"
                                    />
                                )}
                            />

                            {errors.sexe && (
                                <p className="text-red-600 text-sm mt-1">{errors.sexe.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="nationalit">Nationalité</label>
                            <Input defaultValue={'Burkinabè'} {...register('nationalit', { required: "La nationalité est obligatoire" })} placeholder='Ivoirinne, Burkinabè, etc.' />
                            {errors.nationalit && (
                                <p className="text-red-600 text-sm mt-1">{errors.nationalit.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="situationmatrimoniale">Situation matrimoniale</label>
                            <Input {...register('situationmatrimoniale')} placeholder='Marié, Célibataire, etc.' />
                            {errors.situationmatrimoniale && (
                                <p className="text-red-600 text-sm mt-1">{errors.situationmatrimoniale.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="niveaudinstruction">Niveau d'instruction</label>
                            <Controller control={control} name="niveaudinstruction"
                                rules={{ required: "Le niveau d'instruction est obligatoire" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sélectionnez un niveau" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                                            <SelectItem value="SECONDAIRE">Secondaire</SelectItem>
                                            <SelectItem value="UNIVERSITAIRE">Universitaire</SelectItem>
                                            <SelectItem value="SAIS_LIRE_ET_ECRIRE">Sais lire et écrire</SelectItem>
                                            <SelectItem value="ALPHABETISE">Alphabétise</SelectItem>

                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.niveaudinstruction && (
                                <p className="text-red-600 text-sm mt-1">{errors.niveaudinstruction.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="numroprincipal">Numéro principal</label>
                            <Input {...register('numroprincipal', { required: "Le numéro principal est obligatoire" })} placeholder='123456789' />
                            {errors.numroprincipal && (
                                <p className="text-red-600 text-sm mt-1">{errors.numroprincipal.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="languelocaleparle">Langue locale parlée</label>
                            <Input {...register('languelocaleparle')} placeholder='Français, Anglais, etc.' />
                            {errors.languelocaleparle && (
                                <p className="text-red-600 text-sm mt-1">{errors.languelocaleparle.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="autreslanguelocaleparle">Autres langues parlées (optionnel)</label>
                            <Input {...register('autreslanguelocaleparle')} placeholder='Français, Anglais, etc.' />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="site">Nom du site (optionnel)</label>
                            <Input {...register('site')} placeholder='Sur le parc, sur le jardin, etc.' />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="localiteId"> Activité principale ID (optionnel) </label>

                            <Controller
                                control={control}
                                name="activitprincipaleId"
                                rules={{ required: "L'activité principale est obligatoire" }}
                                render={({ field }) => (
                                    <SelectWithSearch
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        options={activite}
                                        placeholder="Sélectionnez une activité principale"
                                    />
                                )}
                            />

                            {errors.activitprincipaleId && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.activitprincipaleId.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="localiteId"> Spéculation principale ID (optionnel)</label>

                            <Controller
                                control={control}
                                name="spculationprincipaleId"
                                rules={{ required: "La spéculation principale est obligatoire" }}
                                render={({ field }) => (
                                    <SelectWithSearch
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        options={speculations}
                                        placeholder="Sélectionnez une spéculation principale"
                                    />
                                )}
                            />

                            {errors.spculationprincipaleId && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.spculationprincipaleId.message}
                                </p>
                            )}
                        </div>


                        <Controller
                            name="autresactivite"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <div>
                                    <label className="block mb-1 font-semibold" htmlFor="autresActivites">
                                        Autres activités (optionnel)
                                    </label>
                                    <SelectMultipleWithSearch
                                        values={field.value ?? []}
                                        onChange={field.onChange}
                                        options={activite}
                                        placeholder="Ajouter d'autres activités"
                                    />
                                </div>
                            )}
                        />

                        <Controller
                            name="autresspeculation"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <div>
                                    <label className="block mb-1 font-semibold" htmlFor="autresSpeculations">
                                        Autres spéculations (optionnel)
                                    </label>
                                    <SelectMultipleWithSearch
                                        values={field.value ?? []}
                                        onChange={field.onChange}
                                        options={speculations}
                                        placeholder="Ajouter d&apos;autres spéculations"
                                    />
                                </div>
                            )}
                        />


                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="campementquartier">Campement / Quartier (optionnel)</label>
                            <Input {...register('campementquartier')} placeholder='Bobo djoulasso' />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="coordonneesgeo">
                                Coordonnées géographiques (optionnel)
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    {...register('coordonneesgeo')}
                                    readOnly={!!watch('coordonneesgeo')}
                                    placeholder='47.234234, 5.324324'
                                    className="flex-1"
                                />
                                <Button type="button" onClick={handleGetLocationManual} variant="outline"
                                    className="shrink-0 px-3"
                                    title="Récupérer ma position GPS"
                                >
                                    <MapPin size={16} />
                                </Button>
                            </div>
                            {watch('coordonneesgeo') && (
                                <p className="text-sm text-green-600 mt-1">
                                    📍 Position GPS enregistrée
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="superficiedevotreparcellecultu">Superficie de votre parcelle cultivée (optionnel)</label>
                            <Input type="number" {...register('superficiedevotreparcellecultu', { valueAsNumber: true })} placeholder='10' />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="indiquezlasuperficieenha">Indiquez la superficie en ha (optionnel)</label>
                            <Input type="number" {...register('indiquezlasuperficieenha', { valueAsNumber: true })} placeholder='10' />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="quantitproduction">Quantité production (optionnel)</label>
                            <Input type="number" {...register('quantitproduction', { valueAsNumber: true })} placeholder='10' />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="prcisezlenombre">Précisez le nombre (optionnel)</label>
                            <Input type="number" {...register('prcisezlenombre', { valueAsNumber: true })} placeholder='10' />
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="moyendestockage">Moyen de stockage (optionnel)</label>
                            <Input {...register('moyendestockage')} placeholder='entrepot, magasin, etc.' />
                        </div>
                    </CardContent>
                </Card>

                {/* Upload fichiers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Camera className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold">Photo</h3>
                            </div>

                            <FileUploader name="photo" multiple={false} value={files} onValueChange={handleValueChange} onUpload={handleUpload} progresses={progresses} />

                            {errors.photo && (
                                <p className="text-sm text-red-500">{String(errors.photo.message)}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold">Pièce d&apos;identité (CNI) VERSO</h3>
                            </div>
                            <FileUploader name="photo_document_1" multiple={false} value={files} onValueChange={handleValueChange} onUpload={handleUpload} progresses={progresses} />
                            {errors.photo_document_1 && (
                                <p className="text-sm text-red-500">{String(errors.photo_document_1.message)}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold">Pièce d&apos;identité (CNI) RECTO</h3>
                            </div>

                            <FileUploader name="photo_document_2" multiple={false} value={files} onValueChange={handleValueChange} onUpload={handleUpload} progresses={progresses} />

                            {errors.photo_document_2 && (
                                <p className="text-sm text-red-500">{String(errors.photo_document_2.message)}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>


                <div className="text-center mt-6 w-full ">
                    <Button disabled={!canSubmit || isSubmitting} type="submit" className="w-full max-w-xs mx-auto flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <> <Loader2 className="animate-spin h-4 w-4" /> Enregistrement...  </>) : ("Enregistrer")}
                    </Button>
                </div>

            </form>

            <NotificationModal
                open={open}
                onClose={() => setOpen(false)}
                message={notifications}
                getAllData={getAllEnrollements}
                statusCode={statusCode}
                step={() => setActiveTab('FORMULAIRE')} // ✅ ici
            />

        </>
    );
}

