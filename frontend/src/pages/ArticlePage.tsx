import { useState, useEffect } from "react";
import SearchBar from "../components/widgets/SearchBar";
import ArticleCard from "../components/cards/ArticleCard";
import { fetchArticles } from "../services/getArtikel.tsx";

interface ScrapedArticle {
  title: string;
  url: string;
  image: string;
  category?: string;
}

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<ScrapedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        // Combine main headline and secondary headlines
        const allArticles = [data.mainHeadline, ...data.secondaryHeadlines];
        setArticles(allArticles);
      } catch (err) {
        setError("Failed to load articles. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
        <div className="container mx-auto pt-35 px-4 md:px-20">
          <div className="flex justify-center items-center h-screen">
            <p>Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
        <div className="container mx-auto pt-35 px-4 md:px-20">
          <div className="flex justify-center items-center h-screen">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
      <div className="container mx-auto pt-35 px-4 md:px-20">
        {/* Hero Section */}
        <div
          className="grid gap-4 mb-20
          grid-cols-2
          md:grid-cols-4 md:grid-rows-3 md:h-[600px]"
          style={{
            gridTemplateAreas:
              window.innerWidth >= 768
                ? `
              "a a b c"
              "a a g c"
              "d e g f"
            `
                : undefined,
          }}
        >
          <div className="bg-[url('/images/earth.webp')] bg-cover bg-center rounded-xl p-6 flex flex-col justify-between col-span-2 md:[grid-area:a] text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">
              Jelajahi Artikel Terupdate!
            </h1>
            <p className="font-bold drop-shadow-md">
              Berita Seputar Indonesia dan Dunia Hari Ini🌏
            </p>
          </div>

          {articles.length > 0 && articles[0]?.image && (
            <>
              <div
                className={`bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 justify-between md:[grid-area:b]`}
                style={{
                  backgroundImage: `url('${articles[0].image}')`,
                  backgroundColor: "var(--tertiary)",
                  backgroundSize: "cover", // Gambar menutupi seluruh div
                  backgroundPosition: "center", // Menjaga gambar tetap terpusat
                  backgroundRepeat: "no-repeat", // Menghindari pengulangan gambar
                }}
              >
                <h2 className="font-semibold text-lg mb-1">
                  {articles[0].title}
                </h2>
                <p className="text-textBody dark:text-textBodyDark text-sm">
                  {articles[0].category}
                </p>
              </div>

              <div
                className="bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 md:[grid-area:c]"
                style={{
                  backgroundImage: `url('${articles[1].image}')`,
                  backgroundColor: "var(--tertiary)", // Fallback jika gambar gagal
                  backgroundSize: "cover", // Gambar menutupi seluruh elemen
                  backgroundPosition: "center", // Menjaga gambar tetap terpusat
                  backgroundRepeat: "no-repeat", // Menghindari pengulangan gambar
                }}
              >
                <h2 className="font-semibold text-lg mb-1">
                  {articles[1].title}
                </h2>
                <p className="text-textBody dark:text-textBodyDark text-sm">
                  {articles[1].category}
                </p>
              </div>

              <div
                className="bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 md:[grid-area:d]"
                style={{
                  backgroundImage: `url('${articles[2].image}')`,
                  backgroundColor: "var(--tertiary)", // Fallback jika gambar gagal
                  backgroundSize: "cover", // Gambar menutupi seluruh elemen
                  backgroundPosition: "center", // Gambar tetap terpusat
                  backgroundRepeat: "no-repeat", // Menghindari pengulangan gambar
                }}
              >
                <h2 className="font-semibold text-lg mb-1">
                  {articles[2].title}
                </h2>
                <p className="text-textBody dark:text-textBodyDark text-sm">
                  {articles[2].category}
                </p>
              </div>

              <div
                className="bg-tertiary dark:bg-tertiaryDark hidden md:flex md:flex-col rounded-xl p-4 md:[grid-area:e]"
                style={{
                  backgroundImage: `url('${articles[3].image}')`,
                  backgroundColor: "var(--tertiary)", // Fallback jika gambar gagal
                  backgroundSize: "cover", // Menjamin gambar mengisi seluruh area
                  backgroundPosition: "center", // Menjaga gambar tetap terpusat
                  backgroundRepeat: "no-repeat", // Menghindari pengulangan gambar
                }}
              >
                <h2 className="font-semibold text-lg mb-1">
                  {articles[3].title}
                </h2>
                <p className="text-textBody dark:text-textBodyDark text-sm">
                  {articles[3].category}
                </p>
              </div>
            </>
          )}

          <div className="bg-tertiary dark:bg-tertiaryDark rounded-xl p-4 flex items-center justify-center text-center md:[grid-area:g]">
            <span className="text-textBody dark:text-textBodyDark">
              🌱 Edukasi berkelanjutan
            </span>
          </div>

          <div
            className="bg-tertiary dark:bg-tertiaryDark rounded-xl p-4 flex items-center justify-center text-center md:[grid-area:f]"
            style={{
              backgroundImage: `url('/images/latbak.png')`,

              backgroundColor: "var(--tertiary)", // Fallback jika gambar gagal
            }}
          >
            <span className="text-textBody dark:text-textBodyDark">
              Lebih banyak artikel segera hadir...
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">
            Mulai perjalanan literasimu hari ini!
          </h2>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeHolder="Cari artikel..."
          />
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={index}
              article={{
                id: index,
                title: article.title,
                image: article.image,
                description: article.category || "News Article",
                content: "",
                url: article.url,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
