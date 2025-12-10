'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import {PanelLeftOpen, PanelLeftClose, Home, MapPinned,ShoppingCart, Users2, Store, LogOut,Settings, Wallet, Users, Workflow, HandCoins, PiggyBank, Bell, Mail, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { motion } from "framer-motion";
import Securite from '../securite/Securite';
import SupportServiceApp from '../securite/SupportServiceApp';
import Parametres from '../parametres/Parametres';
import { isSessionStillValid } from '@/app/middleware';

export default function MobileBottomNav() {
    const [open, setOpen] = useState(false);
    const [openSecurite, setOpenSecurite] = useState(false);
    const [openServiceApp, setOpenServiceApp] = useState(false);
    const [openParametres, setOpenParametres] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const navItems = [
        { href: '/dashboard/compte', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
        { href: '/dashboard/notification', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
        { href: '/dashboard/gestion-products', label: 'Gestion des produits', icon: <Store className="h-5 w-5" /> },
        { href: '/dashboard/ecommandes', label: 'Mes commandes', icon: <ShoppingCart className="h-5 w-5" /> },
        { href: '/dashboard/enrollements', label: 'Enrollements', icon: <Users className="h-5 w-5" />, badge: 'Nouveau!' },
        { href: '/dashboard/liste-users', label: 'Liste des utilisateurs', icon: <Users2 className="h-5 w-5" /> },
        { href: '/dashboard/transaction', label: 'Transactions', icon: <HandCoins className="h-5 w-5" /> },
        { href: '/dashboard/reversement', label: 'Reversements', icon: <PiggyBank className="h-5 w-5" /> },
        { href: '/dashboard/configurations', label: 'configurations', icon: <Cog className="h-5 w-5" /> },
        { href: '/dashboard/decoupage', label: 'Decoupage', icon: <MapPinned className="h-5 w-5" /> },
        { href: '/dashboard/activite-speculation', label: 'Activites & Spéculations', icon: <Workflow className="h-5 w-5" /> },
        { href: '/dashboard/prix-du-marche', label: 'Prix du marché', icon: <HandCoins className="h-5 w-5" /> },
        { href: '/dashboard/contact', label: 'Contacts', icon: <Mail className="h-5 w-5" /> },

    ];

    const openParametresSheet = () => {
        setOpen(false);
        setOpenSecurite(false);
        setOpenServiceApp(false);
        setOpenParametres(true);
    };


    const getIsAuthenticated = async () => {
        const res = await isSessionStillValid()
        setIsAuthenticated(res)
    }

    useEffect(() => {
        getIsAuthenticated()
    }, [])

    return (

        <>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="sm:hidden ">
                        {open ? <PanelLeftClose className="h-8 w-8 " /> : <PanelLeftOpen className="h-8 w-8" />}
                    </Button>
                </SheetTrigger>

                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => { if (info.point.y > 100) setOpen(false); }}
                    className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto px-6 py-4 sm:hidden" >

                    {/* <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto my-4 cursor-pointer hover:bg-gray-400 transition" onClick={() => setOpen(false)} /> */}

                    <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl px-6 py-4 sm:hidden" >
                        {/* Drag bar */}
                        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

                        {/* Modes de paiement */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="text-sm font-semibold">Modes de paiement</div>
                                <div className="text-xs text-muted-foreground">Espèces</div>
                            </div>
                            <Wallet className="h-8 w-8 " />
                        </div>

                        {/* Options: Sécurité / Assistance / Paramètres */}
                        <div className="grid grid-cols-3 gap-4 mb-6">

                            <div className="flex flex-col items-center justify-center text-center text-xs text-muted-foreground">
                                <div onClick={isAuthenticated ? () => openParametresSheet() : undefined} className={`rounded-full p-2 ${isAuthenticated ? 'bg-gray-100 cursor-pointer' : 'bg-gray-200 cursor-not-allowed opacity-50'}`} >
                                    <Settings className="h-8 w-8 text-black" />
                                </div>
                                Paramètres
                            </div>

                        </div>

                        <Separator className="my-4" />

                        {/* Navigation */}
                        <nav className="flex flex-col gap-2">
                            {navItems.map(({ href, label, icon, badge }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted"
                                    onClick={() => setOpen(false)} >
                                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                        {icon}
                                        {label}
                                    </div>
                                    {badge && (
                                        <Badge variant="destructive" className="text-white text-xs">
                                            {badge}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        <Separator className="my-4" />

                        {/* Déconnexion */}
                        <Button variant="ghost" className="w-full flex justify-start text-red-600"
                            onClick={() => {
                                // TODO: ajouter ici la logique de logout si besoin
                                setOpen(false);
                            }}
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Se déconnecter du profil
                        </Button>
                    </SheetContent>

                </motion.div>

            </Sheet>

            <Securite onClose={() => setOpenSecurite(false)} isOpen={openSecurite} />
            <SupportServiceApp onClose={() => setOpenServiceApp(false)} isOpen={openServiceApp} />
            {/* Parametres */}
            <Parametres onClose={() => setOpenParametres(false)} isOpen={openParametres} />

        </>

    );
}
