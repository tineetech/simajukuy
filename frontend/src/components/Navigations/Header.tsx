import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Home, Users, FileText, AlertCircle, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "../widgets/DarkmodeToggle";
import NotificationWidget from "../widgets/NotificationWidget";
import ProfileWidget from "../widgets/ProfileWidget";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/", icon: <Home size={20} /> },
        { name: "Komunitas", path: "/komunitas", icon: <Users size={20} /> },
        { name: "Lapor", path: "/lapor", icon: <AlertCircle size={20} /> },
        { name: "Artikel", path: "/artikel", icon: <FileText size={20} /> },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all text-text dark:text-textDark duration-300 ${scrolled ? "bg-tertiary dark:bg-tertiaryDark shadow-md" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto w-full px-6 md:px-20 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold">
                    Simajukuy
                </Link>

                {/* Navigasi (Desktop) */}
                <nav className="hidden md:flex font-medium">
                    {navLinks.map((link) => {
                        const isActive = link.path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(link.path);

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 space-x-2 transition ${isActive ? "bg-accent text-textDark dark:bg-accent rounded-3xl" : "hover:text-accent"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                        <DarkModeToggle />
                    </div>
                    <NotificationWidget />
                    <ProfileWidget />
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-4 md:hidden">
                    <DarkModeToggle />
                    {/* Hamburger (Mobile) */}
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                key="mobile-menu"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25 }}
                                className="absolute top-full left-0 w-full bg-tertiary dark:bg-tertiaryDark shadow-md flex flex-col items-start py-4 space-y-4 md:hidden px-6 z-50"
                            >
                                {/* Profile Section */}
                                <div className="flex items-center space-x-3 w-full">
                                    <img
                                        src="/images/profile.jpg"
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-lg font-semibold">Username</p>
                                        <p className="text-sm text-textBody dark:text-textBodyDark">john@example.com</p>
                                    </div>
                                </div>

                                {/* Nav Links */}
                                {navLinks.map((link) => {
                                    const isActive = link.path === "/"
                                        ? location.pathname === "/"
                                        : location.pathname.startsWith(link.path);

                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out ${isActive ? "bg-accent text-textDark" : "hover:bg-accent"
                                                }`}
                                        >
                                            {link.icon}
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}

                                {/* Profile Link */}
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out ${location.pathname === "/profile"
                                        ? "bg-accent text-textDark"
                                        : "hover:bg-accent"
                                        }`}
                                >
                                    <User size={20} />
                                    <span>Profile</span>
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        // handle actual logout here
                                        console.log("Logged out");
                                    }}
                                    className="flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg hover:bg-red-600 text-left transition"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
