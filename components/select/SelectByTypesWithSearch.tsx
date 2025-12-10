"use client";


import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface SelectByTypesWithSearchProps<T> {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    options: T[];
    disabled?: boolean;

    // Fonctions pour extraire les champs d'affichage
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
}

export function SelectByTypesWithSearch<T>({
    value,
    onChange,
    placeholder = "Sélectionnez une option",
    options,
    disabled = false,
    getOptionLabel,
    getOptionValue,
}: SelectByTypesWithSearchProps<T>) {
    const [search, setSearch] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<T[]>(options);

    useEffect(() => {
        setFilteredOptions(
            options.filter((opt) =>
                getOptionLabel(opt).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, options, getOptionLabel]);

    return (
        <Select onValueChange={onChange} value={value} disabled={disabled}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="p-2">
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                    />
                </div>

                {filteredOptions.map((opt, index) => (
                    <SelectItem key={index} value={getOptionValue(opt)}>
                        {getOptionLabel(opt)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
