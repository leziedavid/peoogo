'use client';

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Option = {
    id: string;
    nom: string;
};

interface SelectWithSearchByProduitProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    options: Option[];
    disabled?: boolean;
}

export function SelectWithSearchByProduit({
    value,
    onChange,
    placeholder = "Sélectionnez une option",
    options,
    disabled = false,
}: SelectWithSearchByProduitProps) {
    const [search, setSearch] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

    useEffect(() => {
        setFilteredOptions(
            options.filter((opt) =>
                opt.nom.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, options]);

    const handleClear = () => {
        if (disabled) return;
        onChange("");
        setSearch("");
    };

    return (
        <div className="relative w-full">
            <Select onValueChange={onChange} value={value} disabled={disabled}>
                <SelectTrigger className="w-full pr-10 pl-8">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    avoidCollisions={false} // 🔥 force toujours en bas
                    className="max-h-80 overflow-y-auto">
                    <div className="p-2">
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                    </div>

                    {filteredOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.nom}>
                            {opt.nom}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Croix pour réinitialiser la sélection */}
            {value && !disabled && (
                <button type="button" onClick={handleClear} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 bg-white p-0.5 rounded z-10" >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
