import { useEffect, useState, useRef, useCallback } from "react";
import PostForm from "../components/forms/PostForm";
import PostItem from "../components/PostItem";
import SortFilter from "../components/widgets/SortFilter";
import TrendingTopics from "../components/TrendingTopics";
import { PostInterface } from "../types";

export default function CommunityPage() {
    const [sortBy, setSortBy] = useState("terbaru");
    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_POST_SERVICE}/api/postingan/?page=${page}&limit=10}`
            );
            const data = await response.json();
            if (data?.data) {
                setPosts((prevPosts) => [...prevPosts, ...data.data]);
                setHasMore(data.pagination.currentPage < data.pagination.totalPages);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const lastPostElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "populer") return b.like_count - a.like_count;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <section className="bg-background text-text dark:bg-backgroundDark py-10 dark:text-textDark h-full">
            <div className="container mx-auto w-full py-12 pt-24 px-6">
                <h1 className="text-3xl font-bold mb-6">Komunitas</h1>
                <PostForm />
                <TrendingTopics />
                <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
                <div className="space-y-6">
                    {sortedPosts.length > 0 ? sortedPosts.map((post, index) => (
                        <div key={post.id} ref={index === sortedPosts.length - 1 ? lastPostElementRef : null}>
                            <PostItem post={post} />
                        </div>
                    )) : (
                        <div className="flex flex-col gap-5 mt-5 ">
                            <div className="bg-gray-100  dark:bg-tertiaryDark w-full overflow-hidden rounded-xl">
                                <div className="loading-box w-full h-full py-20 bg-tertiaryDark dark:bg-white">
                                </div>
                            </div>
                            <div className="bg-gray-100  dark:bg-tertiaryDark w-full overflow-hidden rounded-xl">
                                <div className="loading-box w-full h-full py-20 bg-tertiaryDark dark:bg-white">
                                </div>
                            </div>
                        </div>
                    )}
                    {loading && <p className="text-center">Loading more posts...</p>}
                    {!hasMore && posts.length > 0 && <p className="text-center text-gray-500 mt-4">Tidak ada lagi postingan.</p>}
                </div>
            </div>
        </section>
    );
}