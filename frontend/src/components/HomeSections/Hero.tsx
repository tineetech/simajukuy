import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone } from 'lucide-react';

export default function Hero() {
    return (
        <div className="bg-tertiary dark:bg-tertiaryDark overflow-hidden">
            <section className="relative flex flex-col md:flex-row items-center justify-between md:px-20 pt-14 container mx-auto">
                <div className="max-w-lg text-center md:text-left relative z-10 pt-12 md:pt-0 px-8 md:px-0">
                    <h1 className="text-2xl font-bold md:text-5xl">Solusi Cerdas untuk Kota yang Lebih Baik</h1>
                    <p className="mt-4 font-light text-sm md:text-lg text-textBody dark:text-textBodyDark">Laporkan masalah di sekitar Anda dan temukan solusi bersama komunitas.</p>
                    <Link to="/lapor" className="flex justify-center md:justify-start">
                        <button className="px-4 py-1.5 mt-4 bg-accent text-textDark dark:bg-accentDark hover:bg-indigo-700 transition-colors ease-in-out flex items-center gap-2 rounded-lg">
                            Lapor Sekarang <Megaphone size={18} />
                        </button>
                    </Link>
                </div>

                <div className="relative flex justify-center items-center z-0">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-60 h-60 md:w-[25rem] md:h-[25rem] bg-primary dark:bg-primaryDark opacity-30 blur-[100px] z-[-1]"
                    />

                    <img src="/images/hero.png" alt="Gedung" className="w-80 md:w-[28rem] object-cover z-1" />
                </div>
                
            <motion.div
                animate={{
                    y: [0, -20, 0], // Gerakan naik turun perlahan
                    x: [0, 10, 0], // Sedikit gerakan horizontal
                }}
                transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut",
                }}
                className="absolute left-10 top-[20vh] w-16 h-16 bg-accent blur-[40px] rounded-full"
            />

            <motion.div
                animate={{
                    y: [0, -20, 0], // Gerakan naik turun perlahan
                    x: [0, 40, 0], // Sedikit gerakan horizontal
                }}
                transition={{
                    repeat: Infinity,
                    duration: 12,
                    ease: "easeInOut",
                }}
                className="absolute left-60 top-[75vh] w-24 h-24 bg-accent blur-[50px] rounded-full"
            />
            </section>

        </div>
    )
}