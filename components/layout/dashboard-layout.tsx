'use client';

import { useState } from 'react';
import DesktopNav from './desktop-nav';
import MainHeader from './main-header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <DesktopNav collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={`flex flex-col transition-all duration-300 sm:gap-4 sm:py-4 ${collapsed ? 'sm:pl-20' : 'sm:pl-64'}`}>
                <MainHeader setCollapsed={setCollapsed} collapsed={collapsed} />
                <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                    {children}
                </main>
            </div>
        </div>
    );
}
