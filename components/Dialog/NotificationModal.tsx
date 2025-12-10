'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationModalProps = {
    open: boolean;
    message: string;
    onClose: () => void;
    getAllData?: () => void;
    statusCode: number | null;
    step?: () => void;
};

export const NotificationModal = ({
    open,
    message,
    onClose,
    getAllData,
    statusCode,
    step,
}: NotificationModalProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) setVisible(true);
    }, [open]);

    if (!open) return null;

    let statusColor = '';
    let Icon: React.ElementType = Info;

    if (statusCode === null) {
        statusColor = 'bg-gray-100 text-gray-600';
        Icon = Info;
    } else {
        switch (true) {
            case statusCode >= 200 && statusCode < 300:
                statusColor = 'bg-[#B07B5E] text-white';
                Icon = CheckCircle;
                break;
            case statusCode >= 300 && statusCode < 400:
                statusColor = 'bg-blue-100 text-blue-600';
                Icon = Info;
                break;
            case statusCode >= 400 && statusCode < 500:
                statusColor = 'bg-yellow-100 text-yellow-600';
                Icon = AlertCircle;
                break;
            case statusCode >= 500 && statusCode < 600:
                statusColor = 'bg-red-100 text-red-600';
                Icon = XCircle;
                break;
            default:
                statusColor = 'bg-gray-100 text-gray-600';
                Icon = Info;
                break;
        }
    }
    const handleClose = () => {
        onClose();
        step?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" >
            <div className={cn( 'relative w-full max-w-sm rounded-xl bg-white shadow-xl transition-all duration-300 ease-out', visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0' )} >
                {/* Close icon top right */}
                <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" onClick={handleClose} aria-label="Fermer la notification" >
                    <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="w-full px-6 py-10 text-center">
                    {/* Centered Icon */}
                    <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${statusColor}`}>
                        <Icon className="h-8 w-8" />
                    </div>

                    <p className="text-lg text-[#B07B5E] mb-6">{message}</p>

                    <div className="space-y-3">
                        <button onClick={() => { getAllData?.(); handleClose(); }}  className="w-full rounded-md bg-[#B07B5E] px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"> OK </button>
                        <button onClick={handleClose} className="w-full rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"> Fermer </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
