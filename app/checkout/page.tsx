"use client";

import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartProvider";
import { submitOrder } from "@/api/services/authService";
import { getUserInfos } from "@/api/services/auth";
import { orderCheckoutSchema } from "@/schema/checkoutFormSchema";
import { z } from "zod";
import { DeliveryMethod, PaymentMethod } from "@/types/AllTypes";
import { toast } from "sonner";
import HeaderMarket from "@/components/market/HeaderMarket";
import { Footer } from '@/components/home/Footer';
import { launchPayment, requestToGetTransactionStatus } from '@/api/services/paymentService';
import { getAllPaymentMethodesHome } from '@/api/services/reglageServices';
import { Status } from '@/types/ApiReponse/adminApi';

type OrderCheckoutInput = z.infer<typeof orderCheckoutSchema>;

interface PaymentMethodChoice {
    id: PaymentMethod;
    label: string;
    description?: string;
    fee?: string;
    enabled: boolean;
}

interface DeliveryMethodChoice {
    id: DeliveryMethod;
    label: string;
    subLabel: string;
    price: number;
}

type Network = 'MOOV' | 'ORANGE' | 'MTN' | 'WAVE';

interface NetworkItem {
    id: Network;
    label: string;
    logo: string;
    status: Status; // <-- maintenant on utilise Status directement
}

const paymentMethods: PaymentMethodChoice[] = [
    {
        id: PaymentMethod.ON_ARRIVAL,
        label: "Paiement à la livraison",
        fee: "+200 FCFA de frais de traitement",
        enabled: true,
    },
    {
        id: PaymentMethod.MOBILE_MONEY,
        label: "Mobile Money",
        description: "Payez avec Mobile Money (des frais de traitement sont appliqués par l'opérateur)",
        enabled: true,
    },
    {
        id: PaymentMethod.CARD,
        label: "Carte de crédit",
        description: "Payez avec votre carte de crédit",
        enabled: false,
    },
];

const deliveryMethods: DeliveryMethodChoice[] = [
    {
        id: DeliveryMethod.HOME_DELIVERY,
        label: "Livraison à domicile (à vos frais)",
        subLabel: "Recevez-le dès demain à votre adresse",
        price: 15,
    },
    {
        id: DeliveryMethod.STORE_PICKUP,
        label: "Retrait en magasin – Gratuit",
        subLabel: "Disponible sous 1 semaine en boutique",
        price: 0,
    },
];

export default function Page() {
    const router = useRouter();
    const { items: cartItems, clearCart, countTotalPrice } = useCart();
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [paimentNember, setPaimentNember] = useState('');
    const [showNetwork, setShowNetwork] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [networks, setNetworks] = useState<NetworkItem[]>([]); // <-- utilise Status

    const form = useForm<OrderCheckoutInput>({
        resolver: zodResolver(orderCheckoutSchema),
        defaultValues: {
            deliveryDetails: { name: "", email: "", phone: "", company: "" },
            paymentMethod: PaymentMethod.ON_ARRIVAL,
            deliveryMethod: DeliveryMethod.HOME_DELIVERY,
            promoCode: "",
            items: [],
            amount: 0,
        },
    });

    // Récupération des réseaux actifs
    useEffect(() => {
        async function fetchActivePaymentMethods() {
            try {
                const res = await getAllPaymentMethodesHome();
                if (res.statusCode === 200 && res.data) {
                    const activeNetworks: NetworkItem[] = res.data
                        .filter((methode: any) => methode.status === 'ACTIVE')
                        .map((methode: any) => ({
                            id: methode.name.toUpperCase() as Network,
                            label: methode.name,
                            logo: methode.logo ?? `/default-logo.png`,
                            status: methode.status as Status,
                        }));
                    setNetworks(activeNetworks);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des méthodes de paiement :", err);
            }
        }
        fetchActivePaymentMethods();
    }, []);

    // Charge infos utilisateur
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await getUserInfos();
                if (res.data) {
                    form.reset({
                        ...form.getValues(),
                        deliveryDetails: {
                            name: res.data.name ?? "",
                            email: res.data.email ?? "",
                            phone: res.data.phoneNumber ?? "",
                            company: "",
                        },
                    });
                    setPaimentNember(res.data.phoneNumber ?? "");
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchUser();
    }, [form]);

    // Mise à jour du panier
    useEffect(() => {
        form.setValue(
            "items",
            cartItems.map((item) => ({
                productId: item.product.id,
                quantity: item.count,
                price: item.product.prixUnitaire,
            }))
        );
        form.setValue("amount", Number(countTotalPrice()));
    }, [cartItems, countTotalPrice, form]);

    function handlePaymentChange(val: string) {
        form.setValue("paymentMethod", val as PaymentMethod, { shouldValidate: true });
        setShowNetwork(val === PaymentMethod.MOBILE_MONEY);
    }

    function handleDeliveryChange(val: string) {
        form.setValue("deliveryMethod", val as DeliveryMethod, { shouldValidate: true });
    }

    function handlePromoChange(val: string) {
        form.setValue("promoCode", val, { shouldValidate: true });
    }

    const handleSelectNetwork = (id: Network) => {
        if (selectedNetwork === id) {
            setSelectedNetwork(null);
            setError(null);
        } else {
            setSelectedNetwork(id);
            setError(null);
        }
    };

    const getTransactionStatus = async (id: string) => {
        const response = await requestToGetTransactionStatus(id);
        if (response.statusCode === 200) {
            setPaymentStatus(response.data);
            form.handleSubmit(onSubmit)();
        }
    };

    const handleNetworkPayment = async () => {
        if (!selectedNetwork || !paimentNember) {
            toast.error("Veuillez sélectionner un réseau et entrer un numéro.");
            return;
        }

        const payload = { phone: paimentNember, amount: countTotalPrice() };

        try {
            switch (selectedNetwork) {
                case "WAVE":
                    const wavePayment = await launchPayment(payload);
                    if (wavePayment.statusCode === 200) {
                        toast.success("Paiement effectué avec succès.");
                        getTransactionStatus(wavePayment.data.id);
                    }
                    break;
                case 'ORANGE':
                    await fetch('/api/payment/orange', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    break;
                case 'MOOV':
                case 'MTN':
                    toast.error(`${selectedNetwork} n'est pas encore disponible.`);
                    return;
                default:
                    toast.error("Réseau non reconnu.");
                    return;
            }
        } catch (error) {
            toast.error(`Erreur : ${error}`);
        }
    };

    async function onSubmit(data: OrderCheckoutInput) {
        try {
            const payload = {
                ...data,
                paiementNumber: paimentNember ?? undefined,
                network: selectedNetwork ?? undefined,
                paymentStatus,
                promoCode: data.promoCode ?? undefined, // <-- Convertit null en undefined
            };

            const res = await submitOrder(payload);
            if (res.statusCode === 201) {
                toast.success("Commande créée avec succès");
                clearCart();
                router.push(`/success/${res.data.ordersNumber}`);
            } else {
                toast.error("Une erreur est survenue lors de la commande.");
            }
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <>
            <div className="mb-8">
                <HeaderMarket />
                <div className={`min-h-[calc(100vh_-_56px)] py-5 px-3 lg:px-6 mt-[4rem] md:mt-[4rem]`}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold mb-4">Détails de livraison</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input {...form.register("deliveryDetails.name")} placeholder="Nom complet" disabled={true} />
                                    <Input {...form.register("deliveryDetails.email")} placeholder="Adresse e-mail" disabled={true} />
                                    <Input {...form.register("deliveryDetails.phone")} placeholder="Numéro de téléphone" disabled={true} />
                                    <Input {...form.register("deliveryDetails.company")} placeholder="Nom de l’entreprise" disabled={true} />
                                </div>
                            </div>

                            <div>

                                <h2 className="text-xl font-bold mb-4">Paiement</h2>
                                <RadioGroup value={form.watch("paymentMethod")} onValueChange={handlePaymentChange} className="grid gap-4">
                                    {paymentMethods.map((method) => (
                                        <Card key={method.id} className={`p-4 ${!method.enabled ? "opacity-50 pointer-events-none" : ""}`}>
                                            <RadioGroupItem value={method.id} id={method.id} disabled={!method.enabled} />
                                            <Label htmlFor={method.id} className="ml-2 font-medium">
                                                {method.label}
                                            </Label>
                                            {method.description && <p className="text-sm text-gray-500 ml-6">{method.description}</p>}
                                            {method.fee && <p className="text-sm text-gray-500 ml-6">{method.fee}</p>}
                                        </Card>
                                    ))}
                                </RadioGroup>


                                {/* Paiement */}
                                {showNetwork && (
                                    <div className="flex gap-4 flex-wrap items-center mt-4 mb-4">
                                        {networks.map(({ id, label, logo, status }) => (
                                            <button key={id} type="button" onClick={() => status === 'ACTIVE' && handleSelectNetwork(id)}  disabled={status !== 'ACTIVE'}  className={`relative flex flex-col items-center rounded-full border-2 p-2 transition  ${selectedNetwork === id && status === 'ACTIVE' ? 'border-green-500 shadow-md' : 'border-transparent'}
                                            ${status !== 'ACTIVE' ? 'cursor-not-allowed opacity-40' : 'hover:border-gray-300'}`} style={{ width: 70, height: 70 }} >
                                                <Image src={logo} alt={label} width={48} height={48} className="rounded-full object-cover" unoptimized />
                                                <span className="mt-2 text-xs font-medium text-gray-700">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* {showNetwork && (
                                    <div className="flex gap-4 items-center mt-4 mb-4">
                                        {networks.map(({ id, label, logo, status }) => (
                                            <button key={id} type="button" onClick={() => status === 'available' && handleSelectNetwork(id)} disabled={status === 'unavailable'} className={`relative flex flex-col items-center rounded-full border-2 p-2 transition ${selectedNetwork === id && status === 'available' ? 'border-green-500 shadow-md' : 'border-transparent'}  ${status === 'unavailable' ? 'cursor-not-allowed opacity-40' : 'hover:border-gray-300'}`} style={{ width: 70, height: 70 }}>
                                                <Image src={logo} alt={label} width={48} height={48} className="rounded-full object-cover" unoptimized />
                                                <span className="mt-1 text-xs font-medium text-gray-700 mt-2">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )} */}

                                {selectedNetwork && showNetwork && (
                                    <div className="mb-4 space-y-4 mt-10">
                                        <div>
                                            <label htmlFor="paymentNumber" className="mb-1 block text-sm font-medium text-gray-700">
                                                Numéro pour le paiement Mobile Money
                                            </label>
                                            <Input id="paymentNumber" type="tel" value={paimentNember} onChange={(e) => setPaimentNember(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="Entrez votre numéro de paiement" />
                                        </div>

                                        <label htmlFor="amount" className="mb-1 block text-sm font-bold text-gray-700">
                                            Montant à payer {countTotalPrice()} Fcfa
                                        </label>

                                        <div className="flex items-center gap-4">
                                            <Button type="button" onClick={handleNetworkPayment} className="bg-green-600 text-white hover:bg-green-700" >
                                                Effectuer le paiement
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-4">Méthodes de livraison</h2>
                                <RadioGroup value={form.watch("deliveryMethod")} onValueChange={handleDeliveryChange} className="grid gap-4">
                                    {deliveryMethods.map((method) => (
                                        <Card key={method.id} className="p-4">
                                            <RadioGroupItem value={method.id} id={method.id} />
                                            <Label htmlFor={method.id} className="ml-2 font-medium">
                                                {method.label}
                                            </Label>
                                            <p className="text-sm text-gray-500 ml-6">{method.subLabel}</p>
                                        </Card>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="flex gap-4 items-center">
                                <Input placeholder="Enter a gift card, voucher or promotional code" value={form.watch("promoCode") ?? ""} onChange={(e) => handlePromoChange(e.target.value)} />
                                <Button type="button" onClick={() => alert("Fonctionnalité à implémenter")}>
                                    Appliquer
                                </Button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                            <h2 className="text-lg font-semibold">Résumé de la commande</h2>
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="flex justify-between">
                                    <span>
                                        {item.product.nom} x {item.count}
                                    </span>
                                    <span>{(item.count * item.product.prixUnitaire).toFixed(2)} Fcfa</span>
                                </div>
                            ))}
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span>{countTotalPrice()} Fcfa</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>{countTotalPrice()} Fcfa</span>
                            </div>
                            {!selectedNetwork && !showNetwork && (
                                <Button className="w-full" type="submit">
                                    Procéder au paiement
                                </Button>
                            )}
                            <p className="text-sm text-center text-gray-600">
                                Un ou plusieurs articles dans votre panier nécessitent un compte.
                                <br />
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}
