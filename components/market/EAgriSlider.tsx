"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider as SliderData } from "@/types/ApiReponse/adminApi";
import { getAllSliders } from "@/api/services/reglageServices";
import { toast } from "sonner";

export default function EAgriSlider() {
    const [current, setCurrent] = useState(0);
    const [activeBtn, setActiveBtn] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [sliders, setSliders] = useState<SliderData[]>([]);

    const next = () => {
        setCurrent((prev) => (prev + 1) % sliders.length);
        setActiveBtn(null);
    };
    const prev = () => {
        setCurrent((prev) => (prev - 1 + sliders.length) % sliders.length);
        setActiveBtn(null);
    };

    const fetchSliders = async () => {
        try {
            const res = await getAllSliders(1, 10);
            if (res.data) {
                setSliders(res.data.data);
            } else {
                setSliders([]);
                toast.error("Aucun slider trouvé");
            }
        } catch (err) {
            toast.error("Erreur lors du chargement des sliders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    // Slider automatique toutes les 5 secondes
    useEffect(() => {
        if (!loading && sliders.length > 0) {
            const interval = setInterval(next, 5000);
            return () => clearInterval(interval);
        }
    }, [sliders, loading]);

    if (loading) {
        return (
            <div className="px-4 md:container md:mx-auto py-6">
                <div className="w-full h-[230px] sm:h-[450px] md:h-[550px] overflow-hidden rounded-lg shadow-lg relative">
                    <div className="flex h-full">
                        <div className="min-w-full h-full relative">
                            <Skeleton className="absolute inset-0 rounded-lg" />
                            <div className="relative z-10 flex flex-col justify-center items-start h-full px-4 sm:px-6 md:px-10 space-y-2 sm:space-y-4">
                                <Skeleton className="w-3/4 h-8 sm:h-10 md:h-16 rounded-lg" />
                                <Skeleton className="w-2/3 h-10 sm:h-12 md:h-20 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:container md:mx-auto py-6">
            <div className="w-full h-[230px] sm:h-[450px] md:h-[550px] overflow-hidden rounded-lg shadow-sm relative">
                <div
                    className="flex transition-transform duration-1000 ease-in-out h-full"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {sliders.map((slide) => (
                        <div
                            key={slide.id}
                            className="min-w-full h-full relative"
                            style={{
                                backgroundImage: `url(${slide.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>

                            {/* Texte contenu uniquement limité en largeur pour mobile */}
                            <div className="relative z-10 flex flex-col justify-center items-start h-full px-2 sm:px-6 md:px-10 space-y-2 sm:space-y-4 text-white">
                                <h1 className="text-left text-3xl sm:text-7xl md:text-7xl font-extrabold leading-tight max-w-full sm:max-w-xl md:max-w-2xl">
                                    {slide.label}
                                </h1>
                                {slide.description && (
                                    <div dangerouslySetInnerHTML={{ __html: slide.description }}
                                        className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold py-1 rounded-lg bg-black/30 leading-relaxed text-white max-w-full sm:max-w-md md:max-w-lg" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Flèches */}
                <button
                    onClick={() => { prev(); setActiveBtn(0); }}
                    className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg p-2 sm:p-3 hover:scale-110 transition ${activeBtn === 0 ? "bg-white text-black" : "bg-white/30 text-black/70"}`}
                >
                    <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9" />
                </button>
                <button
                    onClick={() => { next(); setActiveBtn(1); }}
                    className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg p-2 sm:p-3 hover:scale-110 transition ${activeBtn === 1 ? "bg-white text-black" : "bg-white/30 text-black/70"}`}
                >
                    <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9" />
                </button>
            </div>
        </div>
    );
}
