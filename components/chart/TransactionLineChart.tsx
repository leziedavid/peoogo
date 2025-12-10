"use client";

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
import { MonthlyTransactionStat } from '@/types/ApiReponse/MonthlyTransactionStatsResponse';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface TransactionLineChartProps {
    data: MonthlyTransactionStat[]; // ✅ Type correct
}

const TransactionLineChart: React.FC<TransactionLineChartProps> = ({ data }) => {
    console.log('TransactionLineChart data:', data);

    if (!data || data.length === 0) {
        return <p style={{ textAlign: 'center' }}>Aucune donnée à afficher</p>;
    }

    // ✅ Trier les données chronologiquement
    const sortedData = [...data].sort(
        (a, b) => new Date(a.label + '-01').getTime() - new Date(b.label + '-01').getTime()
    );

    const labels = sortedData.map((d) => d.label);

    const getDataSet = (key: keyof MonthlyTransactionStat) =>
        sortedData.map((d) => d[key] ?? 0);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Dépôts',
                data: getDataSet('DEPOSIT'),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Paiements',
                data: getDataSet('PAYMENT'),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Commissions',
                data: getDataSet('COMMISSION'),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Remboursements',
                data: getDataSet('REFUND'),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Transactions mensuelles par type' },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default TransactionLineChart;
