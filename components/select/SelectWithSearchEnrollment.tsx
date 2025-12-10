// components/SelectWithSearch.tsx

import * as React from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SelectWithSearchEnrollment {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
}

const SelectWithSearchEnrollment: React.FC<SelectWithSearchEnrollment> = ({
    value,
    onChange,
    options,
    placeholder = "Sélectionnez une option",
}) => {
    const [search, setSearch] = React.useState("");

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="p-2">
                    <Input
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {filteredOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
                {filteredOptions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                        Aucun résultat
                    </div>
                )}
            </SelectContent>
        </Select>
    );
};

export default SelectWithSearchEnrollment;
