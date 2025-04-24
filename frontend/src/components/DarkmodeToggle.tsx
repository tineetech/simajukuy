import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon } from "lucide-react";

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const handleToggle = () => setDarkMode((prev) => !prev);

    return (
        <motion.button
            onClick={handleToggle}
            className="relative w-14 h-7 rounded-full focus:outline-none"
            initial={false}
            animate={{ backgroundColor: darkMode ? "#4B5563" : "#E5E7EB" }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center"
                layout
                transition={{
                    // this sets up a spring for layout changes
                    layout: { type: "spring", bounce: 0.25, duration: 0.4 },
                    // if you wanted, you can still animate other props here
                    default: { duration: 0.4 },
                }}
                animate={{
                    x: darkMode ? 28 : 0,
                    backgroundColor: darkMode ? "#191970" : "#F1DF6B",
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {darkMode ? (
                        <motion.div
                            key="moon"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MoonIcon size={16} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <SunIcon size={16} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.button>
    );
}
