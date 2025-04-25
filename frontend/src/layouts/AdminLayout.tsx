import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigations/Sidebar";

export default function AdminLayout() {

    return (
            <div className="flex h-screen overflow-hidden bg-background dark:bg-backgroundDark text-text dark:text-textDark">
                <Sidebar/>
                <main className="flex-1 container mx-auto overflow-y-auto">
                    <Outlet />
                </main>
            </div>
    );
}
