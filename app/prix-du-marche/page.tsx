"use client";

import React from "react";
import Image from "next/image";
import { Footer } from "@/components/home/Footer";
import { motion, Easing } from "framer-motion";
import { Leaf, ShoppingCart, TrendingUp } from "lucide-react";
import EAgriMenu from "@/components/market/EAgriMenu";

// Floating animation helper compatible TypeScript
const floatingAnimation = (duration: number, x: number, y: number, rotate = 0) => ({
    y: [0, y, 0],
    x: [0, x, 0],
    rotate: [0, rotate, 0],
    transition: {
        y: { duration, repeat: Infinity, ease: "easeInOut" as Easing },
        x: { duration, repeat: Infinity, ease: "easeInOut" as Easing },
        rotate: { duration, repeat: Infinity, ease: "easeInOut" as Easing },
    },
});

export default function PrixDuMarchePage() {
    return (
        <>
            <EAgriMenu />

            <div className={`min-h-[calc(100vh_-_56px)] px-3 lg:px-6`}>

                <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-white to-white flex flex-col items-center justify-center relative overflow-hidden">

                    {/* Icônes et fruits animés */}
                    <motion.div className="absolute top-10 left-10 text-[#B07B5E] opacity-50" animate={floatingAnimation(6, 10, 20, 30)}>
                        <Leaf className="w-12 h-12" />
                    </motion.div>

                    <motion.div className="absolute bottom-20 right-20 text-green-800 opacity-50" animate={floatingAnimation(5, -10, -20, -30)}>
                        <TrendingUp className="w-16 h-16" />
                    </motion.div>

                    <motion.div className="absolute top-1/2 left-1/4 text-[#B07B5E] opacity-30 hidden md:block" animate={floatingAnimation(12, 0, 0, 360)}>
                        <ShoppingCart className="w-20 h-20" />
                    </motion.div>

                    {/* Fruits supplémentaires */}
                    <motion.div className="absolute top-1/3 right-1/5 text-green-800 opacity-40" animate={floatingAnimation(7, 5, 15, 20)}>
                        <Leaf className="w-10 h-10" />
                    </motion.div>

                    <motion.div className="absolute bottom-1/3 left-1/6 text-[#B07B5E] opacity-40" animate={floatingAnimation(8, -8, 18, -15)}>
                        <Leaf className="w-10 h-10" />
                    </motion.div>

                    {/* Contenu principal */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="rounded-xl flex flex-col items-center justify-center w-full max-w-md text-center px-4 sm:px-6 py-6 sm:py-8 md:py-10 lg:py-12 bg-transparent"
                    >
                        <div className="relative w-full h-48 sm:h-56 md:h-64 mb-4 sm:mb-6">
                            <Image
                                src="/loading-guide.svg"
                                alt="Bientôt disponible"
                                fill
                                style={{ objectFit: "contain" }}
                                priority
                            />
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            Bientôt disponible
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">
                            Les prix du marché et les tendances sur les cultures vivrières arrivent très bientôt !
                        </p>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </>
    );
}
