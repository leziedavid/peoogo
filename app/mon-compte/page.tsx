'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Lock, MenuIcon, User, Package, PlusSquare, ShoppingCart, ClipboardList, Heart, Star, Settings, MapPin, History, Eye } from 'lucide-react';
import HeaderMarket from '@/components/market/HeaderMarket';
import { getUserName, getUserRole, isSessionStillValid, logout } from '@/app/middleware';
import { Footer } from '@/components/home/Footer';
import OrderList from '@/components/market/OrderList';
import OrderHistory from '@/components/market/OrderHistory';
import React from 'react';
import EAgriMenu from "@/components/market/EAgriMenu";

interface Product {
    id: string | number;
    nom: string;
    prix: string;
    poids: string;
    image: string;
    localisation: string;
    publie: string;
    expire: string;
    expiresAt?: string;
    isActive: boolean;
    location: string;
    publishedAt: string;
}


// Tabs
const tabs = ['Commandes', 'Historiques', 'Paramètres'] as const;
type TabType = typeof tabs[number]; // Commandes, Historiques, Paramètres

export default function Page() {

    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('Commandes');

    const [UserName, setUserName] = useState("");
    const [UserRole, setUserRole] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    const tabTitles: Record<TabType, string> = {
        Commandes: "LISTE DES COMMANDES",
        Historiques: "HISTORIQUE DES COMMANDES",
        Paramètres: "PARAMÈTRES",
    };

    type MenuItem = {
        title: string;
        desc: string;
        icon: React.ReactNode;
        target: TabType;
    };

    const tabItems = [
        { title: 'Commandes', icon: <ClipboardList size={20} />, target: 'Commandes' as TabType },
        { title: 'Historiques', icon: <History size={20} />, target: 'Historiques' as TabType },
        { title: 'Paramètres', icon: <Settings size={20} />, target: 'Paramètres' as TabType },
    ];



    const menuItems: MenuItem[] = [
        { title: 'Commandes', desc: 'Mes commandes', icon: <ClipboardList className="size-6" />, target: 'Commandes' as TabType },
        { title: 'Historiques', desc: 'Suivi des transactions', icon: <History className="size-6" />, target: 'Historiques' as TabType },
        { title: 'Paramètres', desc: 'Compte et sécurité', icon: <Settings className="size-6" />, target: 'Paramètres' as TabType },
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 🔄 Vérifie la session au montage et à chaque changement de loginStateChange
    const checkSession = async () => {
        const valid = await isSessionStillValid();
        setIsLoggedIn(valid);
        if (!valid) {
            logout();
        }
    };

    const checkUserInfo = async () => {
        const user = await getUserName();
        if (user) {
            setUserName(user);
        }
    };

    const checkUserRole = async () => {
        const role = await getUserRole();
        if (role) {
            setUserRole(role);
        }

    };

    useEffect(() => { checkSession(); checkUserInfo(); checkUserRole(); }, []);


    return (
        <>
            <EAgriMenu />
            <div className={`min-h-[calc(100vh_-_56px)] py-2`}>

                <div className="grid grid-cols-1 md:grid-cols-12 mt-10 gap-6">

                    {/* Sidebar Desktop */}
                    {!isMobile && (
                        <aside className="col-span-3 px-4 py-6">
                            <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                <div className="p-4">
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="w-20 h-20 rounded-full border-4 border-orange-700 flex items-center justify-center text-[#B07B5E] font-bold text-2xl mb-2">
                                            p
                                        </div>
                                        <div className="text-lg font-bold text-gray-800 text-center"> {UserName} </div>
                                        <div className="text-sm text-gray-500 text-center"> {UserRole} </div>
                                    </div>

                                    <div className="space-y-2">
                                        {menuItems.map((item, i) => {
                                            const isActive = activeTab === item.target;
                                            return (
                                                <div key={i} onClick={() => setActiveTab(item.target)} className={`group relative flex gap-x-4 rounded-lg p-1 cursor-pointer ${isActive ? 'bg-[#B07B5E] text-white' : 'hover:bg-gray-50 text-gray-900'}`} >
                                                    <div className={`flex-none flex items-center justify-center  w-12 h-12  rounded-lg ${isActive ? 'bg-white text-[#B07B5E]' : 'bg-gray-50 text-gray-600 group-hover:bg-white group-hover:text-[#B07B5E]'}`} >
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{item.title}</div>
                                                        <p className="text-sm">{item.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                </div>
                            </div>
                        </aside>
                    )}


                    {/* Main Content */}
                    <main className="col-span-9 p-4 relative">
                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <div className="fixed bottom-4 right-4 z-50">
                                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                    <SheetTrigger asChild>
                                        <Button className="w-28 h-12 bg-[#B07B5E] text-white text-sm rounded-full shadow-lg">
                                            <MenuIcon className="mr-2 h-5 w-5" /> Menu
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="rounded-t-2xl p-6">
                                        <div className="flex flex-col items-center mb-4">
                                            <div className="w-16 h-16 rounded-full border border-green-600 flex items-center justify-center text-[#B07B5E] font-bold text-xl">
                                                e
                                            </div>
                                            <div className="text-sm font-bold text-gray-800 mt-2">{UserName}</div>
                                            <div className="text-xs text-gray-500">{UserRole}</div>
                                        </div>

                                        <div className="space-y-4">
                                            {tabItems.map((item, i) => (
                                                <div key={i} onClick={() => {
                                                    setActiveTab(item.target); setIsSheetOpen(false);
                                                }}
                                                    className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === item.target ? 'bg-[#B07B5E] text-white' : 'text-gray-800 hover:bg-gray-100'}`} style={{ cursor: 'pointer' }} >
                                                    {item.icon}
                                                    <span className="text-sm font-medium">{item.title}</span>
                                                </div>
                                            ))}
                                        </div>

                                    </SheetContent>
                                </Sheet>
                            </div>
                        )}
                        <div className="text-2xl font-bold mb-4">MON ESPACE </div>

                        {/* Tabs */}
                        {/* <div className="flex flex-wrap gap-2 space-x-2 mb-6 hidden md:block">
                            {tabs.map((tab) => (
                                <Button key={tab} className="flex-1 min-w-[140px] sm:flex-initial sm:w-auto" variant={activeTab === tab ? 'default' : 'outline'} onClick={() => setActiveTab(tab)}>
                                    {tab}
                                </Button>
                            ))}
                        </div> */}

                        {/* affiicher les element en finction du tab selectionné 'Commandes', 'Historiques' */}
                        <div className="flex-1 p-4 md:p-6 overflow-y-auto">

                            <div>
                                {activeTab === 'Commandes' &&
                                    <>
                                        <h1 className="text-sm font-bold mb-6">
                                            {tabTitles[activeTab]}
                                        </h1>
                                        <OrderList />
                                    </>
                                }
                                {activeTab === 'Historiques' &&
                                    <>
                                        <h1 className="text-sm font-bold mb-6">
                                            {tabTitles[activeTab]}
                                        </h1>
                                        <OrderHistory />
                                    </>
                                }

                                {activeTab === 'Paramètres' &&
                                    <>
                                        <h1 className="text-sm font-bold mb-6">
                                            {tabTitles[activeTab]}
                                        </h1>

                                    </>
                                }
                            </div>

                        </div>

                    </main>

                </div>
            </div>

            <Footer />
        </>

    );
}