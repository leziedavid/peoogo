'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { Input } from '../ui/input'

type Network = 'Moov' | 'Orange' | 'Mtn' | 'Wave'

type NetworkStatus = 'available' | 'unavailable'

const networks: { id: Network; label: string; logo: string; status: NetworkStatus }[] = [
    { id: 'Moov', label: 'Moov', logo: '/moov.png', status: 'available' },
    { id: 'Orange', label: 'Orange', logo: '/orange.png', status: 'available' },
    { id: 'Mtn', label: 'MTN', logo: '/mtn.jpeg', status: 'unavailable' },
    { id: 'Wave', label: 'Wave', logo: '/wave.png', status: 'available' },
]


const amountSchema = z.object({
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Le montant doit être un nombre positif',
        }),
})

type Props = {
    open: boolean
    onClose: () => void
    onConfirm: (network: Network, amount: number) => void
    accountNumber: string
}

export default function RechargeWalletModal({ open, onClose, onConfirm, accountNumber }: Props) {
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
    const [amount, setAmount] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open) {
            setSelectedNetwork(null)
            setAmount('')
            setError(null)
        }
    }, [open])

    if (!open) return null

    const handleSelectNetwork = (id: Network) => {
        if (selectedNetwork === id) {
            setSelectedNetwork(null)
            setAmount('')
            setError(null)
        } else {
            setSelectedNetwork(id)
            setError(null)
        }
    }

    const handleConfirm = () => {
        const result = amountSchema.safeParse({ amount })
        if (!selectedNetwork) {
            setError('Veuillez sélectionner un réseau')
            return
        }
        if (!result.success) {
            setError(result.error.issues[0].message); // <-- corrigé ici
            return;
        }
        onConfirm(selectedNetwork, Number(amount))
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50"
            aria-labelledby="dialog-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 id="dialog-title" className="mb-4 text-xl font-semibold text-gray-900">
                    Recharger le wallet ( {accountNumber})
                </h2>

                <div className="mb-4 flex justify-between gap-4">
                    {networks.map(({ id, label, logo, status }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => status === 'available' && handleSelectNetwork(id)}
                            disabled={status === 'unavailable'}
                            className={`relative flex flex-col items-center rounded-full border-2 p-2 transition ${selectedNetwork === id && status === 'available' ? 'border-green-500 shadow-md' : 'border-transparent'}${status === 'unavailable' ? 'cursor-not-allowed opacity-40' : 'hover:border-gray-300'}`}
                            style={{ width: 70, height: 70 }} >
                            <Image
                                src={logo}
                                alt={label}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                                unoptimized
                            />
                            <span className="mt-1 text-xs font-medium text-gray-700">{label}</span>
                        </button>
                    ))}
                </div>

                {selectedNetwork && (
                    <div className="mb-4">
                        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">  Montant à recharger </label>
                        <Input id="amount" type="number" min={1} step={0.01} value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Entrez le montant" />
                    </div>
                )}

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300" >
                        Annuler
                    </button>
                    <button type="button" onClick={handleConfirm} className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50" disabled={!selectedNetwork} >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    )
}
