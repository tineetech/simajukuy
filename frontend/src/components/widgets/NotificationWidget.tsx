import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";

const dummyNotifications = [
    { id: 1, title: "Pengguna baru mendaftar", detail: "Seorang pengguna baru telah membuat akun di sistem." },
    { id: 2, title: "Laporan baru dari pengguna", detail: "Ada laporan baru tentang jalan rusak di area pusat kota." },
    { id: 3, title: "Sistem update berhasil", detail: "Update sistem backend berhasil dilakukan pada pukul 02:00." },
    { id: 4, title: "Komentar baru masuk", detail: "Seseorang mengomentari laporan kamu." },
    { id: 5, title: "Permintaan verifikasi", detail: "Ada permintaan verifikasi akun dari pengguna." },
    { id: 6, title: "Admin baru ditambahkan", detail: "Admin baru bernama Dimas telah ditambahkan." },
];

export default function NotificationWidget() {
    const [hoveredNotifId, setHoveredNotifId] = useState<number | null>(null);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="relative hidden md:block" ref={notifRef}>
            <button
                onClick={() => {
                    setShowNotif(!showNotif);
                }}
                className="text-text dark:text-textDark"
            >
                <Bell size={24} />
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
            </AnimatePresence>
        </div>
    );
}
