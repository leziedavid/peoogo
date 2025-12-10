"use client";

import { getAllReglagesHome } from "@/api/services/reglageServices";
import { Reglage } from "@/types/ApiReponse/adminApi";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const objetsAgricoles = [
    { value: "achat_produits", label: "Achat de produits agricoles" },
    { value: "vente_produits", label: "Vente de produits agricoles" },
    { value: "formation_agricole", label: "Formation et accompagnement agricole" },
    { value: "equipements_agricoles", label: "Équipements et matériels agricoles" },
    { value: "conseil_technique", label: "Conseil technique et agronomique" },
    { value: "marche_producteurs", label: "Accès au marché pour producteurs" },
    { value: "partenariat_cooperatives", label: "Partenariat avec coopératives" },
];

export const Footer = () => {
    const [reglages, setReglages] = useState<Reglage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReglages = async () => {
        try {
            const res = await getAllReglagesHome();
            if (res.data && res.data.length > 0) {
                setReglages(res.data);
            } else {
                setReglages([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReglages();
    }, []);

    const reglage = reglages[0]; // On prend le premier pour le footer

    return (
        <div className="bg-gradient-to-b from-[#022d13] to-[#022d13] text-white py-14 md:py-28 w-full">
            <div className="max-w-6xl mx-auto px-3 md:px-0 flex flex-col md:flex-row justify-between gap-10">
                {/* Image et texte */}
                <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
                    <div className="flex-shrink-0">
                        {loading ? (
                            <div className="w-[180px] h-[60px] bg-gray-300 animate-pulse rounded" />
                        ) : (
                            <Image
                                // src={reglage?.footerLogo ?? "/logos/Peoogo_Plan_de_travail_2.svg"}
                                src="/logos/Peoogo_Plan_de_travail_2.svg"
                                alt="logo"
                                width={180}
                                height={180}
                                className="object-contain"
                            />
                        )}
                    </div>

                    <div className="max-w-lg space-y-4 font-medium font-title text-sm md:text-base">
                        {loading ? (
                            <>
                                <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded" />
                                <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded" />
                            </>
                        ) : (
                            <p dangerouslySetInnerHTML={{ __html: reglage?.footerDescription ?? "" }} />
                        )}
                    </div>
                </div>

                {/* Sections */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-8 md:mt-0">
                    {/* Services */}
                    <div className="space-y-3 font-title">
                        <span className="uppercase text-xl font-extrabold">Services</span>
                        <div className="flex flex-col gap-2 text-base">
                            {objetsAgricoles.map((objet, index) => (
                                <div key={objet.value ?? index} className="font-medium">
                                    {objet.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3 font-title">
                        <span className="uppercase text-xl font-extrabold">Contact</span>
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-40 bg-gray-300 animate-pulse rounded" />
                                <div className="h-4 w-32 bg-gray-300 animate-pulse rounded" />
                                <div className="h-4 w-28 bg-gray-300 animate-pulse rounded" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 text-base">
                                <div className="font-medium">
                                    Ligne d’assistance{" "}
                                    <span className="text-[#BFC1BF] font-normal">
                                        {reglage?.assistanceLine ?? "Non défini"}
                                    </span>
                                </div>
                                <div className="font-medium">
                                    Emplacement{" "}
                                    <span className="text-[#BFC1BF] font-normal">
                                        {reglage?.emplacement ?? "Non défini"}
                                    </span>
                                </div>
                                <div className="font-medium">
                                    Email{" "}
                                    <span className="text-[#BFC1BF] font-normal">
                                        {reglage?.email ?? "Non défini"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Réseaux sociaux */}
                        <div className="flex space-x-5 py-2">
                            {loading ? (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full" />
                                    <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full" />
                                    <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full" />
                                </div>
                            ) : (
                                <>
                                    {reglage?.xUrl && <Instagram size={30} strokeWidth={3} />}
                                    {reglage?.linkedinUrl && <Linkedin size={30} strokeWidth={3} />}
                                    {reglage?.fbUrl && <Facebook size={30} strokeWidth={3} />}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
