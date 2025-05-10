import { useState } from "react";
import { Camera, Coins, FileText, GalleryHorizontal, MapPin, NotebookPen, SearchCheck } from "lucide-react";
import PostItem from "../components/PostItem";
import ReportList from "../components/ReportList";
import { PostInterface, Report } from "../types";
import { Link } from "react-router-dom";
import DataUser from "../services/dataUser";

export default function ProfilePage() {
    const datas = DataUser()
    console.log(datas)
    const [activeTab, setActiveTab] = useState("report");
    const tabs = [
        { key: "report", label: "Laporan" },
        { key: "post", label: "Postingan" },
    ];

    const dummyUser = {
        firstName: datas?.data?.first_name ?? '',
        lastName: datas?.data?.last_name ?? '',
        username: datas?.data?.username ?? '',
        joinedAt: datas.data?.created_at ?? '',
        coin: datas?.data?.amount ?? 0,
        avatar: "/images/profile.jpg",
        email: "ucup@gmail.com"
    }

    const dummyReports: Report[] = [
        {
            title: "Sampah menumpuk di Taman Sempur",
            description: "Terdapat tumpukan sampah yang tidak diangkut lebih dari 3 hari.",
            image: "/images/sample-report.jpg",
            status: "Diproses",
            submittedAt: "2025-04-22",
        },
        {
            title: "Jalan rusak di Jl. Pajajaran",
            description: "Lubang besar berbahaya untuk pengendara motor, perlu perbaikan.",
            image: "/images/sample-report2.jpg",
            status: "Tertunda",
            submittedAt: "2025-04-18",
        },
    ];

    const dummyPosts: PostInterface[] = [
        {
            id: 1,
            user_id: 101,
            username: "farhan.mp4",
            avatar: "/images/profile.jpg",
            image: "", // Kosongkan jika tidak ada gambar
            content: "Hari ini saya melihat langsung proses pembersihan saluran air di Suryakencana. Salut untuk petugas!",
            type: "text", // Contoh tipe, bisa disesuaikan
            users: {
                user_id: 101,
                username: "farhan.mp4"
            },
            timestamp: "1 jam lalu",
            likes: 18,
            comment_count: 4,
            like_count: 18,
            comments: {} // Kosongkan untuk dummy
        },
        {
            id: 2,
            user_id: 101,
            username: "farhan.mp4",
            avatar: "/images/profile.jpg",
            image: "",
            content: "Apakah ada yang tahu siapa yang bisa dihubungi untuk perbaikan lampu jalan di daerah Bubulak?",
            type: "text",
            users: {
                user_id: 101,
                username: "farhan.mp4"
            },
            timestamp: "3 hari lalu",
            likes: 42,
            comment_count: 9,
            like_count: 42,
            comments: {}
        }
    ];


    return (
        <div className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            {/* Cover */}
            <div className="bg-lapor py-28 pb-46 relative" />

            <div className="grid grid-cols-12 gap-6 mx-auto container pb-8 min-h-screen">

                {/* Profile Information */}
                <aside className="col-span-3 -mt-24 relative z-10">
                    <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-8">
                        <img
                            src={dummyUser.avatar}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover mx-auto"
                        />
                        <div className="flex flex-col items-center mt-4">
                            <h1 className="text-xl font-semibold">{dummyUser.firstName} {dummyUser.lastName}</h1>
                            <h2 className="text-textBody dark:text-textBodyDark">@{dummyUser.username}</h2>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Coins className="text-yellow-500" />
                                <div>
                                    <p className="text-sm text-textBody dark:text-textBodyDark">Coin</p>
                                    <p className="text-xl font-medium">{dummyUser.coin}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <FileText className="text-blue-500" />
                                <div>
                                    <p className="text-sm text-textBody dark:text-textBodyDark">Total Laporan</p>
                                    <p className="text-xl font-medium">{dummyReports.length}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <GalleryHorizontal className="text-green-500" />
                                <div>
                                    <p className="text-sm text-textBody dark:text-textBodyDark">Total Postingan</p>
                                    <p className="text-xl font-medium">{dummyPosts.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2 text-sm text-textBody dark:text-textBodyDark text-center">
                            <p>Bergabung pada {dummyUser.joinedAt}</p>
                            <p>{dummyUser.email}</p>
                        </div>
                    </div>
                </aside>


                {/* Content */}
                <div className="col-span-9 mt-4">
                    <div className="flex gap-4 mb-4 col-span-9">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`font-medium text-lg ${activeTab === t.key
                                    ? "text-text dark:text-textDark"
                                    : "text-textBody dark:text-textBodyDark hover:text-text dark:hover:text-textDark"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-9 gap-6">
                        {/* Main Content */}
                        <main className="col-span-6">
                            <div className="space-y-4">
                                {activeTab === "report"
                                    ? dummyReports.map((report, index) => (
                                        <ReportList
                                            key={report.id}
                                            report={report}
                                            index={index}
                                            hideDetailButton={true}
                                        />
                                    ))
                                    : dummyPosts.map((post) => (
                                        <PostItem key={post.id} post={post} />
                                    ))}
                            </div>
                        </main>

                        {/* Side Content */}
                        <aside className="col-span-3 space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-4">
                                <h3 className="font-semibold text-lg mb-4 text-center">Aksi Cepat</h3>
                                <div className="flex flex-col gap-3">
                                    <Link to="/lapor" className="flex items-center gap-3 bg-primary dark:bg-primaryDark text-textDark px-4 py-2 rounded-md hover:bg-primary/90 transition">
                                        <FileText size={18} />
                                        Buat Laporan
                                    </Link>
                                    <Link to="/komunitas" className="flex items-center gap-3 bg-secondary dark:bg-secondaryDark text-textDark px-4 py-2 rounded-md hover:bg-secondary/90 transition">
                                        <GalleryHorizontal size={18} />
                                        Unggah Postingan Baru
                                    </Link>
                                    <Link to="/" className="flex items-center gap-3 bg-secondary dark:bg-secondaryDark text-textDark px-4 py-2 rounded-md hover:bg-secondary/90 transition">
                                        <Coins size={18} />
                                        Tukar Coin
                                    </Link>
                                </div>
                            </div>

                            {/* Edukasi Singkat */}
                            <div className="bg-blue-50 dark:bg-blue-950 rounded-xl shadow p-5 border border-blue-200 dark:border-blue-800">
                                <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-200 text-center mb-4">
                                    Tips Pelaporan Efektif
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <NotebookPen className="text-blue-900 dark:text-blue-100 mt-1" size={32} />
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            <span className="font-medium">Gunakan bahasa yang sopan dan jelas</span> agar laporan mudah dipahami.
                                        </p>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <MapPin className="text-blue-900 dark:text-blue-100 mt-1" size={32} />
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            <span className="font-medium">Sertakan lokasi dan waktu kejadian</span> untuk mempercepat verifikasi.
                                        </p>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Camera className="text-blue-900 dark:text-blue-100 mt-1" size={32} />
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            <span className="font-medium">Tambahkan foto bukti</span> jika memungkinkan untuk meningkatkan kredibilitas.
                                        </p>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <SearchCheck className="text-blue-900 dark:text-blue-100 mt-1" size={32} />
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            <span className="font-medium">Periksa ulang laporan</span> sebelum dikirim agar tidak ada kesalahan.
                                        </p>
                                    </li>
                                </ul>
                            </div>

                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}
