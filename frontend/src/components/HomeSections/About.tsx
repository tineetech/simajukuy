import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from 'lucide-react';

export default function About() {
    const [currentImage, setCurrentImage] = useState(0);

    const images = ["/images/about.jpg", "/images/about2.jpg", "/images/about3.jpg", "/images/about4.jpg"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="relative z-10 my-20 px-6 md:px-16 lg:px-32 flex flex-col md:flex-row items-center gap-12">
            {/* Gambar Carousel Persegi */}
            <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] overflow-hidden rounded-xl shadow-xl flex-shrink-0">
                {images.map((img, index) => (
                    <motion.img
                        key={index}
                        src={img}
                        alt={`tentang-${index}`}
                        className="absolute w-full h-full object-cover transition-opacity"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: currentImage === index ? 1 : 0 }}
                        transition={{ duration: 1 }}
                    />
                ))}
            </div>

            {/* Konten Teks */}
            <div className="flex flex-col text-center md:text-left max-w-2xl">
                <motion.h2
                    className="text-2xl md:text-4xl font-bold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Platform AI & Crowdsourcing untuk Kota Lebih Baik
                </motion.h2>
                <motion.p
                    className="text-sm md:text-lg font-light mb-4 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Simajukuy hadir untuk memberikan kemudahan bagi warga dalam melaporkan berbagai persoalan kota, mulai dari jalan berlubang, sampah menumpuk, hingga infrastruktur rusak.
                    Dengan dukungan teknologi kecerdasan buatan dan kekuatan komunitas, setiap laporan dapat ditanggapi secara cepat dan transparan. Tak hanya melaporkan, warga juga dapat memberikan solusi, berdiskusi, serta membangun kesadaran kolektif.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/about" className="flex justify-center md:justify-start">
                        <button className="px-4 py-2 bg-accent hover:bg-indigo-700 text-white transition-colors ease-in-out flex items-center gap-2 rounded-lg text-sm md:text-base">
                            Pelajari Lebih Lanjut <ArrowUpRight size={18} />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
