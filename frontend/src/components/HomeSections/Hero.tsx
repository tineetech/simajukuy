import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Megaphone } from 'lucide-react';
import axios from "axios";
import { useState, useEffect } from "react";

export default function Hero() {
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchBerita = async () => {
        try {
          const response = await axios.get('http://localhost:5005/api/berita/');
          setBerita(response.data);
          console.log(response)
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchBerita();
    }, []);
    return (
        <div className="bg-tertiary dark:bg-tertiaryDark overflow-hidden">
        <div className=" container mx-auto overflow-hidden px-5">
            <section className="relative flex flex-col pb-10 md:flex-col items-center pt-14 justify-center container mx-auto">
                <div className="w-full text-center md:text-center relative z-10 pt-12 md:pt-35 items-center px-8 md:px-0">
                    <h1 className="text-2xl font-bold md:text-5xl">Solusi Cerdas untuk Kota yang Lebih Baik</h1>
                    <p className="mt-4 font-light mx-2 md:mx-10 lg:mx-50 text-sm md:text-lg text-textBody dark:text-textBodyDark">Mari bergandengan tangan membangun kota yang lebih baik. Laporkan setiap kendala atau masalah di sekitar Anda, dan jadilah bagian dari gerakan komunitas untuk menemukan solusi yang berkelanjutan.</p>
                    <Link to="/lapor" className="flex justify-center md:justify-center">
                        <button className="px-1.5 py-1.5 mt-4 bg-primary text-textDark dark:bg-accentDark hover:bg-indigo-500 transition-colors ease-in-out flex items-center gap-2 rounded-full">
                            <span className="pl-3">
                                Lapor Sekarang 
                            </span>
                            <div className="bg-white p-1.5 rounded-full">
                                <Megaphone size={18} color="#345B93" />
                            </div>
                        </button>
                    </Link>
                </div>

                <div className="relative flex justify-center h-auto lg:h-[600px] banner1 w-full mx-auto container mt-10 rounded-4xl items-center z-0">
                    {/* <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-60 h-60 md:w-[25rem] md:h-[25rem] bg-primary dark:bg-primaryDark opacity-30 blur-[100px] z-[-1]"
                    /> */}

                    {/* <img src="/images/hero.png" alt="Gedung" className="w-80 md:w-[28rem] object-cover z-1" /> */}

                    {/* new code */}
                    <div className="flex flex-col lg:flex-row gap-3 py-10">
                        <div className="w-[400px] rounded-2xl h-[450px] bg-white overflow-hidden">
                            <img src="/images/banner1.jpg" className="w-full object-cover h-full" alt="" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="hidden w-[710px] rounded-2xl h-[220px] lg:flex items-center justify-center bg-slate-700 text-white hover:bg-slate-600 ease-in-out transition-all dark:bg-gray-700">
                                    <div className="container mx-auto w-full h-full p-5 flex justify-center text-left flex-col">
                                        <h1 className="text-2xl font-bold mb-3">✨ Pentingnya Peduli Sekitar</h1>
                                        <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam consequuntur harum ratione soluta, explicabo sapiente ipsum laborum error libero distinctio culpa dolore deleniti ipsam molestias!</p>
                                        <div className="flex pr-5 justify-between w-full items-center mt-2">
                                            <div>
                                                <p>2024/32/01 - Ms. Bean</p>
                                            </div>
                                            <button className="bg-slate-500 rounded-full p-3">
                                                <ArrowUpRight size={20} className="text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:flex-row gap-3">
                                <div className="hidden lg:flex w-[350px] overflow-hidden rounded-2xl h-[220px] bg-white">
                                    <img src="/images/banner1.jpg" className="w-full object-cover h-full" alt="" />
                                </div>
                                <div className="w-[400px] lg:w-[350px] overflow-hidden rounded-2xl h-[220px] flex items-start relative justify-start bg-slate-700 text-white hover:bg-slate-600 ease-in-out transition-all dark:bg-gray-700">
                                    <div className="p-5 w-[230px]">
                                        <h1 className="font-bold mb-2">Lapor Bijak Untuk Kita !</h1>
                                        <p className="text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam, animi!</p>
                                    </div>
                                    <img src="/images/maskot.png" className="w-[200px] object-cover h-[200px] absolute bottom-0 right-0" alt="" />
                                    
                                    <button className="bg-slate-500 absolute bottom-5 left-5 rounded-full p-3">
                                        <ArrowUpRight size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </div>
    )
}