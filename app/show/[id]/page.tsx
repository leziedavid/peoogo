'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import BuyingOptions from "@/components/BuyingOptions";
import HeaderMarket from "@/components/market/HeaderMarket";
import { Footer } from "@/components/home/Footer";
import { Product } from "@/types/ApiReponse/ProduitsResponse";
import { geProduitstById } from "@/api/services/productServices";
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import EAgriMenu from "@/components/market/EAgriMenu";

export default function ShowProduct() {

    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const [detailProduit, setDetailProduit] = useState<Product | null>(null);
    const router = useRouter();

    // get id by router
    const params = useParams()
    const id = params?.id as string

    // geProduitstById
    const getDetailProduct = async () => {
        try {
            const res = await geProduitstById(id);
            if (res.statusCode === 200 && res.data) {
                setDetailProduit(res.data);
            } else {
                setDetailProduit(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getDetailProduct();
    }, [id]);

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

    // Créer le tableau d'images combinant imageUrl, image, autreImage et images
    const dataImages = React.useMemo(() => {
        if (!detailProduit) return [];

        const allImages: string[] = [];

        if (detailProduit.imageUrl) {
            allImages.push(detailProduit.imageUrl);
        }

        if (detailProduit.image && detailProduit.image !== detailProduit.imageUrl) {
            allImages.push(detailProduit.image);
        }

        if (detailProduit.autreImage) {
            allImages.push(detailProduit.autreImage);
        }

        if (detailProduit.images && detailProduit.images.length > 0) {
            allImages.push(...detailProduit.images);
        }

        return [...new Set(allImages)];
    }, [detailProduit]);



    return (

        <>
            <div className="mb-8">
                <EAgriMenu />
                <div className={`min-h-[calc(100vh_-_56px)] mt-1`}>

                    {detailProduit && (
                        <div className="w-full min-h-screen bg-white px-4 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="flex flex-col px-2 md:px-4">
                                    <Image src={dataImages[selectedImageIndex] || "/astronaut-grey-scale.svg"} alt={detailProduit.nom} width={400} height={400} sizes="400px" className="rounded-2xl w-full h-auto object-cover" unoptimized />                                    {/* Slider des thumbnails */}
                                    <div className="flex gap-2 mt-4 overflow-x-auto">
                                        {/* {detailProduit.images.map((img, index) => ( */}
                                        {dataImages.map((img, index) => (
                                            <Image key={index} src={img || "/astronaut-grey-scale.svg"} alt={`thumbnail-${index}`} width={80} height={80} onClick={() => setSelectedImageIndex(index)} className="rounded-md object-cover border border-gray-200 flex-shrink-0" unoptimized />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 px-2 md:px-4">
                                    <h2 className="text-2xl font-bold break-words">{detailProduit.nom}</h2>
                                    <p className="text-sm text-gray-600">{detailProduit.saleType}</p>
                                    <Badge variant="outline" className={`text-xs text-[10px] py-[1px] px-1 rounded-md ${detailProduit.statut === "disponible" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                                        Produit :  {detailProduit.statut}
                                    </Badge>
                                    <p className="text-[#B07B5E] text-sm">  Publié {formatDate(detailProduit.createdAt)} </p>
                                    <div className="flex gap-2 items-center">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {detailProduit.decoupage.localite.nom}, {detailProduit.decoupage.sousPrefecture.nom}, {detailProduit.decoupage.department.nom}
                                        </span>
                                    </div>
                                    <div className="grid gap-1.5 font-normal">
                                        <p className="text-sm leading-none font-medium"> Description du produit  </p>
                                        <p dangerouslySetInnerHTML={{ __html: detailProduit && detailProduit.description ? detailProduit.description : '', }} className="text-muted-foreground text-sm lowercase first-letter:uppercase">
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-primary">
                                        {formatPrice(detailProduit.prixUnitaire)} F CFA / {detailProduit.unite}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        Quantité disponible : {detailProduit.quantite} {detailProduit.unite}
                                    </p>

                                    {detailProduit.statut === "disponible" && (
                                        <BuyingOptions product={detailProduit} />
                                    )}
                                    <div className="text-xs text-gray-500 italic">
                                        Veuillez vous connecter pour acheter ce produit.
                                    </div>

                                    <Button onClick={() => { router.push("/auth/login"); }} variant="link" className="px-0 text-[#B07B5E]">
                                        Se connecter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

        </>
    );
}
