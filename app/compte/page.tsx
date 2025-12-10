'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    Lock,
    MenuIcon,
    User,
    Package,
    PlusSquare,
    ShoppingCart,
    ClipboardList,
    Heart,
    Star,
    Settings,
    MapPin,
    CalendarCheck,
    Eye
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@radix-ui/react-switch';
import { Label } from '@/components/ui/label';
import HeaderMarket from '@/components/market/HeaderMarket';



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

// interface ProductListProps {
//     products: Product[];
// }

export default function CataloguePage() {

    const [isMobile, setIsMobile] = useState(false);

    const products: Product[] = [
        {
            id: 1,
            nom: 'YACE',
            prix: '105 F CFA /KG',
            poids: '23 KG',
            localisation: 'Gbéké, Botro',
            publie: '24 avr. 2025 17:55',
            expire: '24 mai 2025 00:00',
            image: '/travailleurs.jpg',
            isActive: true,
            location: 'Gbéké, Botro',
            publishedAt: '24 avr. 2025 17:55',
            expiresAt: '24 mai 2025 00:00'
        },
        {
            id: 2,
            nom: 'YACE',
            prix: '210 F CFA /KG',
            poids: '2 KG',
            localisation: 'Loh-djiboua, Lakota, Lakota',
            publie: '6 mars 2025 18:10',
            expire: 'Invalid date',
            image: '/travailleurs.jpg',
            isActive: true,
            location: 'Loh-djiboua, Lakota, Lakota',
            publishedAt: '6 mars 2025 18:10',
        }
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const [activeStates, setActiveStates] = useState(() =>
        products.reduce((acc, product) => {
            acc[product.id] = product.isActive;
            return acc;
        }, {} as Record<string | number, boolean>)
    );

    function handleToggleActive(id: number | string) {
        setActiveStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }


    return (
        <>
            <HeaderMarket />
            <div className={`min-h-[calc(100vh_-_56px)] py-20`}>

                <div className="grid grid-cols-1 md:grid-cols-12">

                    {/* Sidebar Desktop */}
                    {!isMobile && (
                        <aside className="col-span-3 px-4 py-6">
                            <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                <div className="p-4">
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="w-20 h-20 rounded-full border-4 border-orange-700 flex items-center justify-center text-[#022d13] font-bold text-2xl mb-2">
                                            p
                                        </div>
                                        <div className="text-lg font-bold text-gray-800 text-center">Dev Mobisoft</div>
                                        <div className="text-sm text-gray-500 text-center">Producteur</div>
                                    </div>

                                    <div className="space-y-2">
                                        {[
                                            { title: 'Mon catalogue', desc: 'Gérez vos produits', icon: <Package className="size-6" /> },
                                            { title: 'Commandes', desc: 'Produits commandés', icon: <ClipboardList className="size-6" /> },
                                            { title: 'Achats et ventes', desc: 'Suivi des transactions', icon: <ShoppingCart className="size-6" /> },
                                            { title: 'Paramètres', desc: 'Compte et sécurité', icon: <Settings className="size-6" /> }
                                        ].map((item, i) => (
                                            <div key={i} className="group relative flex gap-x-4 rounded-lg p-3 hover:bg-gray-50">
                                                <div className="flex-none flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-white text-gray-600 group-hover:text-[#022d13]">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{item.title}</div>
                                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
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
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button className="w-28 h-12 bg-[#022d13] text-white text-sm rounded-full shadow-lg">
                                            <MenuIcon className="mr-2 h-5 w-5" /> Menu
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="rounded-t-2xl p-6">
                                        <div className="flex flex-col items-center mb-4">
                                            <div className="w-16 h-16 rounded-full border border-green-600 flex items-center justify-center text-[#022d13] font-bold text-xl">
                                                e
                                            </div>
                                            <div className="text-sm font-bold text-gray-800 mt-2">DAVID TRA BI</div>
                                            <div className="text-xs text-gray-500">Fournisseur</div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { title: 'Mon profil', icon: <User size={20} /> },
                                                { title: 'Mon catalogue', icon: <Package size={20} />, active: true },
                                                { title: 'Publier une offre', icon: <PlusSquare size={20} /> },
                                                { title: 'Achats et ventes', icon: <ShoppingCart size={20} /> },
                                                { title: 'Commandes', icon: <ClipboardList size={20} /> },
                                                { title: 'Demandes', icon: <ClipboardList size={20} /> },
                                                { title: 'Favoris', icon: <Heart size={20} /> },
                                                { title: 'Notes produits', icon: <Star size={20} /> },
                                                { title: 'Paramètres', icon: <Settings size={20} /> }
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex items-center gap-3 p-3 rounded-lg ${item.active ? 'bg-[#022d13] text-white' : 'text-gray-800 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {item.icon}
                                                    <span className="text-sm font-medium">{item.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        )}


                        <div className="text-3xl font-bold mb-4">MON COMPTE</div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <Button className="bg-orange-600 hover:bg-[#022d13] text-white">MES COMMANDES (2)</Button>
                            <Button variant="outline">HISTORIQUE DES COMMANDES</Button>
                            <Button variant="outline">COMMANDE INDISPONIBLE</Button>
                        </div>

                        {/* Liste Produits */}
                        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                            <h1 className="text-xl font-bold mb-6">LISTE DES COMMANDES</h1>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    {/* Header row */}
                                    <div className="grid grid-cols-6 items-center font-bold text-sm px-6 py-2 bg-gray-100 border rounded-md text-gray-600">
                                        <div>Produit</div>
                                        <div>Nom / Prix / Qté</div>
                                        <div>Localisation</div>
                                        <div>Dates</div>
                                        <div>Statut</div>
                                        <div>Action</div>
                                    </div>

                                    {products.map((product) => (
                                        <Card
                                            key={product.id}
                                            className="grid grid-cols-6 items-center px-6 py-4 gap-4 shadow-sm border hover:shadow-md transition"
                                        >
                                            {/* Colonne 1 : Image */}
                                            <div className="flex items-center">
                                                <Image
                                                    src={product.image}
                                                    alt={product.nom}
                                                    width={72}
                                                    height={72}
                                                    className="rounded-md object-cover w-20 h-20 border" unoptimized
                                                />
                                            </div>

                                            {/* Colonne 2 : Nom / Prix / Qté */}
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-gray-900 text-base">{product.nom}</p>
                                                <p className="text-sm text-gray-700">{product.prix} • {product.poids}</p>
                                            </div>

                                            {/* Colonne 3 : Localisation */}
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                                <span className="text-sm font-medium text-gray-800">{product.location}</span>
                                            </div>

                                            {/* Colonne 4 : Dates */}
                                            <div className="flex flex-col gap-1 text-sm">
                                                <span><strong>Pub:</strong> {product.publishedAt}</span>
                                                <span><strong>Exp:</strong> {product.expiresAt}</span>
                                            </div>

                                            {/* Colonne 5 : Statut */}
                                            <div className="flex items-center space-x-2">
                                                <Switch id={`airplane-mode-${product.id}`} checked={activeStates[product.id]} onCheckedChange={() => handleToggleActive(product.id)} />
                                                {/* <Label htmlFor={`airplane-mode-${product.id}`}>Airplane Mode</Label> */}
                                            </div>


                                            {/* Colonne 6 : Action */}
                                            <div>
                                                <Button variant="outline" size="icon">
                                                    <Eye className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6">
                            <span className="text-sm text-gray-600">Total 2</span>
                            <div className="flex items-center gap-2">
                                <select className="border rounded p-1 text-sm">
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </select>
                                <Button size="icon" variant="outline">1</Button>
                            </div>
                        </div>

                    </main>
                </div>
            </div>

        </>

    );
}