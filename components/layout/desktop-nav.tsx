'use client';

import Link from 'next/link';
import { Award, Bell, Cog, HandCoins, Home, Mail, PanelLeft, PiggyBank,ShoppingCart, Store, Users, Users2, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavItem } from '../dash/nav-item';
import { useEffect } from 'react';
import { isSessionStillValid } from '@/app/middleware';
import Image from 'next/image';  // Import de Image de Next.js
const navItems = [
    { href: '/dashboard/compte', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { href: '/dashboard/notification', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { href: '/dashboard/gestion-products', label: 'Gestion des produits', icon: <Store className="h-5 w-5" /> },
    { href: '/dashboard/ecommandes', label: 'Mes commandes', icon: <ShoppingCart className="h-5 w-5" /> },
    { href: '/dashboard/enrollements', label: 'Enrollements', icon: <Users className="h-5 w-5" /> },
    { href: '/dashboard/liste-users', label: 'Liste des utilisateurs', icon: <Users2 className="h-5 w-5" /> },
    { href: '/dashboard/transaction', label: 'Transactions', icon: <HandCoins className="h-5 w-5" /> },
    { href: '/dashboard/reversement', label: 'Reversements', icon: <PiggyBank className="h-5 w-5" /> },
    { href: '/dashboard/configurations', label: 'configurations', icon: <Cog className="h-5 w-5" /> },
    { href: '/dashboard/activite-speculation', label: 'Activites & Spéculations', icon: <Workflow className="h-5 w-5" /> },
    { href: '/dashboard/prix-du-marche', label: 'Prix du marché', icon: <Award className="h-5 w-5" /> },
    { href: '/dashboard/contact', label: 'Contacts', icon: <Mail className="h-5 w-5" /> },
];

export default function DesktopNav({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (value: boolean) => void; }) {

    // const [isAuthenticated, setIsAuthenticated] = useState(false)
    const getIsAuthenticated = async () => {
        const res = await isSessionStillValid()
        // setIsAuthenticated(res)
    }
    useEffect(() => {
        getIsAuthenticated()
    }, [])


    return (

        <>

            <aside className={`fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} sm:flex`} >
                <div className="flex justify-between p-2"> 
                    <Link href="/" className="flex h-10 w-10 justify-center rounded-full bg-primary text-primary-foreground" >
                        <Image src="/logos/Peoogo-01.png" alt="logo" width={180} height={180} className="object-contain max-h-16 md:max-h-20 px-2" priority unoptimized />
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground">
                        <PanelLeft className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex flex-col gap-4 px-2 sm:py-5">
                    {navItems.map(({ href, label, icon }) => (
                        <NavItem key={href} href={href} label={label} collapsed={collapsed}>
                            {icon}
                        </NavItem>
                    ))}
                </nav>
            </aside>


        </>

    );


}
