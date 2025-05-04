import Header from "../components/navigations/Header";
import Footer from "../components/navigations/Footer";
import ChatBot from "../components/ChatBot";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <ChatBot />
        </>
    );
}
