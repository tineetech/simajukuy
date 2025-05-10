import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { isThisWeek, parseISO } from "date-fns";

// Dummy notifikasi dengan status 'checked' dan tanggal
const dummyNotifications = [
    {
        id: 1,
        title: "Pengguna baru mendaftar",
        detail: "Seorang pengguna baru telah membuat akun di sistem.",
        date: "2025-05-10",
        checked: false,
    },
    {
        id: 2,
        title: "Laporan baru dari pengguna",
        detail: "Ada laporan baru tentang jalan rusak di pusat kota.",
        date: "2025-05-08",
        checked: false,
    },
    {
        id: 3,
        title: "Sistem update berhasil",
        detail: "Update sistem backend berhasil dilakukan pada pukul 02:00.",
        date: "2025-04-28",
        checked: true,
    },
];

export default function NotificationWidget() {
    const [notifications, setNotifications] = useState(dummyNotifications);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotif(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter notifikasi minggu ini
    const thisWeekNotifications = notifications.filter((notif) =>
        isThisWeek(parseISO(notif.date), { weekStartsOn: 1 })
    );

    // Cek apakah ada yang belum dibaca
    const hasUnread = thisWeekNotifications.some((notif) => !notif.checked);

    const handleNotifClick = (id: number) => {
        // Tandai sebagai telah dicek (hanya lokal/simulasi)
        const updated = notifications.map((notif) =>
            notif.id === id ? { ...notif, checked: true } : notif
        );
        setNotifications(updated);

        // Navigasi ke halaman notifikasi
        navigate("/profile");
    };

    return (
        <div className="relative hidden md:block" ref={notifRef}>
            <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative text-text dark:text-textDark"
            >
                <Bell size={24} />
                {hasUnread && (
                    <span className="absolute bottom-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                )}
            </button>

            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-tertiary dark:bg-tertiaryDark rounded-xl shadow-lg p-4 z-10 custom-scrollbar"
                    >
                        <h2 className="text-text dark:text-textDark font-semibold mb-3">Notifikasi</h2>
                        <ul className="space-y-2 text-sm text-text dark:text-textDark">
                            {thisWeekNotifications.length > 0 ? (
                                thisWeekNotifications.map((notif) => (
                                    <li
                                        key={notif.id}
                                        className="rounded-lg p-3 cursor-pointer hover:shadow-md transition bg-gray-50 dark:bg-gray-800"
                                        onClick={() => handleNotifClick(notif.id)}
                                    >
                                        <div className="font-medium">{notif.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {notif.detail}
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Tidak ada notifikasi minggu ini.
                                </p>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
