"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OTPInput } from "./OTPInput";
import { resetPassword, sendForgotPasswordCode, verifyCode } from "@/api/services/auth";
// import { sendForgotPasswordCode, verifyCode, resetPassword } from "@/api/services/auth"; // à décommenter plus tard

const emailSchema = z.object({
    email: z.string().email("Email invalide"),
});

const passwordSchema = z.object({
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(6, "Confirmation requise"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// --- Fonctions simulées pour le moment ---
const fakeServerCode = "1234";

// const sendForgotPasswordCode = async (email: string) => {
//     return new Promise<{ statusCode: number; code?: string; message?: string }>((resolve) =>
//         setTimeout(() => resolve({ statusCode: 200, code: fakeServerCode }), 1000)
//     );
// };

// const verifyCode = async (email: string, code: string) => {
//     return new Promise<{ statusCode: number; message?: string }>((resolve) =>
//         setTimeout(() => resolve(code === fakeServerCode ? { statusCode: 200 } : { statusCode: 400, message: "Code incorrect" }), 500)
//     );
// };

// const resetPassword = async (email: string, password: string) => {
//     return new Promise<{ statusCode: number; message?: string }>((resolve) =>
//         setTimeout(() => resolve({ statusCode: 200 }), 500)
//     );
// };

export default function ForgotPassword() {

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    // Formulaire email
    const {
        register: registerEmail,
        handleSubmit: handleSubmitEmail,
        formState: { errors: emailErrors, isSubmitting: isSubmittingEmail },
    } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

    // Formulaire nouveau mot de passe
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

    const onSubmitEmail = async (data: EmailFormValues) => {
        try {
            const res = await sendForgotPasswordCode(data.email);
            if (res.statusCode === 200 && res.data?.code) {
                toast.success("Code envoyé à votre email !");
                setEmail(data.email);
                setStep(2);
            } else {
                toast.error(res.message || "Erreur lors de l'envoi du code");
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi du code :", err);
            toast.error("Erreur serveur");
        }
    };

    const onSubmitPassword = async (data: PasswordFormValues) => {
        try {
            const res = await resetPassword(email, data.password);
            if (res.statusCode === 200) {
                toast.success("Mot de passe réinitialisé !");
                setStep(1);
            } else {
                toast.error(res.message || "Erreur lors de la réinitialisation");
            }
        } catch (err) {
            console.error("Erreur lors de la réinitialisation :", err);
            toast.error("Erreur serveur");
        }
    };

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4 text-center">Mot de passe oublié</h1>

            {step === 1 && (
                <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Votre email"
                        {...registerEmail("email")}
                    />
                    {emailErrors.email && <p className="text-red-600 text-sm">{emailErrors.email.message}</p>}
                    <Button type="submit" className="w-full bg-[#B07B5E] hover:bg-green-900" disabled={isSubmittingEmail}>
                        {isSubmittingEmail ? "Envoi..." : "Envoyer le code"}
                    </Button>
                </form>
            )}

            {step === 2 && (
                <div className="space-y-4 text-center">
                    <p className="text-gray-600">Entrez le code reçu par email</p>
                    <OTPInput
                        length={4}
                        onComplete={async (code) => {
                            try {
                                const res = await verifyCode(email, code);
                                if (res.statusCode === 200) {
                                    toast.success("Code vérifié !");
                                    setStep(3);
                                } else {
                                    toast.error("Code incorrect !");
                                }
                            } catch {
                                toast.error("Erreur serveur");
                            }
                        }}
                    />
                    <Button type="button" className="mt-4 w-full bg-[#B07B5E] hover:bg-green-900" onClick={() => setStep(1)}>
                        Retour
                    </Button>
                </div>
            )}

            {step === 3 && (
                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        {...registerPassword("password")}
                    />
                    {passwordErrors.password && <p className="text-red-600 text-sm">{passwordErrors.password.message}</p>}

                    <Input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        {...registerPassword("confirmPassword")}
                    />
                    {passwordErrors.confirmPassword && <p className="text-red-600 text-sm">{passwordErrors.confirmPassword.message}</p>}

                    <Button type="submit" className="w-full bg-[#B07B5E] hover:bg-green-900" disabled={isSubmittingPassword}>
                        {isSubmittingPassword ? "Validation..." : "Réinitialiser le mot de passe"}
                    </Button>
                </form>
            )}
        </div>
    );
}
