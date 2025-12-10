"use client";

import React, { useEffect, useState } from "react";
import { motion, Easing } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, ShoppingCart, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { getAllSliders } from "@/api/services/reglageServices";
import { Slider as SliderData } from "@/types/ApiReponse/adminApi";

export default function Slider() {
    const [sliders, setSliders] = useState<SliderData[]>([]);
    const [loading, setLoading] = useState(true);

    // Animation flottante
    const floatingAnimation = (
        duration: number,
        x: number,
        y: number,
        rotate = 0
    ) => ({
        y: [0, y, 0],
        x: [0, x, 0],
        rotate: [0, rotate, 0],
        transition: {
            y: { duration, repeat: Infinity, ease: "easeInOut" as Easing },
            x: { duration, repeat: Infinity, ease: "easeInOut" as Easing },
            rotate: { duration, repeat: Infinity, ease: "easeInOut" as Easing },
        },
    });

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

    if (loading) {
        return <Skeleton className="w-full h-[400px] rounded-md" />;
    }

    // 🟢 Composant Slide responsive
    const SlideContent = ({ slide }: { slide: SliderData }) => (
        <div
            className="relative flex flex-col text-center bg-cover bg-center rounded-md 
                 p-2 sm:p-4 md:p-8 lg:p-14 
                 gap-4 sm:gap-6 md:gap-8 
                 items-center"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
            {/* Overlay noir */}
            <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>

            {/* Icônes flottantes */}
            <motion.div
                className="absolute top-6 left-6 sm:top-10 sm:left-10 text-white opacity-50"
                animate={floatingAnimation(6, 15, 20, 25)}
            >
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
            </motion.div>

            <motion.div
                className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 text-white opacity-50"
                animate={floatingAnimation(5, -15, -25, -20)}
            >
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16" />
            </motion.div>

            <motion.div
                className="absolute top-1/3 right-1/5 text-white opacity-40"
                animate={floatingAnimation(7, 5, 15, 20)}
            >
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </motion.div>

            <motion.div
                className="absolute bottom-1/3 left-1/6 text-white opacity-40"
                animate={floatingAnimation(8, -8, 18, -15)}
            >
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </motion.div>

            <motion.div
                className="absolute top-1/4 left-1/2 text-white opacity-50 hidden md:block"
                animate={floatingAnimation(10, 10, 10, 360)}
            >
                <TrendingUp className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14" />
            </motion.div>

            <motion.div
                className="absolute top-1/2 right-1/3 text-white opacity-40"
                animate={floatingAnimation(9, -10, 12, 45)}
            >
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
            </motion.div>

            <motion.div
                className="absolute bottom-1/4 left-2/3 text-white opacity-50"
                animate={floatingAnimation(6, 15, -15, -30)}
            >
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16" />
            </motion.div>

            {/* Texte */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 items-center lg:grid-cols-2">
                <div className="flex gap-2 sm:gap-4 flex-col">
                    <div className="flex flex-col items-start gap-2 sm:gap-4">
                        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter text-start z-10">
                            {slide.label}
                        </h1>
                        {slide.description && (
                            <p
                                dangerouslySetInnerHTML={{ __html: slide.description }}
                                className="z-10 text-sm sm:text-base md:text-lg lg:text-xl 
                           leading-relaxed text-white tracking-tight max-w-md text-left"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Placeholder si besoin */}
            <Skeleton className="bg-muted rounded-md aspect-video mb-2" />
        </div>
    );

    // 🔹 Si un seul slider → affichage statique
    if (sliders.length === 1) {
        return (
            <div className="w-full py-1 md:py-1 lg:py-1">
                <div className="md:container md:mx-auto">
                    <SlideContent slide={sliders[0]} />
                </div>
            </div>
        );
    }

    // 🔹 Sinon → mode carousel
    return (
        <div className="w-full py-1 md:py-1 lg:py-1">
            <div className="md:container md:mx-auto">
                <Carousel
                    opts={{
                        align: "center",
                        loop: true,
                    }}
                    plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                    className="relative w-full"
                >
                    <CarouselContent>
                        {sliders.map((slide) => (
                            <CarouselItem key={slide.id}>
                                <SlideContent slide={slide} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Flèches centrées SUR l'image */}
                    <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 z-20 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors" />
                    <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 z-20 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors" />
                </Carousel>
            </div>
        </div>
    );
}
