import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { ArticleInterface } from "../types";

const articleDetails: ArticleInterface[] = [
    {
        id: 1,
        title: "Cara Efektif Mengelola Sampah Rumah Tangga",
        image: "/images/about.jpg",
        description: "Pelajari cara mudah dan efektif dalam mengelola sampah rumah tangga sehari-hari.",
        content: `Mengelola sampah rumah tangga adalah langkah awal untuk menjaga lingkungan. Berikut adalah beberapa cara:

1. Pisahkan sampah organik dan anorganik.
2. Gunakan komposter untuk sampah dapur.
3. Daur ulang botol plastik dan kertas.
4. Kurangi penggunaan plastik sekali pakai.

Langkah-langkah kecil ini bisa membawa perubahan besar.`,
    },
    {
        id: 2,
        title: "Transportasi Ramah Lingkungan di Kota Besar",
        image: "/images/about2.jpg",
        description: "Solusi transportasi yang lebih hijau dan sehat untuk masa depan kota kita.",
        content: `Kota besar perlu solusi transportasi berkelanjutan. Beberapa pendekatan yang bisa dilakukan:

1. Perbanyak jalur sepeda.
2. Subsidi kendaraan listrik.
3. Optimalkan transportasi umum.
4. Edukasi masyarakat tentang emisi karbon.

Investasi dalam transportasi hijau sangat penting untuk masa depan.`,
    },
];

export default function ArticleDetailPage() {
    const { id } = useParams();
    const article = articleDetails.find((a) => a.id === Number(id));

    if (!article) {
        return (
            <section className="min-h-screen pt-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-xl md:text-2xl font-semibold">Artikel tidak ditemukan.</h1>
                    <Link to="/artikel" className="text-accent underline mt-4 block">← Kembali ke Artikel</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            <div className="container mx-auto max-w-3xl px-4 md:px-0 py-24">
                <div className="bg-tertiary dark:bg-tertiaryDark p-6 md:p-8 rounded-xl">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 md:h-60 object-cover rounded-lg mb-6"
                    />
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h1>
                    <p className="text-textBody dark:text-textBodyDark text-sm md:text-base whitespace-pre-line">{article.content}</p>
                    <Link
                        to="/artikel"
                        className="inline-flex items-center gap-2 mt-8 bg-accent dark:bg-accentDark text-textDark px-3 py-1.5 rounded-lg text-sm md:text-base hover:bg-indigo-700 transition-all duration-200"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Artikel
                    </Link>
                </div>
            </div>
        </section>
    );
}
