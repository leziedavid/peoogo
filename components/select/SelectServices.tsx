"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectServicesProps {
    value: string
    onValueChange: (value: string) => void
    isDisabled?: boolean
}

export default function SelectServices({value,onValueChange,isDisabled = false,}: SelectServicesProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={isDisabled}>
            <SelectTrigger className="bg-white text-black w-full">
                <SelectValue placeholder="Sélectionner un service" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="livraison">Livraison</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
        </Select>
    )
}
