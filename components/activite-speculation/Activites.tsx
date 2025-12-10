'use client';

import { useEffect, useState } from "react";
import { DistrictResponse } from "@/types/ApiReponse/ListeResponse";
import { getDistricts } from "@/api/services/decoupageServices";
import { DataTable } from '@/components/table/dataTable';
import { columns as columnDistricts } from "@/types/columns/districtColumns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploader } from "@/components/upload/FileUploader";
import { uploadFile } from "@/api/services/decoupageServices";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

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

export default function Activites() {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [activites, setActivites] = useState<DistrictResponse[]>([]);

    const [progresses, setProgresses] = useState<Record<string, Record<string, number>>>({});
    const [files, setFiles] = useState<Record<string, File[]>>({});

    const { handleSubmit, setValue, formState: { errors }, watch, } = useForm<FormDataSchema>({
        resolver: zodResolver(schema),
    });


    const getDistrict = async () => {
        try {
            const res = await getDistricts(currentPage, limit);

            if (res.statusCode === 200 && res.data) {
                setActivites(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getDistrict();
    }, [currentPage]);

    function handleChangeState(row: any, newStates: string[]) {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    }

    function handleUpdate(row: any) {

    }

    function handleDelete(row: any) {
    }

    const handleDeleteClick = async (id: string): Promise<void> => {
    };

    function handleNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            alert("Vous êtes déjà sur la dernière page.");
        }
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            alert("Vous êtes déjà sur la première page.");
        }
    }

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
        <>

            <div className="w-full overflow-x-auto">

                <Card>
                    <CardHeader>
                        <CardTitle>IMPORTER LES ACTIVITÉS EN EXCEL</CardTitle>
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

                <div className='mt-4'>
                    <h3 className="text-lg font-semibold">Liste des activités</h3>
                    <p className="text-sm text-gray-600">{activites.length} résultats trouvés</p>
                </div>

                <DataTable
                    columns={columnDistricts}
                    data={activites}
                    onChangeState={handleChangeState}
                    onUpdateData={handleUpdate}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                />

            </div>
        </>
    );

}
