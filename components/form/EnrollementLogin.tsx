'use client';

import { loginWithCode } from '@/api/services/auth';
import { useState } from 'react';
import { toast } from 'sonner';

export type EnrollementLoginProps = {
    state?: boolean;
    isOpen: boolean;
    onClose: () => void;
};

export default function EnrollementLogin({ isOpen, onClose }: EnrollementLoginProps) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        if (!code.trim()) {
            toast.error('Veuillez entrer votre code');
            return;
        }

        setLoading(true);

        const res = await loginWithCode(code);
        if (res.statusCode == 200) {
            toast.success('Connexion réussie');
            const { access_token, refresh_token } = res.data
            // Enregistrement des tokens
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            document.cookie = `token=${access_token}; path=/`
            toast.success('Connexion réussie !')
            onClose();
        } else if (res.statusCode === 400) {
            toast.error(res.message || 'Informations incorrectes')
            onClose();
        } else if (res.statusCode === 500) {
            toast.error('Erreur serveur, veuillez réessayer')
            onClose();
        } else if (res.statusCode === 401) {
            toast.error(res.message || 'Identifiants invalides')
            onClose();
        } else {
            toast.error('Erreur inconnue')
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Modal Content */}
                <div className="text-center">
                    <svg className="mx-auto mb-4 text-red-600 w-12 h-12 dark:text-gray-200" fill="none" viewBox="0 0 20 20">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    <h3 className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
                        Connexion par code agent
                    </h3>

                    <input
                        type="text"
                        placeholder="Entrez votre code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-600 dark:border-gray-500"
                    />

                    <div className="flex justify-center space-x-4">
                        <button onClick={handleLogin} disabled={loading} className="text-white bg-[#045d28]  hover:bg-[#045d28]  focus:ring-4 focus:outline-none focus:ring-[#045d28] dark:focus:ring-[#045d28]  font-medium rounded-lg text-sm px-5 py-2.5" >
                            {loading ? 'Connexion...' : "Se connecter"}
                        </button>
                        <button onClick={onClose} className="py-2.5 px-5 text-sm font-medium text-white bg-red-600 border border-gray-200 rounded-lg hover:bg-red-600 hover:text-blue-[#045d28]  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
