// components/OrderDetails.tsx
"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EcommerceOrder } from "@/types/ApiReponse/EcommerceOrderResponse";
import { paymentMethodToFrench } from "@/types/mapping/translations";
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingCart} from "lucide-react"
import { toast } from "sonner";
import { cancelEcommerceOrder } from "@/api/services/authService";

interface OrderDetailsProps {
    order: EcommerceOrder | undefined;
    isOpen: boolean
    onClose: () => void
}

export default function OrderDetails({ order, isOpen, onClose }: OrderDetailsProps) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

    const handleValidate = async (orderId: string) => {
        const res = await cancelEcommerceOrder(orderId);
        if (res.statusCode === 200) {
            toast.success("Commande annulée avec succès");
            // 👉 Ici tu appelles ton API d'annulation
        } else {
            toast.error("Une erreur s’est produite lors de l’annulation de la commande");
        }
    }

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
                <SheetContent side={isMobile ? "bottom" : "left"} className={isMobile ? "h-[90%] overflow-y-auto" : "w-[400px] max-h-screen overflow-y-auto"}>
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />

                    {order && (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-sm font-semibold flex items-center gap-2">  <ShoppingCart size={20} /> Détails commande #{order.ordersNumber}  </h2>
                            </div>

                            {/* Order info */}
                            <div className="max-w-5xl mx-auto p-6 space-y-6">
                                {/* Résumé commande */}
                                <Card>
                                    <CardHeader className="flex justify-between items-center gap-2">
                                        <div>
                                            <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden truncate max-w-full sm:max-w-xs">
                                                Passée le {format(new Date(order.createdAt), "dd MMMM yyyy", { locale: fr })}
                                            </p>
                                            <Badge variant={order.status === "COMPLETED" ? "default" : "secondary"} className="" >
                                                {paymentMethodToFrench(order.paymentMethod)}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                        <p><strong>Méthode de paiement :</strong> {order.paymentMethod}</p>
                                        <p><strong>Méthode de livraison :</strong> {order.deliveryMethod}</p>
                                        <p><strong>Total :</strong> {order.amount.toLocaleString()} FCFA</p>
                                        {order.canceledAt && (
                                            <p className="text-red-500">
                                                <strong>Annulée le :</strong>{" "}
                                                {new Date(order.canceledAt).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}{" "}
                                                à{" "}
                                                {new Date(order.canceledAt).toLocaleTimeString("fr-FR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        )}

                                    </CardContent>
                                </Card>

                                {/* Liste des produits */}

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Produits</CardTitle>
                                    </CardHeader>
                                    <CardContent className="divide-y">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 py-4">

                                                {/* <pre>{JSON.stringify(item.product.imageUrl )}</pre> */}

                                                <div className="w-10 h-10 relative flex-shrink-0">
                                                    <Image src={item.product.imageUrl || "/placeholder.png"} alt="" fill className="object-cover rounded"  unoptimized/>
                                                </div>

                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.product.nom}</p>
                                                    {/* <p className="text-sm text-gray-500">{item.product.description}</p> */}
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p>{item.product.prixUnitaire.toLocaleString()} FCFA</p>
                                                    <p className="text-sm text-gray-500">x {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Infos client */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Client</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-1">
                                        <p><strong>Nom :</strong> {order.user?.name ?? "Non disponible"}</p>
                                        <p><strong>Email :</strong> {order.user?.email ?? "Non disponible"}</p>
                                        <p> <strong>Téléphone :</strong>  {order.user?.phoneCountryCode ?? ""} {order.user?.phoneNumber ?? "Non disponible"} </p>
                                    </CardContent>
                                </Card>

                                {order.status === "PENDING" && (
                                    <Button onClick={() => handleValidate(order.id)} className="w-full bg-[#B07B5E] hover:bg-[#B07B5E]/50 text-white" >
                                        Annuler la commande
                                    </Button>
                                )}


                            </div>
                        </>
                    )}

                </SheetContent>
            </motion.div>
        </Sheet>


    );
}
