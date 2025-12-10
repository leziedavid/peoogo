"use client";


import React from 'react';
import { Button } from '@/components/ui/button';
import { EcommerceOrder, EnrichedProducer } from "@/types/ApiReponse/EcommerceOrderResponse";
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { createReversement } from '@/api/services/reversementServices';


interface ReversementProps {
    initialValue?: EcommerceOrder;
    isOpen: boolean;
    onClose: () => void;
    fetchData: () => void;
}

export default function Reversement({ initialValue, isOpen, onClose, fetchData }: ReversementProps) {


    const handleReversement = async (producer: EnrichedProducer) => {
        if (!initialValue) return;

        const platformCommission = producer.totalAmount * 0.18;
        const producerEarnings = producer.totalAmount - platformCommission;
        const payload = {
            producerId: producer.id,
            orderId: initialValue.id,
            totalQuantity: producer.totalQuantity,
            totalAmount: producer.totalAmount,
            platformCommission: platformCommission,
            producerEarnings: producerEarnings,
            codeGenerated: producer.codeGenerate,
        };

        // createReversement
        const res = await createReversement(payload);
        if (res.statusCode === 201) {
            toast.success(res.message);
            fetchData();
        } else {
            toast.error(res.message);
        }

    };

    return (

        <div className="fixed inset-0 bg-black/50 z-50">
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform ${isOpen ? 'translate-x-0 w-full md:w-[50vw] shadow-xl' : 'translate-x-full w-100'} bg-white`}>
                {/* Header */}
                <h2 className="text-xl font-bold mb-4 text-[#B07B5E]"> Reversement sur la commande {initialValue?.ordersNumber} </h2>
                <Button onClick={onClose} className="absolute top-2.5 end-2.5 bg-red-500 text-white rounded-full w-8 h-8">
                    <X className="w-4 h-4" />
                </Button>
                {/* <pre> initialValue : {JSON.stringify(initialValue?.items?.[0]?.product?.decoupageId , null, 2)}</pre> */}

                {/* Infos commande */}
                {initialValue && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <p className='text-sm'><strong>N° :</strong> {initialValue.ordersNumber}</p>
                        <p className='text-sm'><strong>Date :</strong> {new Date(initialValue.createdAt).toLocaleDateString()}</p>
                        <p className='text-sm'><strong>Total commande :</strong> {initialValue.amount.toFixed(2)} FCFA</p>
                        <p className='text-sm'><strong>Méthode paiement :</strong> {initialValue.paymentMethod}</p>
                    </div>
                )}
                {/* Liste des producteurs */}
                <div className="space-y-4">
                    {initialValue?.items?.map(item => item.product.producer)?.filter((producer, index, self) => producer && self.findIndex(p => p?.id === producer?.id) === index)?.map((producer) => {
                        if (!producer) return null;

                        const platformCommission = producer.totalAmount * 0.18;
                        const producerEarnings = producer.totalAmount - platformCommission;

                        return (
                            <div key={producer.id} className="border p-4 rounded-lg shadow-sm">
                                <h3 className="text-sm font-semibold text-[#B07B5E]">{producer.name}</h3>
                                <p className='text-sm'><strong>Téléphone :</strong> {producer.phoneNumber || "Non renseigné"}</p>
                                <p className='text-sm'><strong>Solde :</strong> {producer.totalAmount.toFixed(2)} FCFA</p>
                                <p className='text-sm'><strong>Gains producteur :</strong> {producerEarnings.toFixed(2)} FCFA</p>
                                <p className='text-sm'><strong>Commission plateforme (18%) :</strong> {platformCommission.toFixed(2)} FCFA</p>
                                {/* Affichage du bouton ou message selon le reverser */}
                                {producer.reverser === 0 ? (
                                    <Button className="mt-3 bg-green-800 hover:bg-[#B07B5E] text-white text-sm" onClick={() => handleReversement(producer)}  >
                                        Reverser
                                    </Button>
                                ) : (
                                    <p className="mt-3 text-green-800 font-semibold text-sm">Déjà reversé au producteur</p>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
