'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/ApiReponse/ProduitsResponse';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from "next/link";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../ui/input';
import { filterProductsWithStatus, getAllCategories, getAllProductsWithStatusOne } from '@/api/services/productServices';
import ProductLoader from './ProductLoader';
import SelectFilterDecoupage from '../filter/SelectFilterDecoupage';
import { getAllSpeculations } from '@/api/services/enrollementsServices';
import { CategorieResponse, SpeculationsResponse } from '@/types/ApiReponse/ListeResponse';
import { SelectWithSearchByProduit } from '../select/SelectWithSearchByProduit';
import { Skeleton } from '../ui/skeleton';
import SkeletonFiltres from './SkeletonFiltres';

// Interface pour les filtres
interface DecoupageData {
    districtId?: string;
    regionId?: string;
    departmentId?: string;
    sousPrefectureId?: string;
    localiteId?: string;
}

export interface Filtre {
    typeVente: string;
    decoupage: DecoupageData;
    categorie: string;
    speculation: string;
    rating: string;
    prixMin: number;
    prixMax: number;
    qteMin: number;
    qteMax: number;
    periode: string;
}

// Valeurs par défaut
const filtresInitiaux: Filtre = {
    typeVente: '',
    decoupage: {
        districtId: '',
        regionId: '',
        departmentId: '',
        sousPrefectureId: '',
        localiteId: '',
    },
    categorie: '',
    speculation: '',
    rating: '',
    prixMin: 0,
    prixMax: 0,
    qteMin: 0,
    qteMax: 0,
    periode: '',
};


function convertirValeurSelonType<K extends keyof Filtre>(key: K, valeur: unknown): Filtre[K] {
    const numberFields: (keyof Filtre)[] = ['prixMin', 'prixMax', 'qteMin', 'qteMax'];
    if (numberFields.includes(key)) {
        return Number(valeur) as Filtre[K];
    }
    return String(valeur) as Filtre[K];
}

export default function MyMarket() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    // const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [filtresActifs, setFiltresActifs] = useState<Filtre>(filtresInitiaux);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(12);
    const [speculations, setSpeculations] = useState<SpeculationsResponse[]>([]);
    const [categories, setCategorie] = useState<CategorieResponse[]>([]);

    const getAllSpeculation = async () => {
        const res = await getAllSpeculations();
        if (res.statusCode === 200 && res.data) {
            setSpeculations(res.data);
        }
    };

    // Chargement initial des données statiques

    useEffect(() => {
        getAllSpeculation();
    }, []);

    // Fonction d'application des filtres avec toggle
    const appliquerFiltres = (filtre: Partial<Filtre>) => {
        setFiltresActifs((prev) => {
            const newFiltres = { ...prev };

            Object.entries(filtre).forEach(([key, newValue]) => {
                if (newValue !== undefined) {
                    const typedKey = key as keyof Filtre;
                    const prevValue = prev[typedKey];
                    const defaultValue = filtresInitiaux[typedKey];

                    if (typedKey === "decoupage" && typeof newValue === "object" && newValue !== null) {
                        // Fusionner proprement le découpage
                        const mergedDecoupage = {
                            ...(prev.decoupage || {}),
                            ...(newValue as DecoupageData),
                        };
                        newFiltres.decoupage = mergedDecoupage;
                    } else {
                        if (newValue === prevValue) {
                            // Réinitialiser si même valeur
                            (newFiltres as any)[typedKey] = defaultValue;
                        } else {
                            // Conversion et application
                            (newFiltres as any)[typedKey] = convertirValeurSelonType(typedKey, newValue);
                        }
                    }
                }
            });

            return newFiltres;
        });
    };

    function areFiltersEmpty(filtres: Filtre): boolean {
        const isDecoupageEmpty = Object.values(filtres.decoupage).every((val) => !val);

        return (
            filtres.typeVente === '' &&
            filtres.categorie === '' &&
            filtres.speculation === '' &&
            filtres.rating === '' &&
            filtres.prixMin === 0 &&
            filtres.prixMax === 0 &&
            filtres.qteMin === 0 &&
            filtres.qteMax === 0 &&
            filtres.periode === '' &&
            isDecoupageEmpty
        );
    }

    function aDesFiltresActifs(filtres: Filtre): boolean {
        const { typeVente, decoupage, categorie, speculation, rating, prixMin, prixMax, qteMin, qteMax, periode } = filtres;

        return (
            typeVente !== '' ||
            categorie !== '' ||
            speculation !== '' ||
            rating !== '' ||
            prixMin > 0 ||
            prixMax > 0 ||
            qteMin > 0 ||
            qteMax > 0 ||
            periode !== '' ||
            Object.values(decoupage).some(val => val !== '')
        );
    }

    const getAllProductsWithStatus = async () => {
        try {
            setIsLoading(true);
            const res = await getAllProductsWithStatusOne(currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setProducts(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
                setIsLoading(false);
            } else {
                setProducts([]);
                setIsLoading(false);
            }
        } catch (e: any) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (areFiltersEmpty(filtresActifs)) {
            getAllProductsWithStatus();
        }
    }, [currentPage, filtresActifs]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price);
    };

    const fetchCategories = async () => {
        const res = await getAllCategories();
        if (res.statusCode === 200 && res.data) {
            setCategorie(res.data);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "il y a 1 jour";
        if (diffDays === 2) return "il y a 2 jours";
        return `il y a ${diffDays} jours`;
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

    const reinitialiserFiltres = () => setFiltresActifs(filtresInitiaux);

    const validerFiltrage = async () => {

        const { typeVente, decoupage, categorie, speculation, rating, prixMin, prixMax, qteMin, qteMax, periode } = filtresActifs;
        // Toujours inclure toutes les clés du découpage, même si vides
        const decoupageFiltre: DecoupageData = {
            districtId: decoupage.districtId || '',
            regionId: decoupage.regionId || '',
            departmentId: decoupage.departmentId || '',
            sousPrefectureId: decoupage.sousPrefectureId || '',
            localiteId: decoupage.localiteId || '',
        };

        // Construire l'objet final à envoyer
        const payload: Filtre = {
            typeVente: typeVente || '',
            decoupage: decoupageFiltre,
            categorie: categorie || '',
            speculation: speculation || '',
            rating: rating || '',
            prixMin: prixMin || 0,
            prixMax: prixMax || 0,
            qteMin: qteMin || 0,
            qteMax: qteMax || 0,
            periode: periode || '',
        };

        // Affichage propre
        console.log("🚀 Filtres préparés :", JSON.stringify(payload, null, 2));

        try {
            setIsLoading(true);
            const res = await filterProductsWithStatus(payload, currentPage, limit);
            if (res.statusCode === 200 && res.data) {
                setProducts(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
                setIsLoading(false);
                setIsSheetOpen(false);
            } else {
                setProducts([]);
                setIsLoading(false);
                setIsSheetOpen(false);
            }
        } catch (error) {
            setProducts([]);
            setIsLoading(false);
            setIsSheetOpen(false);
        } finally {
            setIsLoading(false);
            setIsSheetOpen(false);
        }
    };

    // pargination avec filtre
    useEffect(() => {
        if (filtresActifs && aDesFiltresActifs(filtresActifs)) {
            validerFiltrage();
        }
    }, [currentPage]);

    const isDataEmpty = !isLoading && products.length === 0;


    return (
        <>
            <div className="md:container md:mx-auto mt-8">

                <div className="flex flex-col items-start px-1">
                    <div className="flex gap-2 flex-col mb-4">
                        <h2 className="text-3xl md:text-2xl tracking-tighter max-w-xl font-bold text-left">
                            Des produits frais
                        </h2>
                    </div>
                </div>

                <div className="w-full p-4 md:flex md:gap-8">

                    {/* Filtres - visibles à gauche sur desktop */}

                    <aside className="hidden md:block w-80 bg-white border rounded-lg p-4 h-fit space-y-4">
                        <h3 className="font-bold text-lg">Filtres</h3>

                        {isLoading ? (
                            <SkeletonFiltres />
                        ) : (
                            <>
                                {/* Type de vente */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Type de vente</h4>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" onClick={() => appliquerFiltres({ typeVente: 'gros' })}
                                            className={filtresActifs.typeVente === 'gros' ? 'bg-green-800 text-white cursor-pointer p-2' : 'cursor-pointer p-2'} >
                                            Vente en gros
                                        </Badge>
                                        <Badge variant="secondary" onClick={() => appliquerFiltres({ typeVente: 'detail' })}
                                            className={filtresActifs.typeVente === 'detail' ? 'bg-green-800 text-white cursor-pointer p-2' : 'cursor-pointer p-2'} >
                                            Vente en détail
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm">Catégories</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {categories.map((cat) => (
                                            <Badge  key={cat.id} variant="secondary" onClick={() => appliquerFiltres({ categorie: cat.id })}
                                                className={filtresActifs.categorie === cat.id ? "bg-green-800 p-2 text-white cursor-pointer" : "p-2 cursor-pointer"} >
                                                {cat.nom}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Filtrer par découpage</h4>
                                    <SelectFilterDecoupage onChange={(value) => { appliquerFiltres({ decoupage: value }); }} />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Les spéculations disponibles</h4>
                                    <SelectWithSearchByProduit value={filtresActifs.speculation}
                                        onChange={(value) => { appliquerFiltres({ speculation: value }); }}
                                        options={speculations}
                                        placeholder="Sélectionnez une spéculation"
                                    />
                                </div>


                                {/* Prix */}
                                <div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm mb-1">Prix min</h4>
                                            <Input type="number" min={0} value={filtresActifs.prixMin || ''} onChange={(e) => appliquerFiltres({ prixMin: Number(e.target.value) })} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm mb-1">Prix max</h4>
                                            <Input type="number" min={0} value={filtresActifs.prixMax || ''} onChange={(e) => appliquerFiltres({ prixMax: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Quantité */}
                                <div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm mb-1">Quantité min</h4>
                                            <Input type="number" min={1} value={filtresActifs.qteMin || ''} onChange={(e) => appliquerFiltres({ qteMin: Number(e.target.value) })} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm mb-1">Quantité max</h4>
                                            <Input type="number" min={1} value={filtresActifs.qteMax || ''} onChange={(e) => appliquerFiltres({ qteMax: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Période */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Période</h4>
                                    <Select value={filtresActifs.periode || ''} onValueChange={(val) => appliquerFiltres({ periode: val })}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="--- Sélectionnez ---" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="24h">Dernières 24h</SelectItem>
                                            <SelectItem value="7j">7 derniers jours</SelectItem>
                                            <SelectItem value="30j">30 derniers jours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-[#B07B5E]  hover:bg-green-800 text-white" onClick={validerFiltrage}>
                                        Filtrer
                                    </Button>
                                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={reinitialiserFiltres}>
                                        Réinitialiser
                                    </Button>
                                </div>

                            </>
                        )}
                    </aside>

                    <div className="flex-1">
                        {/* Bouton filtre mobile */}
                        <div className="md:hidden mb-4 mt-8">
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="text-green-800 border-green-600">Filtrer</Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="bg-white h-[80%] overflow-y-auto rounded-t-xl">
                                    <div className="p-4 space-y-4">
                                        <h3 className="font-bold text-lg">Filtres</h3>

                                        {isLoading ? (
                                            <SkeletonFiltres />
                                        ) : (
                                            <>
                                                <div>
                                                    <h4 className="font-semibold text-sm">Type de vente</h4>
                                                    <div className="flex gap-2">
                                                        <Badge variant="secondary" onClick={() => appliquerFiltres({ typeVente: 'gros' })} className={filtresActifs.typeVente === 'gros' ? 'bg-green-800 text-white cursor-pointer p-2' : 'cursor-pointer p-2'}  >
                                                            Vente en gros
                                                        </Badge>
                                                        <Badge variant="secondary" onClick={() => appliquerFiltres({ typeVente: 'detail' })} className={filtresActifs.typeVente === 'detail' ? 'bg-green-800 text-white cursor-pointer p-2' : 'cursor-pointer p-2'} >
                                                            Vente en détail
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-sm">Catégories</h4>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {categories.map((cat) => (
                                                            <Badge key={cat.id} variant="secondary" onClick={() => appliquerFiltres({ categorie: cat.id })}
                                                                className={filtresActifs.categorie === cat.id ? "bg-green-800 text-white cursor-pointer p-2" : "cursor-pointer p-2"} >
                                                                {cat.nom}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-sm mb-1">Filtrer par découpage</h4>
                                                    <SelectFilterDecoupage onChange={(value) => { appliquerFiltres({ decoupage: value }); }} />
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-sm mb-1">Les spéculations disponibles</h4>
                                                    <SelectWithSearchByProduit value={filtresActifs.speculation}
                                                        onChange={(value) => { appliquerFiltres({ speculation: value }); }}
                                                        options={speculations}
                                                        placeholder="Sélectionnez une spéculation principale"
                                                    />
                                                </div>

                                                {/* Prix */}
                                                <div>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-sm mb-1">Prix min</h4>
                                                            <Input type="number" min={0} value={filtresActifs.prixMin || ''} onChange={(e) => appliquerFiltres({ prixMin: Number(e.target.value) })} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-sm mb-1">Prix max</h4>
                                                            <Input type="number" min={0} value={filtresActifs.prixMax || ''} onChange={(e) => appliquerFiltres({ prixMax: Number(e.target.value) })} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantité */}
                                                <div>
                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-sm mb-1">Quantité min</h4>
                                                            <Input type="number" min={1} value={filtresActifs.qteMin || ''} onChange={(e) => appliquerFiltres({ qteMin: Number(e.target.value) })} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-sm mb-1">Quantité max</h4>
                                                            <Input type="number" min={1} value={filtresActifs.qteMax || ''} onChange={(e) => appliquerFiltres({ qteMax: Number(e.target.value) })} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Période */}
                                                <div>
                                                    <h4 className="font-semibold text-sm mb-1">Période</h4>
                                                    <Select value={filtresActifs.periode || ''} onValueChange={(val) => appliquerFiltres({ periode: val })}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="--- Sélectionnez ---" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="24h">Dernières 24h</SelectItem>
                                                            <SelectItem value="7j">7 derniers jours</SelectItem>
                                                            <SelectItem value="30j">30 derniers jours</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <Button className="flex-1 bg-[#B07B5E]  hover:bg-green-800 text-white" onClick={validerFiltrage}>
                                                        Filtrer
                                                    </Button>
                                                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={reinitialiserFiltres}>
                                                        Réinitialiser
                                                    </Button>
                                                </div>

                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Résultats + Formulaire de recherche */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 mt-4">
                            <h2 className="text-lg md:text-xl font-semibold">
                                Résultats : {products.length}
                            </h2>

                        </div>

                        <div className="md:container md:mx-auto mt-5">
                            {isLoading ? (

                                <ProductLoader />

                            ) : isDataEmpty ? (

                                <div className="flex flex-col items-center justify-center mt-10 text-center">
                                    <Image
                                        src="/error.svg"
                                        alt="Aucune donnée"
                                        width={180}
                                        height={180}
                                    />
                                    <p className="mt-4 text-gray-600 text-sm">Aucune donnée trouvée</p>
                                </div>
                            ) : (
                                <>

                                    {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {products.map((product) => (
                                            <div key={product.id} className="flex flex-col gap-2 cursor-pointer">
                                                <Link href={`/show/${product.id}`} passHref>
                                                    <div className="relative w-full bg-muted rounded-md aspect-video mb-1 overflow-hidden w-full h-32 md:h-40">
                                                        <Image src={product.imageUrl || "/astronaut-grey-scale.svg"} alt={product.nom} className="object-cover rounded-md" fill unoptimized />

                                                        <div className="absolute top-2 right-2">
                                                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-[#B07B5E] text-white">
                                                                {product.saleType}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 text-sm">
                                                        <p className="bg-muted text-[11px] py-[2px] px-2 rounded-md w-fit text-gray-700 w-full">
                                                            {product.decoupage.region.nom} - {product.decoupage.localite.nom}
                                                        </p>
                                                        <p className="font-bold text-lime-800 uppercase leading-tight ">{product.nom}</p>
                                                        <Badge variant="outline" className={`text-xs text-[10px] py-[1px] px-1 rounded-md ${product.statut === "disponible" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                                                            {product.statut}
                                                        </Badge>
                                                        <p className="text-[13px] font-medium">💵  {formatPrice(product.prixUnitaire)} F CFA / {product.unite}</p>
                                                        <p className="text-xs text-muted-foreground mb-1">📦 {product.quantite}  {product.unite}</p>
                                                        <p className="text-[10px] text-gray-500 font-mono">{product.code}</p>
                                                        <p className="text-[10px] text-gray-400 mb-1">Publié {formatDate(product.createdAt)} </p>
                                                    </div>
                                                </Link>
                                                <div className="mt-2">
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {products.length > 0 && (

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-4">
                                            <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                                                Page {currentPage} sur {Math.ceil(totalItems / limit)}
                                            </div>

                                            <div className="flex justify-center sm:justify-end space-x-2">
                                                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage <= 1} className="text-xs sm:text-sm"  >
                                                    <ChevronLeft className="h-4 w-4 sm:mr-1" />
                                                    <span className="hidden sm:inline">Précédent</span>
                                                </Button>

                                                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalItems / limit)} className="text-xs sm:text-sm" >
                                                    <span className="hidden sm:inline">Suivant</span>
                                                    <ChevronRight className="h-4 w-4 sm:ml-1" />
                                                </Button>
                                            </div>
                                        </div>

                                    )}

                                </>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}