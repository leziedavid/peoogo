"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';  // Import de Image de Next.js
import { LucideHome, LucideInfo, Store, HandCoins, User, ShoppingBasket } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, } from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useCart } from '@/app/context/CartProvider';
import SideCart from '../SideCart';
import { useRouter } from 'next/navigation'
import { getUserAllData } from '@/api/services/auth';

// Composant Header principal
const HeaderMarket: React.FC = ({ }) => {

    const { countAllItems } = useCart();
    const [showSideCart, setShowSideCart] = useState(false);
    const cartItems = countAllItems();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [UserName, setUserName] = useState("");
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // fonction pour se déconnecter
    const logout = (): void => {
        // Fonction de déconnexion qui supprime les tokens et redirige vers login
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token') // Supprime access_token
            localStorage.removeItem('refresh_token') // Supprime refresh_token
            window.location.href = '/auth/login' // Redirige vers la page de connexion
        }
    }

    const navigationItems = [
        {
            title: "Accueil",
            href: "/",
            description: "",
            icon: <LucideHome className="w-4 h-4 mr-2 text-[#B07B5E]" /> // Icône pour ACCUEIL
        },
        {
            title: "Marché",
            href: "/market-place",
            description: "",
            icon: <Store className="w-4 h-4 mr-2  text-[#B07B5E]" /> // Icône pour PRODUITS
        },
        {
            title: "Prix du marché",
            href: "/prix-du-marche",
            description: "",
            icon: <HandCoins className="w-4 h-4 mr-2  text-[#B07B5E]" /> // Icône pour REALISATIONS
        },
        {
            title: "Aide et Assistance",
            href: "/aide-assistance",
            description: "",
            icon: <LucideInfo className="w-4 h-4 mr-2  text-[#B07B5E]" /> // Icône pour A PROPOS
        },
        // about
        {
            title: "À propos",
            href: "/about",
            description: "",
            icon: <LucideInfo className="w-4 h-4 mr-2  text-[#B07B5E]" /> // Icône pour A PROPOS
        },

    ];

    const [isOpen, setOpen] = useState(false);

    const getUserAll = async () => {

        const res = await getUserAllData()

        if (res.statusCode === 200 && res.data) {
            setIsLoggedIn(true)
            setUserName(res.data.name);
            setImageUrl(res.data.imageUrl);
        } else {
            setIsLoggedIn(false);
        }

    };

    useEffect(() => { getUserAll(); }, []);

    return (
        <>

            <header className="flex flex-col items-center fixed top-0 z-50 w-full shadow-sm">
                <div className="py-4 md:py-2 items-center w-full bg-white">

                    <div className="max-w-7xl mx-4 px-4 lg:mx-auto flex justify-between items-center gap-x-10">
                        <div className="flex justify-start items-center gap-1 -ml-16"> {/* marge négative */}
                            <Link href="/" className="flex items-center">
                                <Image src="/logos/Peoogo-01.svg" alt="logo" width={180} height={180} className="object-contain max-h-16 md:max-h-20 px-2" priority />
                            </Link>
                        </div>


                        {/* Navigation pour les écrans plus grands */}
                        <nav className="hidden md:flex gap-2">
                            <NavigationMenu className="flex justify-start items-start">
                                <NavigationMenuList className="flex justify-start gap-4 flex-row">
                                    {navigationItems.map((item) => (

                                        <NavigationMenuItem key={item.title}>
                                            {item.href ? (
                                                <>
                                                    <NavigationMenuLink href={item.href}>
                                                        <button className="font-bold text-black  leading-tight px-2 py-1 text-sm hover:bg-gray-100 flex items-center gap-1 uppercase tracking-tight">
                                                            {item.icon}
                                                            {item.title}
                                                        </button>
                                                    </NavigationMenuLink>
                                                </>
                                            ) : (
                                                <>
                                                    <NavigationMenuTrigger className="font-bold text-[#B07B5E]  uppercase leading-tight text-sm font-title tracking-tight text-lg px-2 py-1 gap-1">
                                                        {item.title}
                                                    </NavigationMenuTrigger>
                                                </>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </nav>

                        <div className="flex items-center gap-4">

                            {/* {isLoggedIn && (
                                <div onClick={() => setShowSideCart(true)} className="flex items-center gap-2 relative">
                                    <Bell className="w-6 h-6 text-[#B07B5E]" />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-2 -right-2 text-xs text-white bg-red-600 w-5 h-5 rounded-full flex items-center justify-center">
                                            {notifications.length >= 9 ? "9+" : notifications.length}
                                        </span>
                                    )}
                                </div>
                            )} */}

                            <div onClick={() => setShowSideCart(true)} className="flex items-center gap-2 relative">
                                <ShoppingBasket className="w-6 h-6 text-[#B07B5E] " />
                                {cartItems > 0 && (
                                    <span className="absolute -top-2 -right-2 text-xs text-white bg-[#B07B5E]  w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartItems >= 9 ? "9+" : cartItems}
                                    </span>
                                )}
                            </div>

                            {isLoggedIn ? (
                                <div className="relative" ref={menuRef}>
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpenMenu(!openMenu)} >
                                        <div className="w-6 h-6 relative rounded-full overflow-hidden">
                                            <Image src={imageUrl || "/IMG_5195.png"} alt={UserName || "Utilisateur"} fill className="object-cover" unoptimized/>
                                        </div>
                                        <div className="hidden md:block text-sm">
                                            {UserName ? (
                                                <>
                                                    <div className="font-medium text-[#B07B5E]">{UserName.split(" ")[0]}</div>
                                                    <div className="text-[#B07B5E]">{UserName.split(" ").slice(1).join(" ")}</div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="font-medium text-[#B07B5E]">Nom</div>
                                                    <div className="text-[#B07B5E]">Prénom</div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {openMenu && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push("/mon-compte")} >
                                                Mon compte
                                            </div>
                                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout} >
                                                Déconnexion
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <User onClick={() => router.push("/auth/login")}  className="w-6 h-6 text-[#B07B5E] cursor-pointer"
                                    />
                                </div>
                            )}


                        </div>


                        <div className="flex w-12 shrink lg:hidden items-end justify-end">

                            <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>

                            {isOpen && (
                                <div className="absolute top-20 left-0 right-0 bg-background shadow-lg py-4 border-t z-50">
                                    <div className="mx-auto w-full max-w-screen-xl px-4 flex flex-col gap-8">
                                        {navigationItems.map((item) => (
                                            <div key={item.title} className="flex flex-col gap-2">
                                                {item.href ? (
                                                    <Link href={item.href} className="flex justify-between items-center font-bold text-[#B07B5E]  uppercase leading-tight"
                                                        onClick={() => setOpen(false)} >
                                                        <span className="text-sm font-extrabold font-title tracking-tighter flex items-center">
                                                            {item.icon}
                                                            {item.title}
                                                        </span>
                                                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                                                    </Link>
                                                ) : (
                                                    <p onClick={() => setOpen(false)} className="font-bold text-[#B07B5E]  uppercase leading-tight text-sm font-extrabold font-title tracking-tighter flex items-center" >
                                                        {item.title}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </header>

            <SideCart visible={showSideCart} onRequestClose={() => setShowSideCart(false)} />

        </>
    );
};

export default HeaderMarket;
