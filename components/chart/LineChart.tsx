import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { StatistiquesCommandesResponse } from '@/types/ApiReponse/StatistiquesCommandesResponse';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface LineChartProps {
    data?: StatistiquesCommandesResponse | null;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    if (!data || !data.labels || !data.orders || !data.revenue) {
        return <p style={{ textAlign: 'center' }}>Aucune donnée à afficher</p>;
    }

    // 🧠 Étape 1 : Fusionner les 3 tableaux en un seul tableau d’objets
    const merged = data.labels.map((label, index) => ({
        label,
        orders: data.orders[index],
        revenue: data.revenue[index],
    }));

    // 🧠 Étape 2 : Trier par date (en utilisant string locale ISO : 'YYYY-MM')
    merged.sort((a, b) => new Date(a.label + '-01').getTime() - new Date(b.label + '-01').getTime());

    // 🧠 Étape 3 : Reconstruire les tableaux triés
    const sortedLabels = merged.map((item) => item.label);
    const sortedOrders = merged.map((item) => item.orders);
    const sortedRevenue = merged.map((item) => item.revenue);

    const chartData = {
        labels: sortedLabels,
        datasets: [
            {
                label: 'Commandes',
                data: sortedOrders,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Revenus (FCFA)',
                data: sortedRevenue,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Commandes et Revenus par Mois',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default LineChart;
