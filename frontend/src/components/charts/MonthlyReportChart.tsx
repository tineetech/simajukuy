import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function MonthlyReportChart() {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        datasets: [
            {
                label: 'Jumlah Laporan',
                data: [30, 45, 50, 40, 60, 75],
                // muted slate line with a soft accent point
                borderColor: '#04d9ff',        // slate-500
                pointBackgroundColor: '#04d9ff', // gray-400
                pointBorderColor: '#04d9ff',
                backgroundColor: '#04d9ff', // light slate fill
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                bodyColor: '#111827',     // gray-900
                backgroundColor: '#F9FAFB', // gray-50
                titleColor: '#111827',
                borderColor: '#04d9ff',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#4B5563', // gray-600
                    font: {
                        weight: 300,
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    color: '#4B5563', // gray-600
                    font: {
                        family: 'Poppins',
                        weight: 300,
                    },
                },
                grid: {
                    color: '#4b5563', // gray-200
                    borderDash: [4, 4],
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
