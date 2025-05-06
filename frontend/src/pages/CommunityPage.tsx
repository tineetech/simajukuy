import { useEffect, useState } from "react";
import PostForm from "../components/forms/PostForm";
import PostItem from "../components/PostItem";
import SortFilter from "../components/widgets/SortFilter";
import TrendingTopics from "../components/TrendingTopics";
import { PostInterface } from "../types";

export default function CommunityPage() {
    const [sortBy, setSortBy] = useState("terbaru");
    const [posts, setPosts] = useState<PostInterface>([])

    useEffect(() => {
        const getPosts = async () => {
            try {
                fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/`)
                .then(res => res.json()) 
                .then(res => {
                    console.log(res)
                    setPosts(res.data)
                })
                
            } catch (e) {
                console.error(e)
            }
        }
        getPosts()
    }, [])

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "populer") return b.likes - a.likes;
        return b.id - a.id; // asumsi id urutan waktu (terbaru)
    });

    return (
        <section className="bg-background text-text dark:bg-backgroundDark py-10 dark:text-textDark h-full">
            <div className="container mx-auto max-w-4xl py-12 pt-24 px-6">
                <h1 className="text-3xl font-bold mb-6">Komunitas</h1>
                <PostForm />
                <TrendingTopics />
                <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
                <div className="space-y-6">
                    {sortedPosts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
}
