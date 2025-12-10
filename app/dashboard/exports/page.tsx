"use client";

import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CalendarIcon, FileDownIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent, } from "@/components/ui/popover";
import { exportEnrollementsExcel, exportUsersExcel } from "@/api/services/authService";
import { AllRole, StatusDossier, TypeCompte } from "@/types/AllTypes";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// ----------------------
// Types & Schemas
// ----------------------
type ExportType = "users" | "enrollements";

interface UsersFilter {
    startDate?: string;
    endDate?: string;
    typeCompte?: string;
}

interface EnrollementsFilter {
    statusDossier?: string;
    startDate?: string;
    endDate?: string;
}

const baseDateSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
});

const usersSchema = baseDateSchema.extend({
    typeCompte: z.nativeEnum(TypeCompte).optional(),
    role: z.nativeEnum(AllRole).optional(),
});

const enrollementsSchema = baseDateSchema.extend({
    statusDossier: z.nativeEnum(StatusDossier).optional(),
});

// ----------------------
// Date Picker Field
// ----------------------
function DatePickerField({ control, name, label }: { control: any; name: string; label: string }) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <div>
                    <label className="block mb-1 font-medium">{label}</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal" >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "dd/MM/yyyy") : <span>Choisir une date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="w-[300px] h-[300px]" />
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        />
    );
}

// ----------------------
// Composant principal
// ----------------------
export default function ExportPage() {
    const [exportType, setExportType] = useState<ExportType | "">("");

    const methods = useForm<any>({
        resolver: zodResolver(
            exportType === "users" ? usersSchema : enrollementsSchema
        ),
        defaultValues: {},
    });

    const { handleSubmit, reset, formState: { isSubmitting }, control } = methods;

    const onSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                startDate: values.startDate ? format(values.startDate, "yyyy-MM-dd") : undefined,
                endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : undefined,
            };

            console.log("payload", payload);

            if (exportType === "users") {
                await exportUsersExcel(payload as UsersFilter);
            } else if (exportType === "enrollements") {
                await exportEnrollementsExcel(payload as EnrollementsFilter);
            }

            reset();
        } catch (error) {
            console.error("Erreur lors de l'export :", error);
        }
    };

    return (

        <div className="w-full overflow-x-auto">

            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                ESPACE D'EXPORTATION DES DONNEES
            </div>

            <Card className="max-w-2xl mx-auto w-full mt-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileDownIcon className="w-5 h-5" />
                        Exportation de données
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Choix du type d'export */}
                    <div className="mb-6">
                        <Select onValueChange={(value) => setExportType(value as ExportType)} >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionnez un type d'export" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="users">Utilisateurs</SelectItem>
                                <SelectItem value="enrollements">Enrôlements</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Formulaire dynamique */}
                    {exportType && (
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Champs communs */}
                                <DatePickerField control={control} name="startDate" label="Date de début" />
                                <DatePickerField control={control} name="endDate" label="Date de fin" />

                                {/* Champs spécifiques */}


                                {exportType === "users" && (
                                    <>
                                        <FormField
                                            control={control}
                                            name="typeCompte"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type de compte</FormLabel>
                                                    <Select
                                                        onValueChange={(value) =>
                                                            // Convertir la string en TypeCompte avant de la passer à Zod
                                                            field.onChange(TypeCompte[value as keyof typeof TypeCompte])
                                                        }
                                                        value={field.value as unknown as string}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Sélectionner" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.keys(TypeCompte)
                                                                .filter((key) => isNaN(Number(key))) // garder seulement les noms
                                                                .map((key) => (
                                                                    <SelectItem key={key} value={key}>
                                                                        {key}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Roles</FormLabel>
                                                    <Select onValueChange={(value) => field.onChange(AllRole[value as keyof typeof AllRole])}
                                                        value={field.value as unknown as string}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Sélectionner" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.keys(AllRole)
                                                                .filter((key) => isNaN(Number(key))) // garder seulement les noms
                                                                .map((key) => (
                                                                    <SelectItem key={key} value={key}>
                                                                        {key}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </>
                                )}

                                {exportType === "enrollements" && (
                                    <FormField
                                        control={control}
                                        name="statusDossier"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Statut dossier</FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        // Convertir la string en StatusDossier avant de la passer à Zod
                                                        field.onChange(StatusDossier[value as keyof typeof StatusDossier])
                                                    }
                                                    value={field.value as unknown as string}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.keys(StatusDossier)
                                                            .filter((key) => isNaN(Number(key)))
                                                            .map((key) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {key}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}


                                {/* {exportType === "users" && (
                                    <FormField control={control} name="typeCompte" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type de compte</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(value as unknown as TypeCompte)} value={field.value as unknown as string} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(TypeCompte)
                                                        .filter(key => isNaN(Number(key))) // garder seulement les noms
                                                        .map((key) => (
                                                            <SelectItem key={key} value={key}>
                                                                {key}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                )}

                                {exportType === "enrollements" && (
                                    <FormField control={control} name="statusDossier" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Statut dossier</FormLabel>
                                            <Select onValueChange={(value) => field.onChange(value as unknown as StatusDossier)} value={field.value as unknown as string} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(StatusDossier)
                                                        .filter(key => isNaN(Number(key))) // garder seulement les noms
                                                        .map((key) => (
                                                            <SelectItem key={key} value={key}>
                                                                {key}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                )} */}

                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Exportation..." : "Exporter"}
                                </Button>
                            </form>
                        </FormProvider>
                    )}
                </CardContent>
            </Card>

        </div>

    );
}
