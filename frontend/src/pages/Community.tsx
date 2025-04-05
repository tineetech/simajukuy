import { useState } from "react";
import Header from "../components/Navigations/Header";
import Footer from "../components/Navigations/Footer";
import PostForm from "../components/PostForm";
import PostItem from "../components/PostItem";
import SortFilter from "../components/SortFilter";
import TrendingTopics from "../components/TrendingTopics";
import { PostInterface } from "../types";

const dummyPosts: PostInterface[] = [
    {
        id: 1,
        username: "raka_dev",
        avatar: "/images/profile.jpg",
        content: "Ada tumpukan sampah di pinggir jalan Sudirman, tolong segera ditindak.",
        timestamp: "1 jam lalu",
        likes: 23,
        comments: 5,
    },
    {
        id: 2,
        username: "wulan",
        avatar: "/images/profile.jpg",
        content: "Saya suka ide taman kota yang ada WiFi dan charging station! 🌳📶",
        timestamp: "3 jam lalu",
        likes: 40,
        comments: 8,
    },
];

export default function Community() {
    const [sortBy, setSortBy] = useState("terbaru");

    const sortedPosts = [...dummyPosts].sort((a, b) => {
        if (sortBy === "populer") return b.likes - a.likes;
        return b.id - a.id; // asumsi id urutan waktu (terbaru)
    });

    return (
        <section className="bg-background text-text h-full">
            <Header />
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
            <Footer />
        </section>
    );
}
