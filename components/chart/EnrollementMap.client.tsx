'use client';

import dynamic from 'next/dynamic';
const EnrollementMap = dynamic(() => import('./EnrollementMap'), {
    ssr: false,
});

export default EnrollementMap;
