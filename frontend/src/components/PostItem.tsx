import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import Comment from "./Comment";
import { PostInterface, CommentInterface } from "../types";

const dummyComments: CommentInterface[] = [
    {
        id: 1,
        avatar: "/images/profile.jpg",
        username: "wulan",
        replyTo: "raka_dev",
        content: "Setuju banget! Harus segera ditindak!",
    },
    {
        id: 2,
        avatar: "/images/profile.jpg",
        username: "agus_k",
        replyTo: "wulan",
        content: "Saya juga lihat tadi pagi 😢",
    },
];


export default function PostItem({ post }: { post: PostInterface }) {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className="bg-tertiary dark:bg-tertiaryDark p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
                <img
                    src={post.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold">@{post.username}</p>
                    <span className="text-sm text-textBody dark:text-textBodyDark">{post.timestamp}</span>
                </div>
            </div>
            <p className="text-sm md:text-base mb-3">{post.content}</p>
            <div className="flex gap-6 text-textBody dark:text-textBodyDark text-sm">
                <button className="flex items-center gap-1 hover:text-accent hover:cursor-pointer">
                    <ThumbsUp size={18} /> {post.likes}
                </button>
                <button
                    className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
                    onClick={() => setShowComments((prev) => !prev)}
                >
                    <MessageCircle size={18} /> {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-accent hover:cursor-pointer">
                    <Share2 size={18} /> Bagikan
                </button>
            </div>

            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                    >
                        {dummyComments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
