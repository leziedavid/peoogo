"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ArrowUpDown, Check, ChevronDown, ChevronLeft, ChevronRight, Edit, MoreHorizontal, Trash } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    onChangeState?: (row: T, possibleStates: string[]) => void;
    onUpdateData?: (row: T) => void;
    onDeleteData?: (row: T) => void;
    onValidateData?: (row: T, validationValue: string | number) => void;
    stateOptions?: string[];
    onNextPage?: () => void;
    onPreviousPage?: () => void;
    currentPage?: number
    totalItems?: number
    itemsPerPage?: number
    onAddReversement?: (row: T) => void;

}

export function DataTable<T extends { id: string }>({

    columns,data,onChangeState,onUpdateData,onDeleteData,onValidateData,onAddReversement,
    stateOptions = [],onNextPage,onPreviousPage, currentPage = 1, totalItems = 0, itemsPerPage = 10,

    }: DataTableProps<T>) {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>(
        {}
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (

        <div className="w-full overflow-x-auto">
            {/* Barre de filtre responsive */}
            <div className="flex flex-wrap items-center py-4 space-x-4 max-w-full overflow-x-auto">

                {/* {columns.length > 1 && columns[1]?.id && (
                    <Input placeholder={`Filtrer ${columns[1]?.header ?? "colonne"}...`}
                        value={ (table.getColumn(columns[1]?.id ?? "")?.getFilterValue() as | string | undefined) ?? "" }
                        onChange={(e) => table.getColumn(columns[1]?.id ?? "")?.setFilterValue(e.target.value) }
                        className="w-full sm:max-w-sm"/>
                )} */}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                            <span className="sm:hidden">Gérer les colonnes</span>
                            <span className="hidden sm:inline">Colonnes</span>
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Container avec scroll horizontal */}
            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <Table className="min-w-full">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm" >
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                        <TableHead className="whitespace-nowrap px-3 py-2 text-xs sm:text-sm sticky right-0 bg-background shadow-sm">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50" >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="whitespace-nowrap px-8 py-2 text-xs sm:text-sm" >
                                                    <div className="max-w-[150px] sm:max-w-[200px] truncate">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </div>
                                                </TableCell>
                                            ))}

                                            {/* Colonne des actions - sticky à droite */}
                                            <TableCell className="whitespace-nowrap px-3 py-2 sticky right-0 bg-background shadow-sm">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Ouvrir le menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        side="left"
                                                        align="start"
                                                        sideOffset={5}
                                                        className="w-48 sm:w-56"
                                                    >
                                                        {/* Changer l'état avec Select */}
                                                        {onChangeState && Array.isArray(stateOptions) && stateOptions.length > 0 && (
                                                            <>
                                                                <div className="px-3 py-1 text-xs font-semibold opacity-70">
                                                                    STATUS
                                                                </div>
                                                                <div className="px-2 pb-2">
                                                                    <Select onValueChange={(val) => onChangeState(row.original, [val])}>
                                                                        <SelectTrigger className="w-full h-8 text-xs">
                                                                            <SelectValue placeholder="Choisir un état" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {stateOptions.map((state) => (
                                                                                <SelectItem
                                                                                    key={state}
                                                                                    value={state}
                                                                                    className="capitalize text-xs"
                                                                                >
                                                                                    {state}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <DropdownMenuSeparator />
                                                            </>
                                                        )}

                                                        {/* onAddReversement */}

                                                        {onAddReversement && (
                                                            <DropdownMenuItem onSelect={() => onAddReversement(row.original)} className="text-xs" >
                                                                <ArrowUpDown className="mr-2 h-3 w-3" />
                                                                Reversement
                                                            </DropdownMenuItem>
                                                        )}

                                                        {/* Actions */}
                                                        {onUpdateData && (
                                                            <DropdownMenuItem onSelect={() => onUpdateData(row.original)} className="text-xs" >
                                                                <Edit className="mr-2 h-3 w-3" />
                                                                Modifier
                                                            </DropdownMenuItem>
                                                        )}

                                                        {onDeleteData && (
                                                            <DropdownMenuItem onSelect={() => onDeleteData(row.original)} className="text-xs text-red-600 focus:text-red-600" >
                                                                <Trash className="mr-2 h-3 w-3" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        )}

                                                        {onValidateData && (
                                                            <DropdownMenuItem onSelect={() => onValidateData(row.original, "validated")} className="text-xs text-green-600 focus:text-green-600" >
                                                                <Check className="mr-2 h-3 w-3" />
                                                                Valider
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length + 1}
                                            className="h-24 text-center text-xs sm:text-sm"
                                        >
                                            Aucun résultat.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Pagination responsive */}
            {/* Pagination responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-4">

                <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                    Page {currentPage} sur {Math.ceil(totalItems / itemsPerPage)}
                </div>

                <div className="flex justify-center sm:justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPreviousPage}  disabled={currentPage <= 1}
                        className="text-xs sm:text-sm"
                    >
                        <ChevronLeft className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Précédent</span>
                    </Button>

                    <Button variant="outline" size="sm" onClick={onNextPage}
                        disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                        className="text-xs sm:text-sm" >
                        <span className="hidden sm:inline">Suivant</span>
                        <ChevronRight className="h-4 w-4 sm:ml-1" />
                    </Button>
                </div>
            </div>

        </div>
        
    );
}
