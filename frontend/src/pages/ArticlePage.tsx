import { useState } from "react";
import SearchBar from "../components/widgets/SearchBar";
import ArticleCard from "../components/cards/ArticleCard";
import { ArticleInterface } from "../types";

const articleDetails: ArticleInterface[] = [
    {
        id: 1,
        title: "Cara Efektif Mengelola Sampah Rumah Tangga",
        image: "/images/about.jpg",
        description: "Pelajari cara mudah dan efektif dalam mengelola sampah rumah tangga sehari-hari.",
        content: "...",
    },
    {
        id: 2,
        title: "Transportasi Ramah Lingkungan di Kota Besar",
        image: "/images/article2.jpg",
        description: "Solusi transportasi yang lebih hijau dan sehat untuk masa depan kota kita.",
        content: "...",
    },
    {
        id: 3,
        title: "Inovasi Energi Terbarukan di Indonesia",
        image: "/images/article3.jpg",
        description: "Bagaimana energi surya dan angin mulai menggantikan energi fosil.",
        content: "...",
    },
    {
        id: 4,
        title: "Tips Menanam di Pekarangan Rumah",
        image: "/images/article4.jpg",
        description: "Memanfaatkan ruang kecil untuk ketahanan pangan lokal.",
        content: "...",
    },
];

export default function ArticlePage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredArticles = articleDetails.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            <div className="container mx-auto pt-20 px-4 md:px-20">

                {/* Hero Section */}
                <div className="grid gap-4 mb-20
                    grid-cols-2
                    md:grid-cols-4 md:grid-rows-3 md:h-[600px]"
                    style={{
                        // Grid area layout hanya untuk desktop
                        gridTemplateAreas: window.innerWidth >= 768 ? `
                            "a a b c"
                            "a a g c"
                            "d e g f"
                        ` : undefined,
                    }}
                >
                    <div className="bg-tertiary dark:bg-tertiaryDark rounded-xl p-6 flex flex-col justify-between col-span-2 md:[grid-area:a]">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Jelajahi Artikel Edukatif
                        </h1>
                        <p className="text-textBody dark:textBodyDark">
                            Tentang kota, lingkungan, solusi hijau, dan energi masa depan.
                        </p>
                    </div>

                    <div className="bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 justify-between md:[grid-area:b]">
                        <h2 className="font-semibold text-lg mb-1">{articleDetails[0].title}</h2>
                        <p className="text-textBody dark:text-textBodyDark text-sm">{articleDetails[0].description}</p>
                    </div>

                    <div className="bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 md:[grid-area:c]">
                        <h2 className="font-semibold text-lg mb-1">{articleDetails[1].title}</h2>
                        <p className="text-textBody dark:text-textBodyDark text-sm">{articleDetails[1].description}</p>
                    </div>

                    <div className="bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 md:[grid-area:d]">
                        <h2 className="font-semibold text-lg mb-1">{articleDetails[2].title}</h2>
                        <p className="text-textBody dark:text-textBodyDark text-sm">{articleDetails[2].description}</p>
                    </div>

                    <div className="bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 md:[grid-area:e]">
                        <h2 className="font-semibold text-lg mb-1">{articleDetails[3].title}</h2>
                        <p className="text-textBody dark:text-textBodyDark text-sm">{articleDetails[3].description}</p>
                    </div>

                    <div className="bg-tertiary dark:bg-tertiaryDark rounded-xl p-4 flex items-center justify-center text-center md:[grid-area:g]">
                        <span className="text-textBody dark:text-textBodyDark">🌱 Edukasi berkelanjutan</span>
                    </div>

                    <div className="bg-tertiary dark:bg-tertiaryDark rounded-xl p-4 flex items-center justify-center text-center md:[grid-area:f]">
                        <span className="text-textBody dark:text-textBodyDark">Lebih banyak artikel segera hadir...</span>
                    </div>
                </div>

                <div className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Mulai perjalanan literasimu hari ini!</h2>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeHolder="Cari artikel..." />
                </div>

                {/* Article Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
                    {filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </section>
    );
}

