import { useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Megaphone, Users, ArrowRight } from 'lucide-react';
import { Report } from "../types";
import MonthlyReportChart from "../components/charts/MonthlyReportChart";
import ReportCategoryChart from "../components/charts/ReportCategoryChart";
import ReportCard from "../components/cards/ReportCard";
import StatsCard from "../components/cards/StatsCard";
import ReportModal from "../components/ReportModal"
import ReportHistoryTable from "../components/ReportHistoryTable";

export default function Dashboard() {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const cards = [
        {
            bgColor: "bg-red-200",
            icon: <Megaphone size={16} />,
            title: "Total Laporan",
            value: "724",
        },
        {
            bgColor: "bg-yellow-200",
            icon: <Newspaper size={16} />,
            title: "Post Artikel",
            value: "92",
        },
        {
            bgColor: "bg-blue-200",
            icon: <Users size={16} />,
            title: "User Aktif",
            value: "1.8K",
        },
    ];

    const recentUnverified: Report[] = [
        {
            title: "Jalan berlubang di Jl. Merdeka",
            submittedAt: "10 April 2025",
            description: "Jalan rusak menyebabkan kendaraan sulit lewat, terutama saat hujan.",
            image: "/images/about.jpg",
        },
        {
            title: "Tumpukan sampah di TPS ilegal",
            submittedAt: "9 April 2025",
            description: "Bau menyengat dan tidak diangkut lebih dari seminggu.",
            image: "/images/about.jpg",
        },
        {
            title: "Pohon tumbang menutup jalan",
            submittedAt: "8 April 2025",
            description: "Pohon besar tumbang saat hujan, akses jalan tertutup total.",
            image: "/images/about.jpg",
        },
        {
            title: "Lampu jalan pahlawan mati total",
            submittedAt: "7 April 2025",
            description: "Area jadi sangat gelap di malam hari, rawan kejahatan.",
            image: "/images/about.jpg",
        },
        {
            title: "Banjir di pemukiman warga",
            submittedAt: "6 April 2025",
            description: "Air menggenangi rumah warga hingga 30 cm.",
            image: "/images/about.jpg",
        },
    ];

    return (
        <>
            {/* Content */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left */}
                <div className="flex flex-col col-span-8 gap-8">

                    {/* Hello World */}
                    <div className="bg-tertiary dark:bg-tertiaryDark flex gap-16 p-8 shadow-md rounded-md">
                        <div className="flex-col">
                            <h1 className="font-semibold text-2xl mb-4">Hi John Doe</h1>
                            <p className="text-textBody dark:text-textBodyDark text-sm mb-8">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa tempora vero est rem dolorum impedit, ratione error repellendus unde eos quis ad quia blanditiis natus itaque</p>
                            <Link to='/lapor' className="bg-tertiaryDark dark:bg-tertiary text-textDark dark:text-text   px-6 py-3 rounded-md text-sm">
                                Lihat Selengkapnya
                            </Link>
                        </div>
                        <img src="/images/cuate.svg" alt="" className="w-48" />
                    </div>

                    {/* Monthly Chart */}
                    <div className="flex flex-col bg-tertiary dark:bg-tertiaryDark p-8 rounded-md shadow-md">
                        <h1 className="text-lg font-semibold mb-8">Laporan Bulanan</h1>
                        <MonthlyReportChart />
                    </div>

                    {/* Report Card */}
                    <div className="flex flex-col">
                        <div className="flex justify-between px-8">
                            <h1 className="text-lg font-semibold mb-4">Laporan Terbaru</h1>
                            <Link to={'/laporan'} className="font-light">
                                Lihat Semua

                            </Link>
                        </div>
                        <div className="grid grid-cols-12 gap-4">
                            {recentUnverified.slice(0, 3).map((report, index) => (
                                <ReportCard
                                    key={index}
                                    index={index}
                                    item={report}
                                    onViewDetail={setSelectedReport}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col col-span-4 bg-tertiary dark:bg-tertiaryDark rounded-sm">

                    {/* Stats */}
                    <div className="flex flex-col p-8 gap-4">
                        {cards.map((card, index) => (
                            <StatsCard
                                key={index}
                                bgColor={card.bgColor}
                                icon={card.icon}
                                title={card.title}
                                value={card.value}
                            />
                        ))}
                    </div>

                    {/* Category Chart */}
                    <div className="flex flex-col p-8">
                        <h1 className="text-lg font-semibold mb-6">Kategori Laporan</h1>
                        <ReportCategoryChart />
                    </div>

                    {/* History */}
                    <div className="my-8 px-8">
                        <h1 className="text-lg font-semibold mb-6">Riwayat Laporan</h1>
                        <ReportHistoryTable />
                        <Link to={'/laporan'} className="flex font-light justify-end mt-4 gap-1 items-center">
                            Lainnya
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>


            <ReportModal
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onVerify={() => alert("Laporan telah diverifikasi!")}
            />

        </>
    );
}
