"use client";


import { useState } from 'react';
import {ChevronRight} from 'lucide-react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile"
import { motion } from 'framer-motion';
import SupportInterface from './SupportInterface';

interface SecuriteProps {
    onClose: () => void
    isOpen: boolean
}

export default function SupportServiceApp({ onClose, isOpen }: SecuriteProps) {

    const isMobile = useIsMobile()
    const [openSupport, setOpenSupport] = useState(false);
    const [types, settypes] = useState('Courses');

    const handleBack = (types: string) => {
        settypes(types);
        setOpenSupport(true);
    }

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
                                <h1 className="text-lg font-medium">Service d&apos;assistance</h1>
                            </div>

                            {/* Dernière course */}
                            <div className="p-4">
                                {/* Services */}
                                <div className="space-y-1">
                                    <p className="text-gray-500 text-sm mb-4">Services</p>

                                    <div className="space-y-1">
                                        <div  onClick={() => handleBack('Courses')}  className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-base">Courses</span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </div>

                                        <div  onClick={() => handleBack('Livraison')}  className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-base">Livraison</span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </div>

                                        <div  onClick={() => handleBack('Achat & Vent')}  className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-base">Achat & Vente</span>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </SheetContent>

                </motion.div>
            </Sheet>

            <SupportInterface onClose={() => setOpenSupport(false)} isOpen={openSupport} types={types} />
            
        </>

    );

};
