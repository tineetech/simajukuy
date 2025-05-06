import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardPenLine, Megaphone, Users } from 'lucide-react';
import { Report, ReportedPost } from "../types";
import MonthlyReportChart from "../components/charts/MonthlyReportChart";
import ReportCategoryChart from "../components/charts/ReportCategoryChart";
import ReportCard from "../components/cards/ReportCard";
import StatsCard from "../components/cards/StatsCard";
import ReportModal from "../components/modals/ReportModal"
import ReportedPostCard from "../components/ReportedPostList";
import PostDetailModal from "../components/modals/ReportedPostModal";
import DataUser from "../services/dataUser";
import GetLaporanData from "../services/getLaporanData";
import GetPostData from "../services/getPostData";
import GetUsersData from "../services/getUsersData";

export default function Dashboard() {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [selectedPost, setSelectedPost] = useState<ReportedPost | null>(null);
    const dataLapor = GetLaporanData()
    const dataPost = GetPostData()
    const dataUsers = GetUsersData()

    const cards = [
        {
            bgColor: "bg-red-200",
            icon: <Megaphone size={16} />,
            title: "Total Laporan",
            value: dataLapor?.data?.data?.length ?? '0',
            link: "/admin/laporan"
        },
        {
            bgColor: "bg-yellow-200",
            icon: <ClipboardPenLine size={16} />,
            title: "Postingan",
            value: dataPost?.data?.data?.length ?? 'Loading..',
            link: "/komunitas"
        },
        {
            bgColor: "bg-blue-200",
            icon: <Users size={16} />,
            title: "Total User",
            value: dataUsers?.data?.data?.length,
            link: "/profile"
        },
    ];

    const [recentUnverified, setRecentUnverified]: Report[] = useState([]);

    useEffect(() => {
        if (dataLapor?.data?.data) {
          const formattedReports = dataLapor.data.data.map((item: any) => ({
            user_id: item.user_id || 0,
            id: item.id || 0,
            title: item.title || 'Laporan Warga',
            submittedAt: new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            description: item.description || 'Tidak ada deskripsi',
            image: item.image || '/images/default-report.jpg',
            status: item.status || 'Tertunda'
          }));
          
          setRecentUnverified(formattedReports);
        }
      }, [dataLapor]);

    const reportedPosts: ReportedPost[] = [
        {
            reportedBy: 'RizkyPratama',
            date: '2025-04-28',
            content: 'Isi postingan mengandung ujaran kebencian terhadap kelompok tertentu.',
            reason: 'Ujaran kebencian',
            image: 'https://source.unsplash.com/random/400x300?hate'
        },
        {
            reportedBy: 'DewiAnggraini',
            date: '2025-04-25',
            content: 'Postingan ini menawarkan pekerjaan dengan gaji tinggi tetapi meminta uang pendaftaran.',
            reason: 'Penipuan',
            image: 'https://source.unsplash.com/random/400x300?fraud'
        },
        {
            reportedBy: 'YusufHalim',
            date: '2025-04-24',
            content: 'Judul clickbait dan isi tidak sesuai dengan fakta atau sumber resmi.',
            reason: 'Informasi menyesatkan',
        },
        {
            reportedBy: 'YusufHalim',
            date: '2025-04-24',
            content: 'Judul clickbait dan isi tidak sesuai dengan fakta atau sumber resmi.',
            reason: 'Informasi menyesatkan',
        }
    ];

    
    const datas = DataUser()

    return (
        <>
            {/* Content */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left */}
                <div className="flex flex-col col-span-8 gap-8">

                    {/* Hello World */}
                    <div className="bg-tertiary dark:bg-tertiaryDark flex gap-16 p-8 shadow-md rounded-md">
                        <div className="flex-col">
                            <h1 className="font-semibold text-2xl mb-4">Hi { datas.data?.username?.toUpperCase() ?? '!' }</h1>
                            <p className="text-textBody dark:text-textBodyDark text-sm mb-8">Pantau dan kelola laporan masalah dari warga dengan mudah melalui dasbor admin Simajukuy. Dapatkan visibilitas lengkap atas isu-isu yang dilaporkan, lacak status penanganan, dan koordinasikan tindakan penyelesaian secara efisien.</p>
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
                                    colSpan="col-span-4"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col col-span-4 bg-tertiary dark:bg-tertiaryDark rounded-md shadow-md">

                    {/* Stats */}
                    <div className="flex flex-col p-8 gap-4">
                        {cards.map((card, index) => (
                            <StatsCard
                                key={index}
                                bgColor={card.bgColor}
                                icon={card.icon}
                                title={card.title}
                                value={card.value}
                                link={card.link}
                            />
                        ))}
                    </div>

                    {/* Category Chart */}
                    <div className="flex flex-col p-8">
                        <h1 className="text-lg font-semibold mb-6">Kategori Laporan</h1>
                        <ReportCategoryChart />
                    </div>

                    {/* Reported Posts */}
                    <div className="flex flex-col gap-4 p-8">
                        <div className="flex w-full justify-between items-center">
                            <h1 className="text-lg font-semibold mb-2">Postingan yang Dilaporkan</h1>
                            <p className="text-sm text-textBody dark:text-textBodyDark">{reportedPosts.length} Post</p>
                        </div>
                        {reportedPosts.slice(0, 3).map((post, index) => (
                            <ReportedPostCard key={index} post={post} onClick={() => setSelectedPost(post)} />
                        ))}
                    </div>
                </div>
            </div >


            <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)}
            />

            <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </>
    );
}
