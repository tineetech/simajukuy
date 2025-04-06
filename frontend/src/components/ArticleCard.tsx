import { Link } from "react-router-dom";
import { ArticleInterface } from "../types";

interface Props {
    article: ArticleInterface;
}

export default function ArticleCard({ article }: Props) {
    return (
        <Link
            to={`/artikel/${article.id}`}
            className="bg-secondary rounded-xl overflow-hidden hover:scale-[1.02] transition"
        >
            <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p className="text-gray-400 text-sm mt-2 line-clamp-3">{article.description}</p>
            </div>
        </Link>
    );
}
