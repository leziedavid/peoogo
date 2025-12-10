'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Fish, Users, Wheat, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {

    const [selectedType, setSelectedType] = useState("");
    const router = useRouter();

    const actorTypes = [
        {
            id: 'espace',
            title: 'ESPACE PRODUCTEUR',
            icon: Fish,
            description: 'Gestion des produits'
        },
        {
            id: 'lites',
            title: 'LISTE DE TOUS LES PRODUITS',
            icon: Users,
            description: 'Autres professionnels du secteur'
        }
    ];

    const onClickContinue = (type: string) => {
        switch (type) {
            case 'espace':
                router.push('/dashboard/products');
                break;
            case 'lites':
                router.push('/dashboard/liste-products');
                break;
            default:
                console.warn("Type inconnu :", type);
                break;
        }
    };

    return (

        <div className="bg-gray-50 flex flex-col items-center justify-center p-4">
            
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">INTERFACE DE GESTION DES PRODUITS</h1>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {actorTypes.map((type) => {
                        const isSelected = selectedType === type.id;

                        return (
                            <Card key={type.id} className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-[#B07B5E]  shadow-lg bg-blue-50' : 'hover:shadow-md bg-white'}`} onClick={() => setSelectedType(type.id)}>
                                <CardContent className="p-8 text-center">
                                    {/* Document Image */}
                                    <div className="mb-6 flex justify-center">
                                        <div className={`w-32 h-40 rounded flex items-center justify-center ${isSelected ? 'bg-blue-' : 'bg-gray-50'}`}>
                                            <Image src="/icon_default.svg" alt="Document icon" width={180} height={180} className="object-contain" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h5 className={`text-sm font-semibold mb-2 ${isSelected ? 'text-blue-[#B07B5E] ' : 'text-gray-900'}`}>
                                        {type.title}
                                    </h5>

                                    {/* Check Icon */}
                                    {isSelected && (
                                        <div className="absolute -bottom-2 -right-2">
                                            <div className="w-8 h-8 bg-[#B07B5E]  rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-white fill-current" />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Continue Button */}
                {/* Continue Button */}
                {selectedType && (
                    <div className="text-center mt-12">
                        <button onClick={() => onClickContinue(selectedType)} className="bg-[#B07B5E]  hover:bg-[#045d28] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200" >
                            Continuer
                        </button>
                    </div>
                )}

            </div>

        </div>

    );
};

export default Page;