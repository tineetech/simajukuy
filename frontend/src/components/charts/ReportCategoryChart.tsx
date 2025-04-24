import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin custom untuk tulisan di tengah
const centerTextPlugin = {
    id: 'centerTextPlugin',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw: (chart: any) => {
        if (chart.config.type !== 'doughnut') return;
        const { width, height, ctx } = chart;
        ctx.restore();

        // Menghitung total data
        const total = chart.data.datasets[0].data.reduce((acc: number, value: number) => acc + value, 0);

        // Set font ukuran relatif terhadap tinggi chart (lebih kecil)
        const fontSize = Math.min(height, width) / 5; // Ukuran font disesuaikan agar tidak terlalu besar
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textBaseline = "middle";

        // Teks yang akan ditampilkan di tengah
        const text = `${total}`;
        const textWidth = ctx.measureText(text).width;
        const textX = (width - textWidth) / 2; // Menempatkan teks di tengah secara horizontal
        const textY = height / 2; // Menempatkan teks di tengah secara vertikal

        // Menampilkan teks di tengah chart
        ctx.fillStyle = "#000"; // Bisa disesuaikan dengan warna
        ctx.fillText(text, textX, textY);
        ctx.save();
    }
};

ChartJS.register(centerTextPlugin);

export default function ReportCategoryChart() {
    const data: ChartData<'doughnut', number[], string> = {
        labels: ['Jalan Rusak', 'Sampah', 'Bencana Alam', 'Lainnya'],
        datasets: [
            {
                label: 'Jumlah Laporan',
                data: [46, 37, 28, 12],
                backgroundColor: ['#8fff67', '#67fffC', '#C767FF', '#FF6769'],
                borderWidth: 0,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        cutout: '75%', // 🔹 Ini yang bikin donat lebih tipis
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                bodyColor: '#fff',
                titleColor: '#fff',
            },
        },
    };

    return <Doughnut data={data} options={options} />;
}
