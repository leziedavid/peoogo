'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function DashboardBreadcrumb() {
    const pathname = usePathname();

    // Divise l'URL et filtre les segments vides
    const segments = pathname.split('/').filter(Boolean);

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = '/' + segments.slice(0, index + 1).join('/');

                    return (
                        <div key={href} className="flex items-center">
                            {index !== 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{capitalize(segment.replace(/-/g, ' '))}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>
                                            {capitalize(segment.replace(/-/g, ' '))}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
