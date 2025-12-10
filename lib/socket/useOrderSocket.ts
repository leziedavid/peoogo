'use client'

import { getTokenFromLocalStorage, useAuthMiddleware } from '@/app/middleware' // renommé ici
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

let socket: Socket | null = null

export function useOrderSocket() {
    const initialized = useRef(false)

    useEffect(() => {
        const initSocket = async () => {
            const token = getTokenFromLocalStorage()
            if (!token || initialized.current) return

            initialized.current = true
            const user = await useAuthMiddleware() // appelé comme une simple fonction async
            if (!user) return

            socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
                auth: { token },
            })

            socket.on('connect', () => {
                console.log(`🟢 WebSocket connecté pour ${user.name}`)
            })

            socket.on('disconnect', () => {
                console.log(`🔴 WebSocket déconnecté`)
            })

            socket.on('new-order', (data) => {
                toast.info('✅ Nouvelle commande reçue', {
                    description: `Commande #${data.orderNumber} reçue`,
                })
                console.log('✅ Nouvelle commande reçue', data)
            })

            socket.on('order-validated', (data) => {
                toast.success('✅ Commande validée', {
                    description: `Commande #${data.orderNumber} validée avec succès`,
                })
                console.log('✅ Commande validée', data)
            })

            socket.on('order-cancelled', (data) => {
                toast.warning('❌ Commande annulée', {
                    description: `Commande #${data.orderNumber} annulée`,
                })
                console.log('❌ Commande annulée', data)
            })

            socket.on('order-completed', (data) => {
                toast.info('🏁 Commande terminée', {
                    description: `Commande #${data.orderNumber} terminée`,
                })
                console.log('🏁 Commande terminée', data)
            })
        }

        initSocket()

        return () => {
            socket?.disconnect()
            socket = null
            initialized.current = false
        }
    }, [])
}
