// components/SelectMultipleWithSearch.tsx

import * as React from "react";
import { Input } from "@/components/ui/input";
import {Popover,PopoverTrigger,PopoverContent,} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Checkbox } from "@radix-ui/react-checkbox";

interface SelectMultipleWithSearchProps {
    values: string[];
    onChange: (values: string[]) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
}

const SelectMultipleWithSearch: React.FC<SelectMultipleWithSearchProps> = ({
    values,
    onChange,
    options,
    placeholder = "Sélectionnez des options",
}) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const toggleValue = (value: string) => {
        if (values.includes(value)) {
            onChange(values.filter((v) => v !== value));
        } else {
            onChange([...values, value]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                    {values.length > 0
                        ? `${values.length} sélectionné(s)`
                        : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-sm p-4 space-y-2">
                <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredOptions.length === 0 ? (
                        <div className="text-sm text-muted-foreground px-2 py-1">
                            Aucun résultat
                        </div>
                    ) : (
                        filteredOptions.map((opt) => (
                            <div key={opt.value} className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleValue(opt.value)} >
                                <Checkbox checked={values.includes(opt.value)} />
                                <span className="text-sm">{opt.label}</span>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default SelectMultipleWithSearch;
