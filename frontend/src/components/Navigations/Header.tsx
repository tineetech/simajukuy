import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Users, FileText, AlertCircle, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-secondary shadow-md" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto w-full px-6 md:px-20 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold">
                    Simajukuy
                </Link>

                {/* Navigasi (Desktop) */}
                <nav className="hidden md:flex font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 space-x-2 transition ${location.pathname === link.path
                                ? "bg-accent rounded-3xl"
                                : "hover:text-accent"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

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
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-0 mt-2 w-40 bg-secondary shadow-md rounded-lg overflow-hidden"
                        >
                            <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-accent transition-all ease-in-out">
                                <User size={18} className="mr-2" /> Profile
                            </Link>
                            <button className="flex items-center w-full px-4 py-2 hover:bg-accent transition-all ease-in-out">
                                <LogOut size={18} className="mr-2" /> Logout
                            </button>
                        </motion.div>
                    )}
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
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-3 text-lg w-full py-2 px-4 rounded-lg transition ease-in-out ${location.pathname === link.path
                                    ? "bg-accent"
                                    : "hover:bg-accent"
                                    }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
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
