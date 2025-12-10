"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/dataTable";
import { Mail, ShoppingCart, StretchHorizontal } from "lucide-react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useOrderSocket } from '@/lib/socket/useOrderSocket';
import { getUserRole } from "@/app/middleware";
import { columns as ContactColumns } from "@/types/columns/contactColumns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContactResponse } from "@/types/ApiReponse/contactResponse";
import { getAllPaginateContact } from "@/api/services/contactService";

export default function Page() {

    // useOrderSocket()

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);
    const [contact, setContact] = useState<ContactResponse[]>([]);
    const [roles, setRoles] = useState<string>("");
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const router = useRouter();

    const fetchroles = async () => {
        const roles = await getUserRole();
        if (roles) {
            setRoles(roles);
        }
    }

    const getAllContact = async () => {
        try {
            const res = await getAllPaginateContact(currentPage, limit);
            if (res.data) {
                setContact(res.data.data);
                setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchroles();
        if (roles === "ADMIN") {
            getAllContact();
        }
    }, [roles, startDate, endDate]);


    function closeForm() {
    }

    async function handleChangeState(row: ContactResponse, newStates: string[]) {

    }

    function handleUpdate(row: ContactResponse) {

    }

    function handleDelete(row: ContactResponse) {

    }

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

    const isDataEmpty = !contact || contact.length <= 0;

    return (
        <div className="w-full overflow-x-auto">

            <div className="col-span-3 md:col-span-2 flex flex-col items-center md:items-start gap-4 pt-1 px-2">
                <p className="flex w-full gap-2 pt-4 font-extrabold text-2xl md:text-3xl dark:text-white">
                    <span>Mes contacts</span>
                    <Mail className="w-6 h-6" />
                </p>
            </div>

            {isDataEmpty ? (

                <DataTableSkeleton columnCount={5} rowCount={10} />

            ) : (

                <DataTable
                    columns={ContactColumns}
                    data={contact}
                    onChangeState={handleChangeState}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                />

            )}

        </div>
    );
}



