'use client';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { PhoneInput } from '@/components/phone/phone-input';
import Image from 'next/image';
import { toast } from 'sonner';
import { UserFormSchema, UserFormValues, Role, TypeCompte, UserStatus } from '@/types/ApiRequest/User'; // Types et énumérations définis côté front
import UsersForms from '@/components/form/UsersForms';

export default function SignupPage() {

    // initialValue
    const [initialValue, setInitialValue] = useState<UserFormValues | null>(null);

    return (

        <>

            <div className="flex min-h-full h-screen">

                <div className="flex flex-1 flex-col justify-center py-0 px-2 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96 mt-10">
                        <div>
                            <h3 className="text-5xl font-bold tracking-tight mb-4 text-center mb-8"> Ouvrir un compte</h3>
                        </div>
                        <div className="">
                            <UsersForms initialValue={initialValue ?? undefined} />
                        </div>

                    </div>
                </div>

                <div className="relative hidden w-0 flex-1 lg:block">
                    <div className="absolute inset-0 h-full w-full">
                        <Image src="/login.jpg" alt="" fill className="object-cover brightness-50" style={{ objectFit: 'cover' }} />
                    </div>
                </div>
            </div>
        </>

    );
}
