import { useState } from "react";
import ReportCard from "../components/cards/ReportCard";
import SearchBar from "../components/widgets/SearchBar";
import SelectStatusFilter from "../components/widgets/SelectStatusFilter"; // import select modular
import { Report } from "../types";
import StatusReportChart from "../components/charts/StatusReportChart";
import ReportModal from "../components/modals/ReportModal";

export default function ReviewReportPage() {
    const dummyReports: Report[] = [
        {
            title: "Laporan Kehilangan Barang",
            description: "Barang hilang di ruang kelas B203 saat jam istirahat.",
            submittedAt: "2025-04-24",
            image: "/images/about.jpg",
            status: "Tertunda",
        },
        {
            title: "Kerusakan Fasilitas",
            description: "Kursi patah di ruang kelas A102.",
            submittedAt: "2025-04-22",
            image: "/images/about.jpg",
            status: "Selesai",
        },
        {
            title: "Kebisingan Berlebihan",
            description: "Terdapat kebisingan dari ruang praktik musik selama jam pelajaran.",
            submittedAt: "2025-04-20",
            image: "/images/about.jpg",
            status: "Tertunda",
        },
        {
            title: "Laporan Penemuan Barang",
            description: "Ditemukan dompet hitam di taman belakang kampus.",
            submittedAt: "2025-04-19",
            image: "/images/about.jpg",
            status: "Tertunda",
        },
        {
            title: "Kebocoran Atap",
            description: "Atap bocor di lorong lantai 3.",
            submittedAt: "2025-04-18",
            image: "/images/about.jpg",
            status: "Diproses",
        },
        {
            title: "Pencemaran Suara",
            description: "Bunyi mesin genset mengganggu saat belajar.",
            submittedAt: "2025-04-17",
            image: "/images/about.jpg",
            status: "Diterima",
        },
        {
            title: "Lampu Jalan Mati",
            description: "Lampu jalan depan gerbang kampus tidak menyala.",
            submittedAt: "2025-04-16",
            image: "/images/about.jpg",
            status: "Diproses",
        },
        {
            title: "Pohon Tumbang",
            description: "Pohon tumbang di dekat parkiran motor.",
            submittedAt: "2025-04-15",
            image: "/images/about.jpg",
            status: "Selesai",
        },
        {
            title: "Pohon Tumbang",
            description: "Pohon tumbang di dekat parkiran motor.",
            submittedAt: "2025-04-15",
            image: "/images/about.jpg",
            status: "Selesai",
        },
        {
            title: "Pohon Tumbang",
            description: "Pohon tumbang di dekat parkiran motor.",
            submittedAt: "2025-04-15",
            image: "/images/about.jpg",
            status: "Selesai",
        },
        {
            title: "Pohon Tumbang",
            description: "Pohon tumbang di dekat parkiran motor.",
            submittedAt: "2025-04-15",
            image: "/images/about.jpg",
            status: "Selesai",
        },
        {
            title: "Pohon Tumbang",
            description: "Pohon tumbang di dekat parkiran motor.",
            submittedAt: "2025-04-15",
            image: "/images/about.jpg",
            status: "Selesai",
        },
    ];

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [visibleCount, setVisibleCount] = useState(8);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 8);
    };

    const filteredReports = dummyReports.filter((report) => {
        const matchesSearch =
            report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "Semua" || report.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const visibleReports = filteredReports.slice(0, visibleCount);

    const totalReports = dummyReports.length;
    const completed = dummyReports.filter(r => r.status === "Selesai").length;
    const processing = dummyReports.filter(r => r.status === "Diproses").length;
    const pending = dummyReports.filter(r => r.status === "Tertunda").length;
    const verified = dummyReports.filter(r => r.status === "Diterima").length;

    return (
        <div className="flex flex-col gap-8">

            {/* Progress Section */}
            <div className="flex justify-between items-center bg-tertiary dark:bg-tertiaryDark p-8 rounded-md shadow-md">
                <div className="flex flex-col gap-2 flex-1 justify-between h-40">
                    <h2 className="text-2xl font-semibold">Progress Laporan</h2>
                    <p className="text-textBody dark:text-textBodyDark">
                        {completed + processing + pending + verified} laporan diterima, {completed} telah selesai.
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                        <div
                            className="bg-green-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(completed / totalReports) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="w-40 h-40 ml-8">
                    <StatusReportChart />
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">Masukan laporan yang ingin kamu tinjau</h2>
                <div className="flex w-full gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeHolder="Cari laporan..."
                    />
                    <SelectStatusFilter
                        value={filterStatus}
                        onChange={setFilterStatus}
                        options={[
                            { label: "Semua Status", value: "Semua" },
                            { label: "Tertunda", value: "Tertunda" },
                            { label: "Diproses", value: "Diproses" },
                            { label: "Diterima", value: "Diterima" },
                            { label: "Selesai", value: "Selesai" },
                        ]}
                    />
                </div>
            </div>

            {/* Grid Laporan */}
            <div
                className="grid grid-cols-12 gap-4"
            >
                {visibleReports.map((report, index) => (

                        <ReportCard
                            index={index}
                            item={report}
                            onViewDetail={setSelectedReport}
                            colSpan="col-span-3"
                        />
                ))}
            </div>

            {/* Tombol Load More */}
            {visibleCount < filteredReports.length && (
                <div className="flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-primary hover:bg-primaryDark text-white rounded-lg shadow transition-all"
                    >
                        Muat Lebih Banyak
                    </button>
                </div>
            )}

            <ReportModal
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onVerify={() => alert("Laporan telah diverifikasi!")}
            />
        </div>
    );
}
