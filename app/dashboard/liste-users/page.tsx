"use client";

import { DataTable } from "@/components/table/dataTable";
import { getUserColumns } from "@/types/columns/users-columns";
import { User } from "@/types/ApiReponse/UsersResponse";
import { useEffect, useState } from "react";
import { filterUsersmodeCarte, filterUsersmodeGraphique, filterUsersTableau, getAllUser } from "@/api/services/authService";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import FilesPreviewDialog from "@/components/form/filesPreviewDialog";
import FilterUser from "@/components/filter/FilterUser";
import Image from 'next/image';
import { EnrollementStatByDate, GeoCoord } from "@/types/ApiReponse/StatistiquesEnrollementResponse";
import { toast } from "sonner";
import AddUsersForms from "@/components/form/AddUsersForms";
import { Role, TypeCompte, UserFormValues, UserStatus } from "@/types/ApiRequest/User";
import { deleteUser } from "@/api/services/auth";
import DeleteDialog from '@/components/Dialog/DeleteDialog';
import EnrollementGraph from "@/components/chart/EnrollementGraph";
// import EnrollementMap from "@/components/chart/EnrollementMap";
import dynamic from "next/dynamic";
const EnrollementMap = dynamic(() => import("@/components/chart/EnrollementMap"), {
    ssr: false,
});

export default function Page() {

    // useOrderSocket()

    const [user, setUser] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<UserFormValues>();
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [modeAffichage, setModeAffichage] = useState<'tableau' | 'carte' | 'graphique'>('tableau');
    const [resultsGraphique, setResultsGraphique] = useState<EnrollementStatByDate[]>([]);
    const [resultsCarte, setResultsCarte] = useState<GeoCoord[]>([]);
    const [deleteDialog, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);


    const fetchefilterUsersTableau = async (filter: FilterRequest) => {
        setLoading(true);
        const data = await filterUsersTableau(filter, currentPage, limit);
        if (data.statusCode === 200) {
            setUser(data?.data?.data ?? []);
            setTotalItems(data?.data?.total ?? 0);
            setCurrentPage(data?.data?.page ?? 1);
            setLoading(false);
        } else {
            setLoading(false);
            setUser([]);
        }
    };

    const fetchefilterUsersmodeGraphique = async (filter: FilterRequest) => {
        setLoading(true);
        const data = await filterUsersmodeGraphique(filter, currentPage, limit);
        if (data.statusCode === 200) {
            setResultsGraphique(data?.data ?? []);
            setLoading(false);
        } else {
            setLoading(false);
            setUser([]);
        }
    };

    const fetchefilterUsersmodeCarte = async (filter: FilterRequest) => {
        setLoading(true);
        const data = await filterUsersmodeCarte(filter, currentPage, limit);
        if (data.statusCode === 200) {
            setResultsCarte(data?.data ?? []);
            setLoading(false);
        } else {
            setLoading(false);
            setUser([]);
        }
    };

    const searchData = async (filter: FilterRequest): Promise<void> => {
        setLoading(true);

        try {

            const mode = (filter.modeAffichage === 'tableau' || filter.modeAffichage === 'carte' || filter.modeAffichage === 'graphique') ? filter.modeAffichage : 'tableau';
            setModeAffichage(mode); // ✅ Met à jour le mode dans le state

            const handlers: Record<string, (f: FilterRequest) => void> = {
                carte: fetchefilterUsersmodeCarte,
                graphique: fetchefilterUsersmodeGraphique,
                tableau: fetchefilterUsersTableau,
            };

            const handler = handlers[mode] || fetchefilterUsersTableau;
            await handler({ ...filter, modeAffichage: mode });

        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (url: string, isImg: boolean) => {
        if (isImg) {
            setPreviewUrl(url);
            setDialogOpen(true);
        } else {
            window.open(url, "_blank");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllUser(currentPage, limit);
            if (res.data && res.statusCode === 200) {
                setLoading(false);
                setUser(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);

            } else {
                setUser([]);
                setLoading(false);
            }

        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);


    function handleChangeState(row: User, newStates: string[]) {
        alert(`Change state of ${row.id} to ${newStates.join(", ")}`);
    }

    function formatUserForForm(row: User): UserFormValues {
        return {
            id: row.id,
            name: row.name || '',
            email: row.email || '',
            password: '',
            confirmPassword: '',
            role: Object.values(Role).includes(row.role as Role) ? (row.role as Role) : undefined,
            typeCompte: Object.values(TypeCompte).includes(row.typeCompte as TypeCompte) ? (row.typeCompte as TypeCompte) : undefined,
            status: Object.values(UserStatus).includes(row.status as UserStatus) ? (row.status as UserStatus) : undefined,
            phoneCountryCode: row.phoneCountryCode || '',
            phoneNumber: row.phoneNumber || '',
            file: undefined,
        };
    }

    // Exemple d'utilisation
    function handleUpdate(row: User) {
        setIsFormOpen(true);
        setInitialValues(formatUserForForm(row));
    }


    function handleDelete(row: any) {
        setSelectedId(row.id);
        setDialogOpen(true);
    }

    const handleDeleteClick = async (id: string): Promise<void> => {
        const result = await deleteUser(id);
        if (result.statusCode !== 200) {
            toast.error(result.message);
            fetchData();
        } else {
            toast.success("utilisateur supprimé avec succès");
            setDeleteDialogOpen(false);
            fetchData();
        }
    };

    function handleValidate(row: User, val: string | number) {
        alert(`Validate ${row.id} with value: ${val}`);
    }

    function handleNextPage() {
        if (currentPage < Math.ceil(totalItems / limit)) {
            setCurrentPage(currentPage + 1);
        } else {
            toast.error("Vous êtes déjà sur la dernière page.");
        }
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            toast.error("Vous êtes déjà sur la première page.");
        }
    }

    function openUserForm() {
        setIsFormOpen(true);
    }

    function closeForm() {
        setIsFormOpen(false);
        setInitialValues(undefined);
        fetchData();
    }


    const isDataEmpty = !user || user.length <= 0;

    return (

        <div className="w-full overflow-x-auto">


            <FilterUser onFilter={searchData} />

            <div className="flex justify-end mb-4 space-x-2">
                <Button onClick={openUserForm} className="bg-gray-600 hover:bg-[#B07B5E] text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2" >
                    <UserPlus className="w-4 h-4" />
                    Ajouter un compte
                </Button>
            </div>


            {loading ? (

                <DataTableSkeleton columnCount={5} rowCount={10} />

            ) : isDataEmpty ? (

                <div className="flex flex-col items-center justify-center mt-10 text-center">
                    <Image src="/error.svg" alt="Aucune donnée" width={180} height={180} />
                    <p className="mt-4 text-gray-600 text-sm">Aucune donnée trouvée</p>
                </div>

            ) : (

                <>

                    <div className='mt-4'>
                        <h3 className="text-lg font-semibold">Résultats de la recherche</h3>
                        <p className="text-sm text-gray-600">{user.length} résultats trouvés</p>
                    </div>

                    {modeAffichage === 'tableau' && (

                        <DataTable
                            columns={getUserColumns(handlePreview)}
                            data={user}
                            onChangeState={handleChangeState}
                            onUpdateData={handleUpdate}
                            onDeleteData={handleDelete}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            itemsPerPage={limit}
                        />

                    )}

                    {modeAffichage === 'graphique' && (
                        <EnrollementGraph data={resultsGraphique} />
                    )}

                    {modeAffichage === 'carte' && (
                        <EnrollementMap data={resultsCarte} />
                    )}

                    <FilesPreviewDialog imageUrl={previewUrl} open={dialogOpen} onOpenChange={setDialogOpen} />

                </>

            )}

            {isFormOpen && (
                <AddUsersForms initialValue={initialValues} onClose={closeForm} isOpen={isFormOpen} fetchData={fetchData} />
            )}

            <DeleteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={() => { if (selectedId) handleDeleteClick(selectedId); }} />

        </div>
    );

}


