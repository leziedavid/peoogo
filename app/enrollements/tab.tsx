import React, { useState } from 'react';
import { User } from 'lucide-react';

const UserProfileInterface = () => {
    const [activeTab, setActiveTab] = useState('PRODUIT AGRICOLE');

    const tabs = [
        { id: 'PRODUIT AGRICOLE', label: 'PRODUIT AGRICOLE', badge: null },
        { id: 'INTRANT', label: 'INTRANT', badge: null },
        { id: 'ENROLEMENT REJETER', label: 'ENROLEMENT REJETER', badge: 3 },
        { id: 'FORMULAIRE', label: 'FORMULAIRE', badge: null },
        { id: 'PRESTATION DE SERVICE', label: 'PRESTATION DE SERVICE', badge: null },
        { id: 'TRANSPORT', label: 'TRANSPORT', badge: null },
        { id: 'SERVICE VENTE DE MATERIEL', label: 'SERVICE VENTE DE MATERIEL', badge: null }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'PRODUIT AGRICOLE':
                return (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Produits Agricoles</h3>
                        <p className="text-gray-600">Gestion des produits agricoles et des stocks disponibles.</p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="font-medium">Riz</h4>
                                <p className="text-sm text-gray-500">Stock disponible</p>
                            </div>
                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="font-medium">Maïs</h4>
                                <p className="text-sm text-gray-500">Stock disponible</p>
                            </div>
                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="font-medium">Cacao</h4>
                                <p className="text-sm text-gray-500">Stock disponible</p>
                            </div>
                        </div>
                    </div>
                );
            case 'INTRANT':
                return (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Intrants</h3>
                        <p className="text-gray-600">Gestion des intrants agricoles et fournitures.</p>
                        <div className="mt-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium">Engrais et fertilisants</h4>
                                <p className="text-sm text-gray-500">Disponibles pour commande</p>
                            </div>
                        </div>
                    </div>
                );
            case 'ENROLEMENT REJETER':
                return (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrôlements Rejetés</h3>
                        <p className="text-gray-600 mb-4">Liste des demandes d'enrôlement qui ont été rejetées.</p>
                        <div className="space-y-3">
                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                                <h4 className="font-medium text-red-800">Demande #001</h4>
                                <p className="text-sm text-red-600">Rejetée le 20/07/2025 - Documents incomplets</p>
                            </div>
                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                                <h4 className="font-medium text-red-800">Demande #002</h4>
                                <p className="text-sm text-red-600">Rejetée le 18/07/2025 - Informations incorrectes</p>
                            </div>
                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                                <h4 className="font-medium text-red-800">Demande #003</h4>
                                <p className="text-sm text-red-600">Rejetée le 15/07/2025 - Critères non respectés</p>
                            </div>
                        </div>
                    </div>
                );
            case 'FORMULAIRE':
                return (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Formulaires</h3>
                        <p className="text-gray-600 mb-4">Formulaires disponibles pour les différentes demandes.</p>
                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <h4 className="font-medium">Formulaire d'enrôlement</h4>
                                <p className="text-sm text-gray-500">Pour nouvelles inscriptions</p>
                            </div>
                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <h4 className="font-medium">Formulaire de commande</h4>
                                <p className="text-sm text-gray-500">Pour passer une commande</p>
                            </div>
                            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <h4 className="font-medium">Formulaire de réclamation</h4>
                                <p className="text-sm text-gray-500">Pour signaler un problème</p>
                            </div>
                        </div>
                    </div>
                );
            case 'PRESTATION DE SERVICE':
                return (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Prestations de Service</h3>
                        <p className="text-gray-600">Services offerts aux agriculteurs et partenaires.</p>
                    </div>
                );
            case 'TRANSPORT':
                return (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transport</h3>
                        <p className="text-gray-600">Services de transport et logistique.</p>
                    </div>
                );
            case 'SERVICE VENTE DE MATERIEL':
                return (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Vente de Matériel</h3>
                        <p className="text-gray-600">Vente d'équipements et matériels agricoles.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* User Profile Card - Centered */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-green-600">
                            <User size={32} className="text-gray-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">DAVID TRA BI</h1>
                        <p className="text-gray-600">Fournisseurs d'intrants</p>
                    </div>
                </div>

                {/* Category Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Mon catalogue</h2>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex flex-wrap justify-center gap-2 p-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default UserProfileInterface;