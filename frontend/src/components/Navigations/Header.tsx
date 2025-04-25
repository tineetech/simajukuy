import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Home, Users, FileText, AlertCircle, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "../DarkmodeToggle";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
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

                <div className="flex items-center gap-8">
                    <DarkModeToggle />

                    {/* Profile (Desktop) */}
                    <div className="relative hidden md:block">
                        <button onClick={() => setProfileOpen(!profileOpen)}>
                            <img
                                src="/images/profile.jpg"
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                        </button>
                        {profileOpen && (
                            <AnimatePresence>
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
                            </AnimatePresence>
                        )}
                    </div>

                </div>
                {/* Hamburger (Mobile) */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-full left-0 w-full bg-secondary shadow-md flex flex-col items-start py-4 space-y-4 md:hidden px-6"
                    >
                        <div className="flex items-center space-x-3 w-full">
                            <img
                                src="/images/profile.jpg"
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                            />
                            <div>
                                <p className="text-lg font-semibold ">Username</p>
                            </div>
                        </div>
                        {navLinks.map((link) => {
                            const isActive = link.path === "/"
                                ? location.pathname === "/"
                                : location.pathname.startsWith(link.path);

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out ${isActive ? "bg-accent" : "hover:bg-accent"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out ${location.pathname === "/profile"
                                ? "bg-accent"
                                : "hover:bg-accent"
                                }`}
                        >
                            <User size={20} />
                            <span>Profile</span>
                        </Link>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
