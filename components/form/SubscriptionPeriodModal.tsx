'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

type PeriodType = 'week' | 'month' | '3months' | '6months' | 'year'

interface SubscriptionPeriodModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectPeriod: (period: { startDate: string; endDate: string }) => void
}

const getPeriodDates = (type: PeriodType) => {
    const now = new Date()
    const startDate = new Date(now)
    const endDate = new Date(now)

    switch (type) {
        case 'week':
            endDate.setDate(endDate.getDate() + 7)
            break
        case 'month':
            endDate.setMonth(endDate.getMonth() + 1)
            break
        case '3months':
            endDate.setMonth(endDate.getMonth() + 3)
            break
        case '6months':
            endDate.setMonth(endDate.getMonth() + 6)
            break
        case 'year':
            endDate.setFullYear(endDate.getFullYear() + 1)
            break
    }

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    }
}

export default function SubscriptionPeriodModal({
    isOpen,
    onClose,
    onSelectPeriod,
}: SubscriptionPeriodModalProps) {
    const [selected, setSelected] = useState<PeriodType | null>(null)

    useEffect(() => {
        if (!isOpen) {
            setSelected(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    const options: { type: PeriodType; label: string }[] = [
        { type: 'week', label: '1 Semaine' },
        { type: 'month', label: '1 Mois' },
        { type: '3months', label: '3 Mois' },
        { type: '6months', label: '6 Mois' },
        { type: 'year', label: '1 Année' },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative z-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                    Choisissez une période
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {options.map((option) => (
                        <button
                            key={option.type}
                            onClick={() => setSelected(option.type)}
                            className={clsx(
                                'border rounded-lg py-4 px-3 text-center text-sm font-medium transition duration-150 ease-in-out hover:border-orange-500',
                                selected === option.type
                                    ? 'bg-orange-50 border-orange-600 text-orange-700 shadow-sm'
                                    : 'bg-white border-gray-300 text-gray-700'
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Annuler
                    </button>

                    <button
                        disabled={!selected}
                        onClick={() => {
                            if (selected) {
                                const period = getPeriodDates(selected)
                                onSelectPeriod(period)
                                onClose()
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    )
}
