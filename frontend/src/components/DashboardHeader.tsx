import { useLocation } from "react-router-dom";
import DarkModeToggle from "./widgets/DarkmodeToggle";
import NotificationWidget from "./widgets/NotificationWidget";
import ProfileWidget from "./widgets/ProfileWidget";

export default function DashboardHeader() {
    const location = useLocation();

    const pageTitles: Record<string, string> = {    
        "/admin": "Admin Dashboard",
        "/admin/laporan": "Laporan",
    };

    const currentPath = location.pathname;
    const pageTitle = pageTitles[currentPath];

    return (
        <div className="flex justify-between items-center relative mb-8">
            <h1 className="text-3xl font-semibold text-text dark:text-textDark">{pageTitle}</h1>

            <div className="flex items-center gap-4">
                <div className="">
                    <DarkModeToggle />
                </div>

                {/* Notifikasi */}
                <NotificationWidget />

                {/* Foto profil */}
                <ProfileWidget />
            </div>
        </div>
    );
}
