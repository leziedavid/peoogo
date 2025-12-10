"use client"
import GooglePlacesAutocomplete from "react-google-autocomplete"
import { MapPin, Search } from "lucide-react"

type PlaceResult = google.maps.places.PlaceResult

interface GooglePlacesAutocompleteInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    onLocationSelect?: (coords: { lat: number; lon: number }) => void
}

export default function GooglePlacesAutocompleteInput({
    value,
    onChange,
    placeholder = "Entrez une adresse",
    className = "",
    onLocationSelect,
}: GooglePlacesAutocompleteInputProps) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
                options={{ 
                    types: ["geocode"], 
                    componentRestrictions: { country: ["ci"] } 
                }}
                onPlaceSelected={(place: PlaceResult) => {
                    if (place.formatted_address) {
                        onChange(place.formatted_address)
                    }
                    if (place.geometry?.location && onLocationSelect) {
                        onLocationSelect({ 
                            lat: place.geometry.location.lat(), 
                            lon: place.geometry.location.lng() 
                        })
                    }
                }}
                placeholder={placeholder}
                value={value} 
                onChange={(e) => onChange((e.target as HTMLInputElement).value)}
                className={`block w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 py-4 text-black placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm ${className}`}
                autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
        </div>
    )
}