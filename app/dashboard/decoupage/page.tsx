'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import District from "@/components/decoupage/District";
import Region from "@/components/decoupage/Region";
import Departements from "@/components/decoupage/Departements";
import SousPrefectures from "@/components/decoupage/SousPrefectures";
import Localites from "@/components/decoupage/Localites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { FileUploader } from "@/components/upload/FileUploader";
import { uploadFile } from "@/api/services/decoupageServices";
import { toast } from "sonner";

// Tabs
const tabs = ['Decoupage', 'Districts', 'Region', 'Department', 'SousPrefecture', 'Localite'] as const;
type TabType = typeof tabs[number];

// ✅ Zod schema : fichiers optionnel, mais validation obligatoire
const schema = z.object({
    fichiers: z
        .any()
        .refine((file) => file instanceof File, {
            message: "Un fichier est requis",
        })
        .refine((file) =>
            file?.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            {
                message: "Seuls les fichiers .xlsx sont autorisés",
            }
        )
        .optional(), // ← fichiers est optionnel au niveau du type TS
});

type FormDataSchema = z.infer<typeof schema>;

export default function Page() {
    const [activeTab, setActiveTab] = useState<TabType>('Districts');
    const [progresses, setProgresses] = useState<Record<string, Record<string, number>>>({});
    const [files, setFiles] = useState<Record<string, File[]>>({});

    const {
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<FormDataSchema>({
        resolver: zodResolver(schema),
    });

    const selectedFile = watch("fichiers");

    const handleValueChange = (name: string, fileList: File[]) => {
        setFiles((prev) => ({ ...prev, [name]: fileList }));
        setValue(name as any, fileList[0] ?? undefined, { shouldValidate: true });
    };

    const handleUpload = async (name: string, files: File[]) => {
        const fileProgress: Record<string, number> = {};
        for (const file of files) {
            fileProgress[file.name] = 0;
            setProgresses((prev) => ({
                ...prev,
                [name]: { ...(prev[name] || {}), ...fileProgress },
            }));
            await new Promise((res) => setTimeout(res, 300));
            fileProgress[file.name] = 100;
            setProgresses((prev) => ({
                ...prev,
                [name]: { ...(prev[name] || {}), ...fileProgress },
            }));
        }
    };

    // ➤ ENVOI DU FORMULAIRE
    const onSubmit = async (data: FormDataSchema) => {

        if (!data.fichiers) {
            toast.error("Veuillez sélectionner un fichier .xlsx");
            return;
        }

        const formData = new FormData();
        formData.append("file", data.fichiers);

        const res = await uploadFile(formData);

        if (res.statusCode == 200) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }

    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                ESPACE DE GESTION DES PARAMÈTRES DU DÉCOUPAGE
            </div>

            <div>
                {/* Tabs */}
                <div className="flex flex-wrap justify-start gap-2 mt-4">
                    {tabs.map((tab) => (
                        <Button key={tab} className="flex-1 min-w-[140px] sm:flex-initial sm:w-auto" variant={activeTab === tab ? 'default' : 'outline'} onClick={() => setActiveTab(tab)}>
                            {tab}
                        </Button>
                    ))}
                </div>

                {/* Contenu dynamique */}
                <div className="mt-6">
                    {activeTab === 'Decoupage' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>IMPORTER LE DECOUPAGE EN EXCEL</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Camera className="h-5 w-5 text-gray-600" />
                                        <h3 className="font-semibold">Fichier Excel obligatoire (.xlsx)</h3>
                                    </div>

                                    <FileUploader
                                        name="fichiers"
                                        multiple={false}
                                        value={files}
                                        onValueChange={handleValueChange}
                                        onUpload={handleUpload}
                                        progresses={progresses}
                                    />

                                    {errors.fichiers?.message && (
                                        <p className="text-sm text-red-500">{String(errors.fichiers.message)}</p>
                                    )}


                                    {/* Bouton envoyer */}
                                    <div className="mt-4">
                                        <Button onClick={handleSubmit(onSubmit)} disabled={!selectedFile}>
                                            Envoyer
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'Districts' && <District />}
                    {activeTab === 'Region' && <Region />}
                    {activeTab === 'Department' && <Departements />}
                    {activeTab === 'SousPrefecture' && <SousPrefectures />}
                    {activeTab === 'Localite' && <Localites />}
                </div>
            </div>
        </div>
    );
}
