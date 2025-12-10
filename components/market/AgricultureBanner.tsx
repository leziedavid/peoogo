'use client';

import { getAllPublicitesHome } from '@/api/services/reglageServices';
import { Publicite } from '@/types/ApiReponse/adminApi';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AgricultureBanner() {
    const [publicites, setPublicites] = useState<Publicite[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPublicites = async () => {
        try {
            const res = await getAllPublicitesHome();
            if (res.data && res.data.length > 0) {
                setPublicites(res.data);
            } else {
                setPublicites([]);
                toast.error('Aucune publicité trouvée');
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des Publicités');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicites();
    }, []);

    return (
        <div className="w-full py-5 lg:py-5">
            <div className="md:container md:mx-auto">
                <div className="w-full min-h-[500px] flex flex-col py-6">
                    {/* Top Section: Image + Content */}
                    <div className="flex flex-col md:flex-row w-full flex-1">
                        {/* Left - Image Section */}
                        <div className="md:w-1/2 w-full h-[350px] md:h-auto relative">
                            {loading ? (
                                <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
                            ) : publicites.length > 0 ? (
                                <Image src={publicites[0].files ?? '/cereales.jpg'} alt='Publicité' fill style={{ objectFit: 'cover' }} className="object-cover rounded-lg" unoptimized />
                            ) : (
                                <Image src="/cereales.jpg" alt="Default" fill  style={{ objectFit: 'cover' }} className="object-cover rounded-lg" unoptimized/>
                            )}
                        </div>

                        {/* Right - Text Section */}
                        <div className="md:w-1/2 w-full bg-[#022d13] text-white p-8 flex flex-col justify-center items-start">
                            {loading ? (
                                <>
                                    <div className="h-10 w-3/4 bg-gray-300 animate-pulse rounded mb-4" />
                                    <div className="h-6 w-1/2 bg-gray-300 animate-pulse rounded mb-4" />
                                    <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded" />
                                </>
                            ) : publicites.length > 0 ? (
                                <>
                                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
                                        {publicites[0].title ?? ''}
                                    </h1>
                                    <h2 className="text-3xl md:text-2xl font-bold text-[#B07B5E] uppercase mt-2">
                                        {publicites[0].smallTitle ?? ''}
                                    </h2>
                                    <p dangerouslySetInnerHTML={{ __html: publicites[0].description  ?? ' ' }}  className="text-sm md:text-base mt-4 max-w-md" />
                                </>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
                                        Agriculture
                                    </h1>
                                    <h2 className="text-3xl md:text-2xl font-medium text-[#B07B5E] uppercase mt-2">
                                        Plateforme Peoogo
                                    </h2>
                                    <p className="text-sm md:text-base mt-4 max-w-md">
                                        Grâce à notre plateforme, nous connectons les consommateurs aux producteurs agricoles locaux, pour une meilleure traçabilité et des produits de qualité.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
