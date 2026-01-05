'use client';

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import BuyingOptions from "@/components/BuyingOptions";
import { Footer } from "@/components/home/Footer";
import { Product } from "@/types/ApiReponse/ProduitsResponse";
import { geProduitstById } from "@/api/services/productServices";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import EAgriMenu from "@/components/market/EAgriMenu";

export default function ShowProduct() {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [detailProduit, setDetailProduit] = useState<Product | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    // ================= FETCH =================
    const getDetailProduct = async () => {
        try {
            const res = await geProduitstById(id);
            if (res.statusCode === 200 && res.data) {
                setDetailProduit(res.data);
                setSelectedImageIndex(0);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (id) getDetailProduct();
    }, [id]);

    // ================= IMAGES (LOGIQUE CONSERVÉE) =================
    const dataImages = useMemo(() => {
        if (!detailProduit) return [];

        const allImages: string[] = [];

        if (detailProduit.imageUrl) allImages.push(detailProduit.imageUrl);
        if (detailProduit.image && detailProduit.image !== detailProduit.imageUrl)
            allImages.push(detailProduit.image);
        if (detailProduit.autreImage) allImages.push(detailProduit.autreImage);
        if (detailProduit.images?.length) allImages.push(...detailProduit.images);

        return [...new Set(allImages)];
    }, [detailProduit]);

    const totalImages = dataImages.length;
    const activeImage = dataImages[selectedImageIndex];

    // ================= SLIDER CONTROLS (COMME LE MODÈLE) =================
    const nextImage = () => {
        if (totalImages <= 1) return;
        setSelectedImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = () => {
        if (totalImages <= 1) return;
        setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    if (!detailProduit) return null;

    return (
        <>
            <EAgriMenu />

            <div className="w-full max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">

                {/* ================= LEFT : SLIDER ================= */}
                <div>
                    {/* IMAGE PRINCIPALE */}
                    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gray-100">
                        {activeImage && (
                            <Image
                                src={activeImage}
                                alt={detailProduit.nom}
                                fill
                                className="object-cover"
                                sizes="(max-width:768px) 100vw, 50vw"
                                unoptimized
                            />
                        )}

                        {/* FLÈCHES + COMPTEUR */}
                        {totalImages > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white z-20"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white z-20"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-lg z-10">
                                    {selectedImageIndex + 1}/{totalImages}
                                </div>
                            </>
                        )}
                    </div>

                    {/* MINIATURES DESKTOP (COMME MODÈLE) */}
                    {totalImages > 1 && (
                        <div className="mt-4 hidden md:block">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {dataImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all
                                        ${index === selectedImageIndex
                                                ? "ring-2 ring-[#fd980e] scale-105"
                                                : "opacity-70 hover:opacity-100"}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`thumb-${index}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MINIATURES MOBILE (IDENTIQUE AU MODÈLE) */}
                    {totalImages > 1 && (
                        <div className="md:hidden mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-700">
                                    Images ({totalImages})
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {selectedImageIndex + 1}/{totalImages}
                                </span>
                            </div>

                            <div className="flex gap-2 overflow-x-auto">
                                {dataImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0
                                        ${index === selectedImageIndex
                                                ? "ring-2 ring-[#fd980e]"
                                                : "opacity-70"}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`mobile-thumb-${index}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT : INFOS PRODUIT ================= */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-semibold break-words">
                        {detailProduit.nom}
                    </h1>

                    <Badge
                        className={`w-fit ${detailProduit.statut === "disponible"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}`}
                    >
                        Produit : {detailProduit.statut}
                    </Badge>

                    <div className="flex gap-2 items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {detailProduit.decoupage.localite.nom},{" "}
                        {detailProduit.decoupage.sousPrefecture.nom},{" "}
                        {detailProduit.decoupage.department.nom}
                    </div>

                    <div
                        className="prose text-gray-600"
                        dangerouslySetInnerHTML={{ __html: detailProduit.description || "" }}
                    />

                    <p className="text-xl font-bold text-primary">
                        {new Intl.NumberFormat("fr-FR").format(detailProduit.prixUnitaire)} F CFA / {detailProduit.unite}
                    </p>

                    <p className="text-sm text-gray-700">
                        Quantité disponible : {detailProduit.quantite} {detailProduit.unite}
                    </p>

                    {detailProduit.statut === "disponible" ? (
                        <BuyingOptions product={detailProduit} />
                    ) : (
                        <>
                            <p className="text-xs text-gray-500 italic">
                                Veuillez vous connecter pour acheter ce produit.
                            </p>
                            <Button
                                onClick={() => router.push("/auth/login")}
                                variant="link"
                                className="px-0 text-[#B07B5E]"
                            >
                                Se connecter
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
