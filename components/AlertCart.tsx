'use client';

import { FC } from "react";
import { Product } from "@/types/ApiReponse/ProduitsResponse";
import { Button } from "./ui/button";

interface Props {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const AlertCart: FC<Props> = ({ product, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" onClick={onClose} ></div>

            {/* Dialog panel */}
            <div className="relative z-50 max-w-md w-full rounded-lg bg-white shadow-xl p-6 flex flex-col items-center gap-6">

                {/* Icon */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-bounce">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 text-green-600" >
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* Texte */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Produit ajouté au panier
                    </h3>
                    <p className="text-sm text-gray-500">
                        Le produit <strong>{product.nom}</strong> a été ajouté avec succès.
                    </p>
                </div>

                {/* Bouton Fermer */}
                <Button className="bg-red-600 text-white hover:bg-red-500 mt-2 px-6 py-1"  onClick={onClose}>
                    Fermer
                </Button>
            </div>
        </div>
    );
};

export default AlertCart;
