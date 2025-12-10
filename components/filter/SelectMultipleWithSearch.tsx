import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type Option = {
    id: string;
    nom: string;
};

interface SelectMultipleWithSearchProps {
    values: string[];
    onChange: (values: string[]) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
}

export function SelectMultipleWithSearch({
    values,
    onChange,
    options,
    placeholder = "Sélectionnez des options",
    disabled = false
}: SelectMultipleWithSearchProps) {
    const [search, setSearch] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);

    useEffect(() => {
        setFilteredOptions(
            options.filter((opt) =>
                opt.nom.toLowerCase().includes(search.toLowerCase()) && !values.includes(opt.id)
            )
        );
    }, [search, options, values]);

    const handleAdd = (value: string) => {
        if (!values.includes(value)) {
            onChange([...values, value]);
            setSearch(""); // reset search
        }
    };

    const handleRemove = (value: string) => {
        onChange(values.filter((v) => v !== value));
    };

    return (
        <div className="space-y-2">
            <Select onValueChange={handleAdd} disabled={disabled} >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <div className="p-2">
                        <Input type="text" placeholder="Rechercher..."  value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-2 py-1 border rounded text-sm"
                        />
                    </div>
                    {filteredOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                            {opt.nom}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2 mt-2">
                {values.map((valId) => {
                    const label = options.find((opt) => opt.id === valId)?.nom || valId;
                    return (
                        <Badge key={valId} variant="secondary" className="flex items-center gap-1">
                            {label}
                            <button type="button" onClick={() => handleRemove(valId)} className="ml-1">
                                <X size={12} />
                            </button>
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}
