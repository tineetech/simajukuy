import { Bell, LogOut, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeToggle from "./DarkmodeToggle";

const dummyNotifications = [
    { id: 1, title: "Pengguna baru mendaftar", detail: "Seorang pengguna baru telah membuat akun di sistem." },
    { id: 2, title: "Laporan baru dari pengguna", detail: "Ada laporan baru tentang jalan rusak di area pusat kota." },
    { id: 3, title: "Sistem update berhasil", detail: "Update sistem backend berhasil dilakukan pada pukul 02:00." },
    { id: 4, title: "Komentar baru masuk", detail: "Seseorang mengomentari laporan kamu." },
    { id: 5, title: "Permintaan verifikasi", detail: "Ada permintaan verifikasi akun dari pengguna." },
    { id: 6, title: "Admin baru ditambahkan", detail: "Admin baru bernama Dimas telah ditambahkan." },
];

export default function DashboardHeader() {
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [hoveredNotifId, setHoveredNotifId] = useState<number | null>(null);

    return (
        <div className="flex justify-between items-center relative mb-4">
            <h1 className="text-3xl font-semibold text-text dark:text-textDark">Admin Dashboard</h1>

            <div className="flex items-center gap-4">
                <div className="">
                    <DarkModeToggle />
                </div>
                {/* Notifikasi */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotif(!showNotif);
                            setShowProfile(false);
                        }}
                        className="text-text dark:text-textDark"
                    >
                        <Bell size={24} />
                    </button>
                    {showNotif && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-tertiary dark:bg-tertiaryDark rounded-xl shadow-lg p-4 z-10 custom-scrollbar"
                        >
                            <h2 className="text-text dark:text-textDark font-semibold mb-3">Notifikasi</h2>
                            <ul className="space-y-2 text-sm text-text dark:text-textDark">
                                {dummyNotifications.map(notif => (
                                    <li
                                        key={notif.id}
                                        className="rounded-lg p-3 cursor-pointer hover:shadow-md transition"
                                        onMouseEnter={() => setHoveredNotifId(notif.id)}
                                        onMouseLeave={() => setHoveredNotifId(null)}
                                    >
                                        <div className="font-medium">{notif.title}</div>
                                        <AnimatePresence>
                                            {hoveredNotifId === notif.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-2 text-xs text-textBody dark:text-textBodyDark overflow-hidden"
                                                >
                                                    {notif.detail}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>

                {/* Foto profil */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotif(false);
                        }}
                        className="rounded-full overflow-hidden w-10 h-10"
                    >
                        <img
                            src="/images/profile.jpg"
                            alt="Profile"
                            className="object-cover w-full h-full"
                        />
                    </button>
                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-64 bg-tertiary dark:bg-tertiaryDark rounded-xl shadow-lg p-4 z-10 text-text dark:text-textDark"
                            >
                                <div className="flex flex-col items-center">
                                    <img
                                        src="/images/profile.jpg"
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full mb-2"
                                    />
                                    <div className="text-center">
                                        <p className="font-semibold">John Doe</p>
                                        <p className="text-sm text-textBody dark:text-textBodyDark">john@example.com</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <a
                                        href="/profile"
                                        className="flex items-center gap-2 px-3 py-2 hover:bg-accent dark:hover:bg-accentDark rounded-lg transition"
                                    >
                                        <User size={16} /> Profile
                                    </a>
                                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-red-600 rounded-lg transition w-full">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
