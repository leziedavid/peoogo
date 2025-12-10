'use client';

import React, { useState, useEffect } from 'react';
import {ChevronDown, X } from 'lucide-react';

// Interface générique pour les options
interface SelectOption {
    id: string;
    nom: string;
}

interface SearchableSelectProps {
    value?: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder: string;
    className?: string;
    loading?: boolean;
    onSearch?: (term: string) => void;
    searchTerm?: string;
    onClear?: () => void;
    disabled?: boolean;
}

export default function SearchFilter({
    value,
    onValueChange,
    options,
    placeholder,
    className = "",
    loading = false,
    onSearch,
    searchTerm = "",
    onClear,
    disabled = false,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [internalSearchTerm, setInternalSearchTerm] = useState<string>(searchTerm);

    useEffect(() => {
        if (value) {
            const selected = options.find((o) => o.id === value);
            if (selected) {
                setInternalSearchTerm('');
            }
        }
    }, [value, options]);

    const filteredOptions = options.filter((option: SelectOption) =>
        option.nom.toLowerCase().includes(internalSearchTerm.toLowerCase())
    );

    const selectedOption = options.find((option: SelectOption) => option.id === value);

    const handleSelect = (optionValue: string): void => {
        if (disabled) return;
        onValueChange(optionValue);
        setIsOpen(false);
        setInternalSearchTerm('');
    };

    const handleClear = (): void => {
        if (disabled) return;
        onValueChange('');
        setInternalSearchTerm('');
        if (onClear) onClear();
    };

    useEffect(() => {
        if (onSearch && internalSearchTerm) {
            const debounceTimer = setTimeout(() => {
                onSearch(internalSearchTerm);
            }, 300);
            return () => clearTimeout(debounceTimer);
        }
    }, [internalSearchTerm, onSearch]);

    return (
        <div className="relative">
            <div className="relative">
                <button
                    type="button"
                    disabled={disabled}
                    className={`w-full px-3 py-2 text-left bg-white border border-gray-8 rounded-md pr-10 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''} ${className}`}
                    onClick={() => {
                        if (!disabled) setIsOpen(!isOpen);
                    }}
                >
                    <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
                        {selectedOption ? selectedOption.nom : placeholder}
                    </span>
                </button>

                <div className="absolute right-2 top-2 flex items-center gap-1">
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="h-3 w-3 text-gray-400" />
                        </button>
                    )}
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'opacity-50' : ''}`}
                    />
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={internalSearchTerm}
                            disabled={disabled}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setInternalSearchTerm(e.target.value)
                            }
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        />
                    </div>

                    <div className="max-h-60 overflow-auto">
                        {loading ? (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                Chargement...
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                Aucun élément trouvé
                            </div>
                        ) : (
                            filteredOptions.map((option: SelectOption) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    disabled={disabled}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-10 focus:bg-gray-100 focus:outline-none ${disabled ? 'cursor-not-allowed text-gray-400' : ''}`}
                                    onClick={() => handleSelect(option.id)}
                                >
                                    {option.nom}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
