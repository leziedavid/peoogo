'use client';

import { BadgePercent } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PubSection() {
    const letters = 'PEOOGO'.split('');

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-screen bg-gradient-to-br from-white-50 to-white px-6 md:px-20 py-6">

            {/* Colonne gauche */}
            <div className="space-y-10 relative">

                {/* Logo animé avec feuilles et badge */}
                <div className="flex items-center gap-2">
                    <div className="relative inline-block">

                        {/* Feuille à gauche du P */}
                        <div className="absolute -left-6 top-3 z-10 animate-float">
                            <Image
                                src="/leaf-left.svg"
                                alt="Feuille gauche"
                                width={80}
                                height={80}
                            />
                        </div>

                        {/* Feuille au-dessus du P */}
                        <div className="absolute -top-6 left-3 z-10 animate-float">
                            <Image
                                src="/leaf-right.svg"
                                alt="Feuille haut"
                                width={80}
                                height={80}
                            />
                        </div>

                        {/* Lettres animées */}
                        <span className="text-[90px] md:text-[120px] font-extrabold leading-none tracking-wider flex relative z-0">
                            {letters.map((letter, idx) => (
                                <motion.span
                                    key={idx}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [1, 0.5, 1],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: idx * 0.2,
                                        repeatType: 'loop',
                                        ease: 'easeInOut',
                                    }}
                                    className={`mx-1 text-${['green-600', 'orange-500', 'lime-500', 'amber-500', 'green-700', 'yellow-600'][idx % 6]}`}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </span>

                        {/* Badge animé au-dessus du P */}
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs animate-bounce">
                            <BadgePercent className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                    Grâce à notre plateforme, nous connectons les consommateurs aux producteurs agricoles locaux, pour une meilleure traçabilité et des produits de qualité.
                </p>
            </div>

            {/* Colonne droite (Image pleine hauteur) */}
            <div className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-xl">
                <Image
                    src="/travailleurs.jpg"
                    alt="Publicité"
                    fill
                    className="object-cover"
                />
            </div>
        </section>
    );
}
