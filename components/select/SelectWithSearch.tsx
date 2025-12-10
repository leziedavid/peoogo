"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Option = {
    id: string;
    nom: string;
};

interface SelectWithSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    options: Option[];
    disabled?: boolean;
}

export function SelectWithSearch({value,onChange,placeholder = "Sélectionnez une option",options,disabled = false,}: SelectWithSearchProps) {
    
    const [search, setSearch] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

    useEffect(() => {
        setFilteredOptions(
            options.filter((opt) =>
                opt.nom.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, options]);

    return (
        <Select onValueChange={onChange} value={value} disabled={disabled}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent             position="popper"
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
                    <SelectItem key={opt.id} value={opt.id}>
                        {opt.nom}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
