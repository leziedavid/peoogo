'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/ApiReponse/ProduitsResponse';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductLoader from './ProductLoader';
import { useRouter } from "next/navigation";
import { getAllCategories, getAllProductsWithStatusOne } from '@/api/services/productServices';
import { CategorieResponse } from '@/types/ApiReponse/ListeResponse';
import SkeletonCategorie from './SkeletonCategorie';

export default function HomeMarket() {

    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategorie] = useState<CategorieResponse[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [limit] = useState(8);
    const router = useRouter();

    const getAllProductsWithStatus = async () => {
        try {
            setIsLoading(true);
            const res = await getAllProductsWithStatusOne(currentPage, limit, selectedCategory);
            if (res.statusCode === 200 && res.data) {
                setProducts(res.data.data);
                setCurrentPage(res.data.page);
                setIsLoading(false);
            } else {
                setProducts([]);
                setIsLoading(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getAllProductsWithStatus();
    }, [currentPage, selectedCategory]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "il y a 1 jour";
        if (diffDays === 2) return "il y a 2 jours";
        return `il y a ${diffDays} jours`;
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

    const isDataEmpty = !isLoading && products.length === 0;


    return (
        <div className="md:container md:mx-auto">

            {/* Skeleton ou catégories */}
            {isLoading ? (
                <SkeletonCategorie />
            ) : (
                <div className="flex gap-2 flex-wrap mb-6 justify-center">
                    {/* Badge "Tous" */}
                    <Badge key="all" variant="secondary" onClick={() => setSelectedCategory(null)} className={`cursor-pointer px-4 py-2 text-sm rounded-lg transition ${selectedCategory === null ? "bg-green-800 text-white" : "bg-gray-100" }`} >
                        Tous
                    </Badge>

                    {categories.map((cat) => (
                        <Badge key={cat.id} variant="secondary" onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id) }
                            className={`cursor-pointer px-4 py-2 text-sm rounded-lg transition ${selectedCategory === cat.id ? "bg-green-800 text-white" : "bg-gray-100"}`} >
                            {cat.nom}
                        </Badge>
                    ))}
                </div>
            )}

            {isLoading ? (

                <ProductLoader />

            ) : isDataEmpty ? (

                <div className="flex flex-col items-center justify-center mt-1 text-center">
                    <Image src="/error.svg" alt="Aucune donnée" width={180} height={180} />
                    <p className="mt-4 text-gray-600 text-sm">Aucune donnée trouvée</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-start px-1">
                        <div className="flex gap-2 flex-col mb-4">
                            <h2 className="text-3xl md:text-2xl  tracking-tighter max-w-xl font-bold text-left">
                                Des produits frais
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-1">
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
                                        <p className="bg-muted font-bold text-[11px] py-[2px] px-2 rounded-md w-fit text-gray-700 w-full">
                                            {product.decoupage.region.nom} - {product.decoupage.localite.nom}
                                        </p>
                                        <p className="font-bold text-lime-800 uppercase leading-tight ">{product.nom}</p>
                                        <Badge variant="outline" className={`text-xs text-[10px] py-[1px] px-1 rounded-md ${product.statut === "disponible" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                                            {product.statut}
                                        </Badge>
                                        {/* <p className="text-gray-600 text-xs leading-tight mb-1 truncate">{product.description || 'BLANC'}</p> */}
                                        <p className="text-[13px] font-medium">💵 {formatPrice(product.prixUnitaire)} F CFA / {product.unite}</p>
                                        <p className="text-xs text-muted-foreground mb-1">📦 {product.quantite} {product.unite}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">{product.code}</p>
                                        <p className="text-[10px] text-gray-400 mb-1">Publié {formatDate(product.createdAt)} </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Bouton "Consulter plus de produits" */}
                    <div className="w-full flex justify-center mt-10">
                        {/* sela doit ettre une fonction qui contui vert la page place-du marche */}
                        <Button onClick={() => router.push('/market-place')} className="gap-2 text-sm md:text-base bg-[#B07B5E] text-white hover:bg-[#022d13] hover:text-white">
                            Voir plus ...
                            <ArrowRight size={16} />
                        </Button>
                    </div>

                </>
            )}

        </div>
    );
}
