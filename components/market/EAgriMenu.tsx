"use client";

import { Menu, X, User, ShoppingBasket, MoveRight } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartProvider";
import SideCart from "../SideCart";
import { useRouter } from "next/navigation";
import { getUserAllData } from "@/api/services/auth";

export default function EAgriMenu() {

    const [open, setOpen] = useState(false);
    const { countAllItems } = useCart();
    const cartItems = countAllItems();
    const [showSideCart, setShowSideCart] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [UserName, setUserName] = useState("");
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const menuItems = [
        { label: "Accueil", href: "/", icon: "/home.svg" },
        { label: "Marché", href: "/market-place", icon: "/market-black.svg" },
        { label: "Prix du marché", href: "/prix-du-marche", icon: "/price.svg" },
        { label: "Aide et Assistance", href: "/aide-assistance", icon: "/service.svg" },
        { label: "À propos", href: "/about", icon: "/aide.svg" },
    ];


    useEffect(() => {
        async function getUserAll() {
            const res = await getUserAllData();
            if (res.statusCode === 200 && res.data) {
                setIsLoggedIn(true);
                setUserName(res.data.name);
                setImageUrl(res.data.imageUrl);
            } else {
                setIsLoggedIn(false);
            }
        }
        getUserAll();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/auth/login";
        }
    };

    return (
        <div className="w-full">
            {/* TOP BAR */}
            <div className="w-full bg-[#B07B5E] text-white text-center text-sm py-2">L’innovation au service de nos agriculteurs </div>

            {/* HEADER */}
            <header className="w-full bg-white relative z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* LOGO */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logos/Peoogo-01.svg"
                                alt="logo"
                                width={150}
                                height={150}
                                className="object-contain max-h-16 md:max-h-20 px-2"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-10 font-medium text-gray-700 absolute left-1/2 transform -translate-x-1/2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="hover:text-[#B07B5E] transition text-[15px] font-bold flex items-center"
                            >
                                <Image src={item.icon} alt={item.label} width={20} height={20} className="mr-2" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>


                    {/* RIGHT ICONS */}
                    <div className="flex items-center gap-4 ml-auto">
                        {/* Cart */}
                        <div onClick={() => setShowSideCart(true)} className="relative cursor-pointer p-2 hover:text-green-600 transition">
                            <ShoppingBasket className="w-6 h-6 text-[#B07B5E] " />
                            
                            {cartItems > 0 && (
                                <span className="absolute -top-2 -right-2 text-xs text-white bg-[#B07B5E] w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartItems >= 9 ? "9+" : cartItems}
                                </span>
                            )}
                        </div>

                        {/* User */}
                        {isLoggedIn ? (
                            <div className="relative" ref={menuRef}>
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpenMenu(!openMenu)}>
                                    <div className="w-6 h-6 relative rounded-full overflow-hidden">
                                        <Image src={imageUrl || "/IMG_5195.png"} alt={UserName || "Utilisateur"} fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="hidden md:block text-sm text-[#B07B5E]">
                                        {UserName ? (
                                            <>
                                                <div className="font-medium">{UserName.split(" ")[0]}</div>
                                                <div>{UserName.split(" ").slice(1).join(" ")}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="font-medium">Nom</div>
                                                <div>Prénom</div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {openMenu && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push("/mon-compte")}>
                                            Mon compte
                                        </div>
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout}>
                                            Déconnexion
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <User onClick={() => router.push("/auth/login")} className="w-6 h-6 text-[#B07B5E] cursor-pointer" />
                        )}

                        {/* Mobile Toggle */}
                        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={`md:hidden absolute left-0 right-0 top-full bg-white text-gray-1000 font-medium overflow-hidden rounded-b-lg shadow-lg transform origin-top transition-all duration-300 ${open ? "max-h-96 scale-y-100 py-3" : "max-h-0 scale-y-0 py-0"}`}
                >
                    <div className="flex flex-col space-y-3 px-6">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-left text-[16px] py-2 flex items-center gap-2 font-bold text-[#B07B5E]"
                                onClick={() => setOpen(false)}
                            >
                                <Image src={item.icon} alt={item.label} width={20} height={20} />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                </div>
            </header>

            <SideCart visible={showSideCart} onRequestClose={() => setShowSideCart(false)} />
        </div>
    );
}
