"use client"

import MobileNav from './mobile-nav';
import DashboardBreadcrumb from './dashboard-breadcrumb';
import { User } from '../dash/user';
import { SearchInput } from '../dash/search';

export default function MainHeader({ }: {
    setCollapsed: (value: boolean) => void;
    collapsed: boolean;

}) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumb />
            <SearchInput />
            <User />
        </header>
    );
}
