"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {Edit3,User,Phone,Mail,MapPin,Camera,Eye,EyeOff,Save,X,CreditCard,Wallet,Calendar,Shield} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/useIsMobile"
import { UserData } from "@/types/ApiReponse/UserDataResponse"
import { getUserAllData, updateFiles, updateProfile } from "@/api/services/auth"
import { toast } from 'sonner'

interface ParametresProps {
    onClose: () => void
    isOpen: boolean
}

export default function Parametres({ onClose, isOpen }: ParametresProps) {

    const isMobile = useIsMobile()
    const [isEditing, setIsEditing] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [userData, setUserData] = useState<UserData>({
        id: "",
        imageUrl: "",
        email: "",
        password: "",
        passwordGenerate: null,
        name: "",
        role: "",
        status: "",
        phoneCountryCode: "",
        phoneNumber: "",
        createdAt: "",
        updatedAt: "",
        partnerId: null,
        wallet: {
            id: "",
            balance: 0,
            userId: "",
            paymentMethod: "",
            rechargeType: "",
            createdAt: "",
            updatedAt: "",
            accountNumber: "",
            transactions: []
        },
    })

    // get user data
    const getParametresuserData = async () => {

        const res = await getUserAllData()
        if (res.statusCode === 200 && res.data) {
            setUserData(res.data);
            const dataToStore = {
                wallet: res.data.wallet.balance,
                accountNumber: res.data.wallet.accountNumber,
                };
            localStorage.setItem('walletData', JSON.stringify(dataToStore));
        }
    }

    // États pour l'édition
    const [editData, setEditData] = useState({
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        phoneCountryCode: userData.phoneCountryCode,
        password: ""
    })

    const [profileImage, setProfileImage] = useState<string | null>(null)

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        console.log("🚀 File:", file);
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {

                const imagePreview = e.target?.result as string;
                setProfileImage(imagePreview);

                try {

                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await updateFiles(formData);
                    if (response.statusCode === 200) {
                        console.log("✅ Image uploadée avec succès :", response.data);
                        toast.success("Image mise à jour avec succès.");
                        getParametresuserData();

                    } else {
                        getParametresuserData();
                        console.error("❌ Erreur d’upload :", response.message);
                        toast.error("Erreur lors de la mise à jour de l’image.");
                    }

                } catch (error) {
                    getParametresuserData();
                    console.error("❌ Upload échoué :", error);
                    toast.error("Erreur lors de la mise à jour de l’image.");
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const { name, email, phoneCountryCode, phoneNumber, password } = editData;

            const payload: Record<string, any> = {
                ...(name ? { name } : {}),
                ...(email ? { email } : {}),
                ...(phoneNumber ? { phoneNumber } : {}),
                ...(phoneCountryCode ? { phoneCountryCode } : {}),
                ...(password?.trim()?.length >= 6 ? { password } : {})
            };

            const response = await updateProfile(payload);

            if (response.statusCode === 200) {
                toast.success("Profil mis à jour avec succès.");
                getParametresuserData(); // Rafraîchir les données
                setIsEditing(false); // Fermer la modale
            } else {
                toast.error("Erreur lors de la mise à jour du profil.");
            }

        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
            getParametresuserData();
            toast.error("Erreur lors de la mise à jour du profil.");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatBalance = (balance: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(balance)
    }

    useEffect(() => {
        if (!isEditing) return;
        setEditData({
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            phoneCountryCode: userData.phoneCountryCode,
            password: "",
        });
    }, [userData, isEditing]);

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
                }}
                className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto sm:hidden" >
                <SheetContent
                    side={isMobile ? "bottom" : "left"}
                    className={isMobile ? "h-[90%] overflow-y-auto" : "w-[400px] max-h-screen overflow-y-auto"}>
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-semibold">Paramètres</h2>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2" >
                            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                            {isEditing ? "Annuler" : "Modifier"}
                        </Button>
                    </div>

                    <div className="p-4 space-y-6">
                        {/* Photo de profil */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <Avatar className="w-24 h-24 border-4 border-gray-200">
                                    <AvatarImage src={profileImage || userData.imageUrl || undefined}  />
                                    <AvatarFallback className="text-gray-500 bg-gray-100 text-3xl flex items-center justify-center">
                                        <User className="w-6 h-6" />
                                    </AvatarFallback>
                                </Avatar>

                                <button onClick={() => document.getElementById('profile-image')?.click()} className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors" >
                                    <Camera size={16} />
                                </button>
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Section Général */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Général</h3>

                            {/* Nom */}
                            <div className="flex items-center justify-between p-3 border-b">
                                <div className="flex items-center gap-3">
                                    <User size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-medium">
                                            {isEditing ? (
                                                <Input
                                                    value={editData.name}
                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                    className="w-full"
                                                />
                                            ) : (
                                                userData.name
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">Nom</p>
                                    </div>
                                </div>
                            </div>

                            {/* Téléphone */}
                            <div className="flex items-center justify-between p-3 border-b">
                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-medium">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={editData.phoneCountryCode}
                                                        onChange={(e) => setEditData({ ...editData, phoneCountryCode: e.target.value })}
                                                        className="w-20"
                                                    />
                                                    <Input
                                                        value={editData.phoneNumber}
                                                        onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            ) : (
                                            `${userData.phoneCountryCode ?? ""}${userData.phoneNumber ?? ""}`                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center justify-between p-3 border-b">
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-medium">
                                            {isEditing ? (
                                                <Input
                                                    value={editData.email}
                                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                    className="w-full"
                                                />
                                            ) : (
                                                userData.email
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">Email</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mot de passe */}
                            {isEditing && (
                                <div className="flex items-center justify-between p-3 border-b">
                                    <div className="flex items-center gap-3 w-full">
                                        <Shield size={20} className="text-gray-500" />
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    value={editData.password}
                                                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                                    placeholder="Nouveau mot de passe"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">Mot de passe</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Ajouter une adresse */}
                            <div className="flex items-center justify-between p-3 border-b">
                                <div className="flex items-center gap-3">
                                    <MapPin size={20} className="text-gray-500" />
                                    <span>Ajouter une adresse</span>
                                </div>
                                <span className="text-gray-400">›</span>
                            </div>
                        </div>

                        {/* Section Wallet */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Portefeuille</h3>

                            <Card className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Wallet size={20} className="text-green-500" />
                                        <span className="font-medium">Solde</span>
                                    </div>
                                    <span className="font-bold text-green-600">
                                        {userData.wallet ? formatBalance(userData.wallet.balance) : formatBalance(0)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className="text-blue-500" />
                                        <span className="font-medium">Méthode de paiement</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {userData.wallet?.paymentMethod || "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">Type de recharge</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {userData.wallet?.rechargeType || "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">Numéro de compte</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {userData.wallet?.accountNumber || "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} className="text-gray-500" />
                                        <span className="font-medium">Créé le</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {userData.wallet?.createdAt ? formatDate(userData.wallet.createdAt) : "—"}
                                    </span>
                                </div>
                            </Card>
                        </div>


                        {/* Section Notifications */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">!</span>
                                </div>
                                <h3 className="text-lg font-medium">Notifications désactivées</h3>
                            </div>

                        </div>

                        {/* Bouton Sauvegarder */}
                        {isEditing && (
                            <div className="pt-4">
                                <Button onClick={handleSave} className="w-full bg-blue-500 hover:bg-blue-600 text-white" >
                                    <Save size={16} className="mr-2" />
                                    Sauvegarder les modifications
                                </Button>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </motion.div>
        </Sheet>
    )

}