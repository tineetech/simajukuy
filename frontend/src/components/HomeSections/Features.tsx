import { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Users, Bot, Coins } from "lucide-react"; // Import ikon dari Lucide React
import { JSX } from "react/jsx-runtime";

interface Feature {
    title: string;
    icon: JSX.Element;
    description: string;
}

const features: Feature[] = [
    {
        title: "Lapor Masalah",
        icon: <Megaphone className="w-6 h-6 mr-3" />,
        description:
            "Laporkan berbagai permasalahan kota seperti jalan rusak, lampu mati, dan sampah menumpuk secara cepat. Setiap laporan akan diverifikasi dan diteruskan ke pihak terkait agar segera ditindaklanjuti.",
    },
    {
        title: "Komunitas & Solusi",
        icon: <Users className="w-6 h-6 mr-3" />,
        description:
            "Terhubung dengan warga lain untuk berdiskusi, berbagi solusi, dan berkontribusi dalam menciptakan lingkungan yang lebih baik. Komunitas dapat memberikan masukan dan dukungan dalam menyelesaikan masalah kota.",
    },
    {
        title: "AI Asisten Kota",
        icon: <Bot className="w-6 h-6 mr-3" />,
        description:
            "Dapatkan jawaban cepat mengenai regulasi kota, solusi permasalahan umum, serta saran mengenai lingkungan dan infrastruktur dengan bantuan kecerdasan buatan yang selalu siap membantu.",
    },
    {
        title: "Sistem Coin & Reward",
        icon: <Coins className="w-6 h-6 mr-3" />,
        description:
            "Setiap laporan yang diverifikasi akan mendapatkan coin sebagai apresiasi. Coin ini bisa dikumpulkan dan ditukar dengan berbagai reward menarik seperti diskon merchant atau akses premium dalam aplikasi.",
    },
];

export default function Features() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <section className="px-6 md:px-16 lg:px-32 my-40">
            <h1 className="text-2xl md:text-4xl font-bold mb-6">Fitur Utama <span className="text-accent">SiMajuKuy</span>!</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 flex flex-col space-y-4">
                    {features.map((feature, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex items-center px-6 py-4 rounded-lg font-semibold md:text-lg transition-all duration-300 ${
                                selectedIndex === index
                                    ? "bg-primary shadow-lg scale-105"
                                    : "bg-secondary hover:bg-primary"
                            }`}
                        >
                            {feature.icon}
                            {feature.title}
                        </button>
                    ))}
                </div>

                <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full md:w-1/2 bg-secondary shadow-lg rounded-lg p-8 flex flex-col"
                >
                    <h2 className="text-xl md:text-2xl font-bold mb-4">{features[selectedIndex].title}</h2>
                    <p className="md:text-lg leading-relaxed">{features[selectedIndex].description}</p>
                </motion.div>
            </div>
        </section>
    );
}
