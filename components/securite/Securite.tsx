"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {ShieldCheck,AlertTriangle,ArrowRight,UserCheck,} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/useIsMobile"
import Image from "next/image"
interface SecuriteProps {
    onClose: () => void
    isOpen: boolean
}

export default function Securite({ onClose, isOpen }: SecuriteProps) {
    const isMobile = useIsMobile()
    const [shakeEnabled, setShakeEnabled] = useState(true)


    // Liste des options avec images
    const securityOptions = [
        {
            title: "Conducteurs Contrôlés",
            icon: "/security/verified_driver.svg",
        },
        {
            title: "Appels sécurisés",
            icon: "/security/secure_call.svg",
        },
        {
            title: "Attachez toujours votre ceinture",
            icon: "/security/seatbelt.svg",
        },
        {
            title: "Centre de sécurité",
            icon: "/security/security_center.svg",
        },
        {
            title: "Dites-nous tout sur votre course",
            icon: "/security/feedback.svg",
        },
        {
            title: "Contrôle photo",
            icon: "/security/photo_check.svg",
        },
    ]

    const buttons = [
        {
            icon: ShieldCheck,
            label: "111 : ambulance et police",
            onClick: () => {
                // ta fonction pour ambulance et police
                console.log("Appel ambulance et police");
            },
        },
        {
            icon: AlertTriangle,
            label: "Situation d'urgence",
            onClick: () => {
                // ta fonction pour urgence
                console.log("Situation d'urgence");
            },
        },
        {
            icon: ArrowRight,
            label: "Envoyer l'itinéraire",
            onClick: () => {
                // ta fonction pour envoyer itinéraire
                console.log("Envoyer l'itinéraire");
            },
        },
        {
            icon: UserCheck,
            label: "Contacts de confiance",
            onClick: () => {
                // ta fonction pour contacts de confiance
                console.log("Contacts de confiance");
            },
        },
    ];


    return (
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

                    <div className="px-4 sm:px-6">
                        <h2 className="text-2xl font-semibold text-center mb-6">
                            Sécurité
                        </h2>

                        {/* Boutons d'urgence */}
                        <div className="grid grid-cols-2 gap-6 text-center mb-6">
                            {buttons.map(({ icon: Icon, label, onClick }, idx) => (
                                <button
                                    key={idx}
                                    onClick={onClick}
                                    className="flex flex-col items-center justify-center space-y-3 bg-transparent border-none cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gray-100 bg-opacity-50 border-2 border-orange-600 flex items-center justify-center">
                                        <Icon className="w-10 h-10 text-gray-700" />
                                    </div>
                                    <span className="text-sm font-medium text-center leading-tight max-w-[100px] break-words">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Shake Toggle */}
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-6">
                            <div>
                                <p className="font-medium text-sm">Secouer pour demander de l&apos;aide</p>
                                <p className="text-xs text-gray-500">Basculer pour désactiver</p>
                            </div>
                            <Switch checked={shakeEnabled} onCheckedChange={setShakeEnabled} />
                        </div>

                        {/* Grid sécurité */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {securityOptions.map((item, index) => (
                                <Card key={index} className="p-3 flex flex-row items-center space-x-4 relative">
                                    {/* Texte superposé */}
                                    <span className="absolute left-4 top-4 text-black font-bold bg-opacity-50 px-2 py-1 rounded text-sm font-semibold z-10">
                                        {item.title}
                                    </span>

                                    {/* Image à droite, assez grande */}
                                    <div className="ml-auto">
                                        <Image
                                            src={item.icon}
                                            alt={item.title}
                                            width={100}  // tu peux ajuster la taille ici
                                            height={100}
                                            className="object-contain"
                                        />
                                    </div>
                                </Card>
                            ))}
                        </div>

                    </div>
                </SheetContent>
                
            </motion.div>
        </Sheet>
    )
}
