'use client';

import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import Activites from "@/components/activite-speculation/Activites";
import Speculation from "@/components/activite-speculation/Speculation";

// Tabs
const tabs = ['Activites', 'Speculations'] as const;
type TabType = typeof tabs[number];

export default function Page() {
    const [activeTab, setActiveTab] = useState<TabType>('Activites');

    return (

        <div className="w-full overflow-x-auto">

            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                ESPACE DE GESTION DES PARAMÈTRES DU DÉCOUPAGE
            </div>

            <div>
                {/* Tabs */}
                <div className="flex flex-wrap justify-start gap-2 mt-4">
                    {tabs.map((tab) => (
                        <Button key={tab} className="flex-1 min-w-[140px] sm:flex-initial sm:w-auto" variant={activeTab === tab ? 'default' : 'outline'} onClick={() => setActiveTab(tab)}>
                            {tab}
                        </Button>
                    ))}
                </div>

                {/* Contenu dynamique */}
                <div className="mt-6">
                    {activeTab === 'Activites' && <Activites />}
                    {activeTab === 'Speculations' && <Speculation />}
                </div>
            </div>

        </div>
    );
}
