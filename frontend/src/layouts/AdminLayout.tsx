import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigations/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function AdminLayout() {

    return (
        <div className="flex h-screen overflow-hidden bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            <Sidebar />
            <main className="flex-1 container mx-auto overflow-y-auto">
                <div className="mx-auto container p-8">
                    <DashboardHeader />
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
