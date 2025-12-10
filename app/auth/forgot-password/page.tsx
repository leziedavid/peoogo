'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { toast } from 'sonner';
import { signIn } from '@/api/services/auth';
import { LoginDto } from '@/types/ApiRequest/Auth';
import { Role } from '@/types/AllTypes';
import ForgotPassword from '@/components/form/forgot-password';

// Schéma de validation Zod pour la connexion
const LoginSchema = z.object({
    email: z.string().email("Email invalide").optional(),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
}).refine((data) => {
    // Au moins un identifiant doit être fourni
    return data.email || data.phoneNumber;
}, {
    message: "Email ou numéro de téléphone requis",
    path: ["email"],
});

export default function LoginPage() {

    const router = useRouter();

    // États pour le formulaire de connexion
    const [loginMode, setLoginMode] = useState('email'); // 'email' ou 'phone'
    const [phoneValue, setPhoneValue] = useState('');
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);

    // Configuration du formulaire
    const { register, handleSubmit, setValue, watch, formState: { errors },reset,clearErrors,
        } = useForm<z.infer<typeof LoginSchema>>({
            resolver: zodResolver(LoginSchema),
            mode: 'onChange',
        });

    // Gestion du changement de mode (email/téléphone)
    useEffect(() => {
        // Nettoyer les erreurs quand on change de mode
        clearErrors();
        // Réinitialiser les champs selon le mode
        if (loginMode === 'email') {
            setValue('phoneNumber', '');
            setPhoneValue('');
            setPhoneValid(false);
            setPhoneTouched(false);
        } else {
            setValue('email', '');
        }
    }, [loginMode, setValue, clearErrors]);

    // Synchroniser la valeur du téléphone dans react-hook-form
    useEffect(() => {
        if (loginMode === 'phone') {
            setValue('phoneNumber', phoneValue, { shouldValidate: true });
        }
    }, [phoneValue, setValue, loginMode]);

    // Gestion du changement de numéro de téléphone
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setPhoneValue(e.target.value);
        setPhoneValid(true); // Vous pouvez ajouter une vraie validation ici
        if (!phoneTouched) setPhoneTouched(true);
    };

    // Validation du formulaire de connexion
    const isLoginFormValid = () => {

        const passwordValue = watch('password');

        if (loginMode === 'email') {
            const emailValue = watch('email');
            return emailValue && passwordValue && !errors.email && !errors.password;

        } else {
            const phoneNumberValue = watch('phoneNumber');
            // console.log(phoneNumberValue);
            return phoneNumberValue && passwordValue && phoneValid && !errors.phoneNumber && !errors.password;
        }
    };


    // Typage de la fonction
    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        
        console.log(data);
        // Vérification du numéro si mode téléphone
        if (loginMode === 'phone' && !phoneValid) {
            toast.error('Numéro de téléphone invalide')
            return
        }

        // Construction des données selon le mode
        const loginData: Partial<LoginDto> = { password: data.password, ...(loginMode === 'email' ? { email: data.email } : { phoneNumber: data.phoneNumber }), }
        console.log(loginData);

        try {

            const apiResponse = await signIn(loginData)

            if (apiResponse.statusCode === 200 && apiResponse.data) {

                const { access_token, refresh_token, user } = apiResponse.data
                // Enregistrement des tokens
                localStorage.setItem('access_token', access_token)
                localStorage.setItem('refresh_token', refresh_token)
                document.cookie = `token=${access_token}; path=/`
                toast.success('Connexion réussie !')

                // ✅ Redirection conditionnelle si une action est stockée
                const action = localStorage.getItem('action');
                if (action === 'createOrder') {
                    localStorage.removeItem('action');
                    router.push('/trajets'); // ou autre page
                    return; // ⛔ Éviter la suite
                }

                switch (user.role) {
                    case Role.ADMIN:
                        router.push('/dashboard/admin')
                        break
                    case Role.AGENT_ENROLEUR:
                        router.push('/dashboard/livreur')
                    case Role.AGENT_CONTROLE:
                        router.push('/dashboard/livreur')
                    case Role.PRODUCTEUR:
                        router.push('/dashboard/livreur')
                        break
                    default:
                        router.push('/dashboard/compte') // Tous les autres rôles vont ici
                        break
                }

                reset() // Réinitialise le formulaire
                
            } else if (apiResponse.statusCode === 400) {

                toast.error(apiResponse.message || 'Informations incorrectes')

            } else if (apiResponse.statusCode === 500) {

                toast.error('Erreur serveur, veuillez réessayer')

            } else if (apiResponse.statusCode === 401) {

                toast.error(apiResponse.message || 'Identifiants invalides')
            }

            else {
                toast.error('Erreur inconnue')
            }
        } catch (error) {

            console.error('Erreur lors de la connexion :', error)
            toast.error('Une erreur est survenue lors de la connexion')
        }
    }



    return (


        <>

            <div className="flex min-h-full h-screen">
                <div className="flex flex-1 flex-col justify-center py-0 px-6 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="">
                            <ForgotPassword />
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


