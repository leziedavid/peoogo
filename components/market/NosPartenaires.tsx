'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getAllPartenairesHomes } from '@/api/services/reglageServices';
import { Partenaire } from '@/types/ApiReponse/adminApi';


interface NosPartenairesProps {
    titre?: string;
    showNavigation?: boolean;
}

// Skeleton simple
const PartenaireSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg h-32 flex items-center justify-center" />
);

const NosPartenaires: React.FC<NosPartenairesProps> = ({ titre = 'NOS PARTENAIRES', showNavigation = true, }) => {

    const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPartenaires = async () => {
        try {
            const res = await getAllPartenairesHomes();
            if (res.data && res.data.length > 0) {
                setPartenaires(res.data);
            } else {
                setPartenaires([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartenaires();
    }, []);

    return (
        <div className="md:container md:mx-auto mt-5 px-4">
            {/* Titre */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{titre}</h2>
                <div className="w-24 h-1 bg-[#B07B5E] mx-auto rounded" />
            </div>

            {/* Carousel des partenaires */}
            <div className="relative max-w-6xl mx-auto">
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                        skipSnaps: false,
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {loading
                            ? Array(5)
                                .fill(0)
                                .map((_, idx) => (
                                    <CarouselItem key={idx} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                        <PartenaireSkeleton />
                                    </CarouselItem>
                                ))
                            : partenaires.map((partenaire) => (
                                <CarouselItem
                                    key={partenaire.id}
                                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                                >
                                    <div className="group">
                                        <div className="bg-white rounded-lg hover:shadow-lg transition-all duration-300 p-6 h-32 flex items-center justify-center border border-gray-200 hover:border-[#B07B5E]">
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                {partenaire.logo && (
                                                    <Image  src={partenaire.logo}  alt={partenaire.libeller || 'logo'} fill style={{ objectFit: 'contain' }} className="object-contain group-hover:scale-105 transition-transform duration-300" unoptimized />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                    </CarouselContent>

                    {/* Navigation */}
                    {showNavigation && !loading && (
                        <>
                            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-green-50 border-[#B07B5E] text-[#B07B5E]" />
                            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-green-50 border-[#B07B5E] text-[#B07B5E]" />
                        </>
                    )}
                </Carousel>
            </div>
        </div>
    );
};

export default NosPartenaires;
