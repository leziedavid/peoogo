"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarClock, Mail, MapPin, MoveRight, Phone, User, MessageSquare, } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getPhoneData, PhoneInput } from "../phone/phone-input";
import { create } from "@/api/services/contactService";

// Objets spécifiques au domaine agricole
const objetsAgricoles = [
    { value: "achat_produits", label: "Achat de produits agricoles" },
    { value: "vente_produits", label: "Vente de produits agricoles" },
    { value: "formation_agricole", label: "Formation et accompagnement agricole" },
    { value: "financement_agricole", label: "Financement et crédit agricole" },
    { value: "equipements_agricoles", label: "Équipements et matériels agricoles" },
    { value: "conseil_technique", label: "Conseil technique et agronomique" },
    { value: "certification_bio", label: "Certification biologique" },
    { value: "transformation_produits", label: "Transformation de produits agricoles" },
    { value: "marche_producteurs", label: "Accès au marché pour producteurs" },
    { value: "innovation_agricole", label: "Innovation et technologie agricole" },
    { value: "partenariat_cooperatives", label: "Partenariat avec coopératives" },
    { value: "assurance_agricole", label: "Assurance et protection des cultures" },
    { value: "autre", label: "Autre" }
];

const FormSchema = z.object({
    phone: z.string().min(1, "Le numéro de téléphone est obligatoire"),
    nomPrenom: z.string().min(2, "Le nom et prénom sont obligatoires"),
    email: z.string().email("Adresse email invalide"),
    objets: z.enum(objetsAgricoles.map(o => o.value) as [string, ...string[]]).refine((val) => !!val, { message: "Veuillez sélectionner un objet de contact" }),
    contents: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});


type FormValues = z.infer<typeof FormSchema>;

interface Props { }

const Forms: React.FC<Props> = () => {

    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            phone: "",
            nomPrenom: "",
            email: "",
            objets: "achat_produits",
            contents: "",
        },
    });

    // Rendu uniquement côté client pour éviter l'hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    async function onSubmit(data: FormValues) {
        try {
            const phoneData = getPhoneData(data.phone);
            if (!phoneData.isValid) {
                form.setError("phone", {
                    type: "manual",
                    message: "Numéro de téléphone invalide",
                });
                return;
            }

            setLoading(true);

            const contactData = {
                phone: data.phone,
                nomPrenom: data.nomPrenom.trim(),
                email: data.email.toLowerCase().trim(),
                objets: data.objets,
                contents: data.contents.trim(),
                timestamp: new Date().toISOString(),
                source: "contact_form_agricole"
            };

            console.log("Données à envoyer:", contactData);

            // Simulation API
            const res = await create(contactData);

            if (res.statusCode === 201) {
                toast.success("Votre message a bien été envoyé avec succès !");
                form.reset();
            } else {
                toast.error("Une erreur est survenue lors de l'envoi du message");
            }

        } catch (error) {
            toast.error("Une erreur est survenue lors de l'envoi du message");

        } finally {
            setLoading(false);
        }
    }

    if (!mounted) return null; // Ne rien render côté serveur

    return (
        <div className="md:container md:mx-auto mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Informations */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-lg px-4 py-6">
                        <div className="bg-gray-50 w-full h-full rounded-xl p-6 md:p-12 flex flex-col justify-between">
                            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">Contactez-nous</h2>
                            <p className="text-gray-900 mb-6">Les champs obligatoires sont marqués (*)</p>

                            <div className="bg-gray-50 md:w-4/5 space-y-6 p-4 rounded-lg">
                                <div className="flex gap-4 border-b pb-4">
                                    <MapPin className="mt-0 text-[#B07B5E]" />
                                    <div className="font-medium">FASO 2000 / FASO 2000</div>
                                </div>
                                <div className="flex gap-4 border-b pb-4">
                                    <Phone className="mt-0 text-[#B07B5E]" />
                                    <div className="font-medium">+226 66061030 / 78624264 / 70635512</div>
                                </div>
                                <div className="flex gap-4 border-b pb-4">
                                    <Mail className="mt-0 text-[#B07B5E]" />
                                    <div className="font-medium">peoogo@gmail.com</div>
                                </div>
                                <div className="flex gap-4">
                                    <CalendarClock className="mt-2 text-[#B07B5E]" />
                                    <div className="font-medium">OUVERT DE 07H00 - 23H00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-lg px-4 py-6">
                        <div className="bg-gray-50 w-full h-full rounded-xl p-6 md:p-12">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between space-y-4">

                                    <FormField
                                        control={form.control}
                                        name="nomPrenom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-[#022d13]" />
                                                    Nom et Prénom *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Entrez votre nom complet" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Email *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="votre.email@exemple.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    Téléphone *
                                                </FormLabel>
                                                <FormControl>
                                                    <PhoneInput value={field.value} onChange={field.onChange} placeholder="Numéro de téléphone" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="objets"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Objet de votre contact *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Sélectionnez l'objet" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {objetsAgricoles.map(objet => (
                                                            <SelectItem key={objet.value} value={objet.value}>{objet.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contents"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4" />
                                                    Votre message *
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Décrivez votre demande en détail..." className="min-h-[100px]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="gap-4 w-full mt-6 bg-[#B07B5E] hover:bg-[#022d13] hover:text-white" disabled={loading}>
                                        {loading ? "Envoi en cours..." : "Envoyer le message"}
                                        <MoveRight className="w-4 h-4" />
                                    </Button>

                                </form>
                            </Form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Forms;
