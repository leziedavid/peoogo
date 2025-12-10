"use cleint"

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile"
import { motion } from 'framer-motion';
import ChatInterface from './ChatInterface';
import Image from 'next/image';  // Import de Image de Next.js

interface SecuriteProps {
    onClose: () => void
    isOpen: boolean
    types: string
}

export default function SupportInterface({ onClose, isOpen }: SecuriteProps) {

    const isMobile = useIsMobile()
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [lastOrderId] = useState('ORDER_123456'); // Simuler un ID de commande
    const [openChate, setOpenChate] = useState(false);

    const handleQuestionSelect = (question: string) => {
        setSelectedQuestion(question);
        setOpenChate(true);
        onClose();

    };

    const questions = [
        "Problème avec une autre commande",
        "Problèmes techniques",
        "Problèmes financiers",
        "Retours sur le conducteur ou le véhicule",
        "Sécurité",
        "Objets perdus",
        "FAQ"
    ];

    return (

        <>
            <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => {
                        if (info.point.y > 100) onClose()
                    }} className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto sm:hidden" >

                    <SheetContent side={isMobile ? "bottom" : "left"} className={isMobile ? "h-[90%] overflow-y-auto" : "w-[400px] max-h-screen overflow-y-auto"}  >
                        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />

                        <div className="bg-white min-h-screen w-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h1 className="text-lg font-medium">Service l&apos;assistance</h1>
                            </div>

                            {/* Dernière course */}
                            <div className="p-4">
                                <p className="text-gray-500 text-sm mb-4">Dernière course</p>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="font-medium">Le 06.07 à 22:34</h3>
                                            <p className="text-gray-600 text-sm">Rue M10 Angre château marché ...</p>
                                        </div>
                                        <div className="relative w-12 h-8">
                                            <Image
                                                src="/ride.png"
                                                alt="Vehicle"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Aide</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>


                                {/* Questions supplémentaires */}
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-sm mb-4">Questions supplémentaires</p>

                                    <div className="space-y-1">

                                        {questions.map((question, index) => (
                                            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                                                onClick={() => handleQuestionSelect(question)} >
                                                <span className="text-base">{question}</span>
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                            </div>
                                        ))}
                                    </div>



                                </div>

                                {/* Messages du service l&apos;assistance */}
                                <div className="mt-8">
                                    <p className="text-gray-500 text-sm mb-4">Messages du service l&apos;assistance</p>

                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-base">Consulter tous les messages</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                        </div>

                    </SheetContent>

                </motion.div>
            </Sheet>

            {/* ChatInterface */}

            <ChatInterface onClose={() => setOpenChate(false)} isOpen={openChate} question={selectedQuestion} lastOrderId={lastOrderId} />

        </>

    );

};
