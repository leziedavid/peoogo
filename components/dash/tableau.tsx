'use client';

import { useEffect, useState } from 'react';
import { NotepadText, Users, MapPinned,LayoutGrid, ArrowLeftRight, Clock } from "lucide-react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardStats } from '@/api/services/authService';
import { DashboardStatsResponse } from '@/types/ApiReponse/dashboardStatsResponse';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE'];

export function Tableau() {
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques :", error);
        }
    };

    if (!stats) return <div className="text-center p-4">Chargement...</div>;

    const { totals, graphs } = stats.data;

    // Cartes basées uniquement sur les totaux de l'API
    const cards = [
        { label: "Commandes", value: totals.orders, icon: NotepadText },
        { label: "Produits", value: totals.products, icon: LayoutGrid },
        { label: "Transactions", value: totals.transactions, icon: ArrowLeftRight },
        { label: "Enrôlements", value: totals.enrollements, icon: MapPinned },
        { label: "Comptes", value: totals.users, icon: Users },
        { label: "Notifications", value: totals.notifications, icon: Clock },
    ];

    return (
        <div className="dark:bg-gray-800 w-full p-4">
            {/* Totaux */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
                {cards.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-500/50 p-4 rounded-md h-32 dark:text-gray-200"
                    >
                        <div className="flex gap-2 items-center">
                            <span className="font-bold text-2xl md:text-2xl">{item.value}</span>
                            <item.icon className="w-8 h-8" />
                        </div>
                        <span className="font-semibold text-sm text-center">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Bar Chart Commandes */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Commandes (Bar)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={graphs.orders}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart Utilisateurs */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Utilisateurs (Pie)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={graphs.users}
                                dataKey="total"
                                nameKey="date"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {graphs.users.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart Produits */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Produits (Bar)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={graphs.products}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart Enrôlements */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Enrôlements (Pie)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={graphs.enrollements}
                                dataKey="total"
                                nameKey="date"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {graphs.enrollements.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart Transactions */}
                {graphs.transactions.length > 0 && (
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                        <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Transactions (Bar)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={graphs.transactions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Pie Chart Notifications */}
                {graphs.notifications.length > 0 && (
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                        <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Notifications (Pie)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={graphs.notifications}
                                    dataKey="total"
                                    nameKey="date"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label>
                                    {graphs.notifications.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

            </div>
        </div>
    );
}
