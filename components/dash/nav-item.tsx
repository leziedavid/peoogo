import Link from 'next/link';
import { ReactNode } from 'react';

export function NavItem({
    href,
    label,
    children,
    collapsed
}: {
    href: string;
    label: string;
    children: ReactNode;
    collapsed?: boolean;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
        >
            {children}
            {!collapsed && <span className="ml-2">{label}</span>}
        </Link>
    );
}
