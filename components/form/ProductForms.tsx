// 'use client';

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import SelectDecoupageProduct from "../filter/SelectDecoupageProduct";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Camera } from "lucide-react";
import { FileUploader } from "../upload/FileUploader";
import { ProductsRequest } from "@/types/ApiRequest/ProductsRequest";
import { TypeCompte } from "@/types/ApiRequest/EnrollementRequest";
import { UserEnrollementData } from "@/types/ApiReponse/userEnrollementData";
import { SubmitHandler } from "react-hook-form";
import { createProduct, getAllCategories, updateProduct } from "@/api/services/productServices";
import dynamic from "next/dynamic";
import { NotificationModal } from "../Dialog/NotificationModal";
import { SelectMultipleWithSearch } from '../filter/SelectMultipleWithSearch';
import { CategorieResponse } from "@/types/ApiReponse/ListeResponse";
import { ProductImagesManager } from "./ProductImagesManager";
const RichTextEditor = dynamic(() => import("../rich-text-editor"), { ssr: false });

const venteTypes = ["vente en gros", "vente en unité"];
const paymentMethods = ["Mobile Money", "Espèces", "Carte Bancaire"];
const typeActeurs = ["AGRICULTEURS", "AQUACULTEURS", "AUTRE_ACTEURS", "APICULTEURS", "REVENDEUR", "TRANSFORMATEUR", "ACHETEUR"];
const unites = ["KG", "SAC", "TRICYCLE", "TONNE", 'BOITE', 'PLANCHES', 'PIECES', 'LITRES'];
// const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

// =====================================================
// Solution 2: Adapter le schéma Zod au type ProductsRequest existant
// Modifiez votre schéma pour qu'il corresponde exactement à ProductsRequest :

const productSchema = z.object({
    id: z.string().optional(),
    categorie: z.array(z.string()).optional(),
    nom: z.string().min(2, "Libellé requis"),
    paymentMethod: z.string().min(1, "Méthode requise"),
    unite: z.string().min(1, "Unité requise"),
    quantite: z.coerce.number().positive("Quantité requise"),
    prixUnitaire: z.coerce.number().positive("Prix requis"),
    prixEnGros: z.coerce.number().positive("Prix en grosse requis"),
    saleType: z.string().min(1, "Type de vente requis"),
    typeActeur: z.nativeEnum(TypeCompte),
    disponibleDe: z.string().min(1, "Date de début requise"),
    disponibleJusqua: z.string().min(1, "Date de fin requise"),
    description: z.string().min(5, "Description requise"),
    images: z.instanceof(File).optional(),
    autre_images: z.array(z.instanceof(File)).optional(),
    decoupage: z.object({
        districtId: z.string(),
        regionId: z.string(),
        departmentId: z.string(),
        sousPrefectureId: z.string(),
        localiteId: z.string(),
    }),
    imageUrl: z.string().optional(),
    allimages: z.array(z.string()).optional(),
}).refine(data => new Date(data.disponibleDe) <= new Date(data.disponibleJusqua), {
    message: "La date de début doit être antérieure ou égale à la date de fin.",
    path: ["disponibleJusqua"],
});

interface ProductFormProps {
    initialValues?: Partial<ProductsRequest>;
    userEnrollementData: UserEnrollementData | null;
    fechproductsByCode: () => Promise<void>; // ✅ bon type
    setActiveTab: (tab: 'liste' | 'ajout') => void;
    codeUsers?: string | null;
}

export default function ProductForm({ initialValues, userEnrollementData, fechproductsByCode, setActiveTab, codeUsers }: ProductFormProps) {

    const [previewData, setPreviewData] = useState<ProductsRequest | null>(null);
    const [files, setFiles] = useState<Record<string, File[]>>({});
    const [progresses, setProgresses] = useState<Record<string, Record<string, number>>>({});
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<string>("");
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [categorie, setCategorie] = useState<CategorieResponse[]>([]);

    const [decoupage, setDecoupage] = useState({
        districtId: '',
        regionId: '',
        departmentId: '',
        sousPrefectureId: '',
        localiteId: '',
        ...initialValues?.decoupage,
    });

    const getValidTypeActeur = (value: string | undefined): TypeCompte => {
        if (value && typeActeurs.includes(value)) {
            return value as TypeCompte;
        }
        return typeActeurs[0] as TypeCompte; // fallback si invalide ou absent
    }

    const fetchCategories = async () => {
        const res = await getAllCategories();
        if (res.statusCode === 200 && res.data) {
            setCategorie(res.data);
        }
    }

    const defaultTypeActeur = getValidTypeActeur(userEnrollementData?.enrollement?.TypeCompte);

    const toDateInputFormat = (isoString?: string) => {
        return isoString ? new Date(isoString).toISOString().split('T')[0] : '';
    };

    // Récupérer les IDs des catégories depuis initialValues
    const initialCategorieIds: string[] = initialValues?.categorie ?? [];


    // Puis utilisez cette assertion de type dans useForm :
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
        trigger,
        getValues,
        setValue, } = useForm<ProductsRequest>({
            resolver: zodResolver(productSchema as any), // ← Assertion de type
            mode: "onChange",
            defaultValues: {
                typeActeur: defaultTypeActeur,
                ...initialValues,
                description: initialValues?.description || "",
                images: undefined,
                autre_images: undefined,
                disponibleDe: toDateInputFormat(initialValues?.disponibleDe),
                disponibleJusqua: toDateInputFormat(initialValues?.disponibleJusqua),
                decoupage: {
                    districtId: '',
                    regionId: '',
                    departmentId: '',
                    sousPrefectureId: '',
                    localiteId: '',
                    ...initialValues?.decoupage,
                },
                categorie: initialCategorieIds, // ✅ tableau de string
            },
        });


    useEffect(() => {
        const value = userEnrollementData?.enrollement?.TypeCompte;
        if (value && typeActeurs.includes(value)) {
            setValue("typeActeur", value as TypeCompte, { shouldValidate: true });
        }
    }, [userEnrollementData, setValue]);

    // Handle fichiers upload

    const handleValueChange = (name: string, fileList: File[]) => {
        setFiles((prev) => ({ ...prev, [name]: fileList }));

        if (name === "autre_images") {
            // multiple files
            setValue(name, fileList.length ? fileList : undefined, { shouldValidate: true });
        } else if (name === "images") {
            // single file
            setValue(name, fileList[0] ?? undefined, { shouldValidate: true });
        }
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

    const onPreview = async () => {
        const valid = await trigger();
        if (valid) {
            const values = getValues();
            console.log('Preview values:', decoupage); // ⬅️ regarde s'il contient déjà decoupage
            setPreviewData({ ...values, decoupage });
        }
    };

    const onSubmitHandler: SubmitHandler<ProductsRequest> = async (data) => {

        if (!userEnrollementData?.decoupage) {
            console.warn("Découpage utilisateur non disponible");
            return;
        }
        const decoupage = {
            districtId: userEnrollementData.decoupage.district?.id,
            regionId: userEnrollementData.decoupage.region?.id,
            departmentId: userEnrollementData.decoupage.department?.id,
            sousPrefectureId: userEnrollementData.decoupage.sousPrefecture?.id,
            localiteId: userEnrollementData.decoupage.localite?.id,
        };

        console.log('🚀 codeUsers:', codeUsers);
        // console.log('🗺️ Découpage:', decoupage);
        const formData = new FormData();
        formData.append('nom', data.nom);
        formData.append('description', data.description);
        formData.append('quantite', data.quantite.toString());
        formData.append('prixUnitaire', data.prixUnitaire.toString());
        formData.append('prixEnGros', data.prixEnGros.toString());
        formData.append('paymentMethod', data.paymentMethod);
        formData.append('unite', data.unite);
        formData.append('saleType', data.saleType);
        formData.append('typeActeur', data.typeActeur);
        formData.append('disponibleDe', data.disponibleDe);
        formData.append('disponibleJusqua', data.disponibleJusqua);
        formData.append('decoupage', JSON.stringify(decoupage));
        formData.append('categories', JSON.stringify(data.categorie ?? [])); // ✅ string[]
        codeUsers && formData.append('codeUsers', codeUsers);

        if (files['images']) {
            formData.append('image', files['images'][0]);

        }

        if (files['autre_images']) {
            files['autre_images'].forEach(file => {
                formData.append('autreImage', file);
            });
        }

        try {

            if (initialValues?.id) {
                const res = await updateProduct(initialValues?.id, formData);
                if (res.statusCode === 200) {
                    setNotifications(res.message);
                    setStatusCode(res.statusCode);
                    setOpen(true);
                    // toast.success(res.message);
                    fechproductsByCode();
                    // setActiveTab('liste');
                } else {
                    setNotifications(res.message);
                    setStatusCode(res.statusCode);
                    setOpen(true);

                    // toast.error(res.message);
                }
            } else {

                const res = await createProduct(formData);
                if (res.statusCode === 201) {
                    setNotifications(res.message);
                    setStatusCode(res.statusCode);
                    setOpen(true);
                    // toast.success(res.message);
                    fechproductsByCode();
                    setActiveTab('liste');
                } else {
                    setNotifications(res.message);
                    setStatusCode(res.statusCode);
                    setOpen(true);
                    // toast.error(res.message);
                }
            }

        } catch (error) {
            setNotifications("Erreur lors de la création du produit veuillez actualisé et réessayer");
            setStatusCode(500);
            setOpen(true);
            console.error('Erreur lors de la création du produit :', error);
        }

    };

    const allImages: string[] = initialValues?.allimages ?? [];

    useEffect(() => {
        fetchCategories();
    }, []);


    return (
        <>

            <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 mb-2">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="md:col-span-2">
                        <Label className="mb-2">Découpage géographique *</Label>
                        <SelectDecoupageProduct
                            initialDecoupage={{
                                districtId: userEnrollementData?.decoupage.districtId,
                                regionId: userEnrollementData?.decoupage.regionId,
                                departmentId: userEnrollementData?.decoupage.departmentId,
                                sousPrefectureId: userEnrollementData?.decoupage.sousPrefectureId,
                                localiteId: userEnrollementData?.decoupage.localiteId,
                            }}
                            onChange={(value) =>
                                setDecoupage({
                                    districtId: value.districtId ?? '',
                                    regionId: value.regionId ?? '',
                                    departmentId: value.departmentId ?? '',
                                    sousPrefectureId: value.sousPrefectureId ?? '',
                                    localiteId: value.localiteId ?? '',
                                })
                            } />
                    </div>

                    <div className="md:col-span-2">

                        <Controller name="categorie" control={control} defaultValue={initialCategorieIds}
                            render={({ field }) => (
                                <div>
                                    <label className="block mb-1 font-semibold" htmlFor="categories">
                                        Catégorie (optionnel)
                                    </label>
                                    <SelectMultipleWithSearch
                                        values={field.value ?? []}
                                        onChange={field.onChange}
                                        options={categorie ?? []}
                                        placeholder="Sélectionnez une catégorie"
                                    />
                                </div>
                            )}
                        />

                    </div>

                    <div>
                        <Label className="mb-2">Libellé de l’annonce *</Label>
                        <Input {...register("nom")} placeholder="Ex: Tomates fraîches du jour" className="w-full py-2" />
                        {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Type d'acteur *</Label>
                        <Controller
                            control={control}
                            name="typeActeur"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionnez votre rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {typeActeurs.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.typeActeur && <p className="text-red-500 text-sm">{errors.typeActeur.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Méthode de paiement *</Label>
                        <Controller
                            control={control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Méthode de paiement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentMethods.map(method => (
                                            <SelectItem key={method} value={method}>{method}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Unité *</Label>
                        <Controller
                            control={control}
                            name="unite"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionnez votre rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unites.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.unite && <p className="text-red-500 text-sm">{errors.unite.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Quantité *</Label>
                        <Input type="number" {...register("quantite")} placeholder="Quantité" className="w-full" />
                        {errors.quantite && <p className="text-red-500 text-sm">{errors.quantite.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Prix unitaire *</Label>
                        <Input type="number" {...register("prixUnitaire")} placeholder="Prix unitaire" className="w-full" />
                        {errors.prixUnitaire && <p className="text-red-500 text-sm">{errors.prixUnitaire.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Prix en gros *</Label>
                        <Input type="number" {...register("prixEnGros")} placeholder="Prix en gros" className="w-full" />
                        {errors.prixEnGros && <p className="text-red-500 text-sm">{errors.prixEnGros.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Type de vente *</Label>
                        <Controller
                            control={control}
                            name="saleType"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Type de vente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {venteTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.saleType && <p className="text-red-500 text-sm">{errors.saleType.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Date début *</Label>
                        <Input type="date" {...register("disponibleDe")} className="w-full" />
                        {errors.disponibleDe && <p className="text-red-500 text-sm">{errors.disponibleDe.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Date fin * </Label>
                        <Input type="date" {...register("disponibleJusqua")} className="w-full" />
                        {errors.disponibleJusqua && <p className="text-red-500 text-sm">{errors.disponibleJusqua.message}</p>}
                    </div>


                    <div className="md:col-span-2">
                        <Label className="mb-2">Description *</Label>
                        <Controller name="description" control={control}
                            render={({ field }) => (
                                <RichTextEditor content={field.value || ""} onChange={field.onChange} editable={true} />
                            )} />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                </div>

                <ProductImagesManager
                    productId={initialValues?.id}
                    mainImageUrl={initialValues?.imageUrl}
                    additionalImages={allImages ?? []}
                    onImagesDeleted={() => {
                        fechproductsByCode();
                        setActiveTab('liste');
                    }}
                    />

                {/* Upload fichiers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Camera className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold">Image principal du produit (1 Image maximum)</h3>
                            </div>

                            <FileUploader name="images" multiple={false} value={files} onValueChange={handleValueChange} onUpload={handleUpload} progresses={progresses} />

                            {errors.images && (
                                <p className="text-sm text-red-500">{String(errors.images.message)}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Camera className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold">Autre image du produit (2 Image maximum) </h3>
                            </div>
                            <FileUploader name="autre_images" multiple={true} value={files} onValueChange={handleValueChange} onUpload={handleUpload} progresses={progresses} />
                            {errors.autre_images && (
                                <p className="text-sm text-red-500">{String(errors.autre_images.message)}</p>
                            )}
                        </div>

                    </CardContent>
                </Card>

                <div className="flex flex-col md:flex-row gap-4 pt-4 mb-4">
                    <Button type="button" onClick={onPreview} className="w-full md:w-auto bg-gray-500 hover:bg-gray-600" >
                        Prévisualiser
                    </Button>
                    <Button type="submit" disabled={!isValid} className="w-full md:w-auto bg-[#B07B5E]" >
                        {Object.keys(initialValues ?? {}).length > 0 ? "Mettre à jour le produit" : "Publier le produit"}
                    </Button>
                </div>

            </form>

            {previewData && (
                <div className="mt-6 border p-4 rounded-md shadow bg-white">
                    <h2 className="text-lg font-bold mb-4">Résumé de l’annonce</h2>
                    <ul className="space-y-2 text-sm">
                        <li><strong>Libellé:</strong> {previewData.nom}</li>
                        <li><strong>Type d’acteur:</strong> {previewData.typeActeur}</li>
                        <li><strong>Type de vente:</strong> {previewData.saleType}</li>
                        <li><strong>Méthode de paiement:</strong> {previewData.paymentMethod}</li>
                        <li><strong>Unité:</strong> {previewData.unite}</li>
                        <li><strong>Quantité:</strong> {previewData.quantite}</li>
                        <li><strong>Prix unitaire:</strong> {previewData.prixUnitaire}</li>
                        <li><strong>Disponibilité:</strong> du {previewData.disponibleDe} au {previewData.disponibleJusqua}</li>
                        <li>
                            <strong>Description:</strong>
                            <div className="mt-2 border rounded-md p-2 bg-slate-50">
                                <RichTextEditor content={previewData.description} editable={false} />
                            </div>
                        </li>

                        {/*  <li><strong>Description:</strong> {previewData.description}</li>*/}
                        {/* <li><strong>Localisation:</strong> {Object.values(decoupage).join(" > ")}</li> */}
                    </ul>
                </div>
            )}

            {open && (
                <NotificationModal
                    open={open}
                    onClose={() => setOpen(false)}
                    message={notifications}
                    getAllData={fechproductsByCode}
                    statusCode={statusCode}
                    step={() => setActiveTab('liste')} // ✅ ici
                />
            )}

        </>
    );
}
