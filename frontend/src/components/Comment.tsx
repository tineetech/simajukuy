import { ArrowRight, Trash } from "lucide-react";
import { CommentInterface } from "../types";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

interface CommentProps {
    comment: CommentInterface;
    postingan: any;
}

export default function Comment({ comment, postingan }: CommentProps) {
    const token = localStorage.getItem("authToken") ?? "";
    const decodedToken = jwtDecode(token);

    const deleteKomen = async (id: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/comments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                Swal.fire({
                    title: "Gagal Menghapus Komentar",
                    text: "Terjadi kesalahan saat menghubungi server.",
                    icon: "error",
                });
                return;
            }

            const data = await res.json();
            Swal.fire({
                title: "Berhasil Menghapus Komentar",
                text: data.message,
                icon: "success",
            }).then((res) => {
                if (res.isConfirmed) {
                    location.reload();
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    console.log({comment})

    return (
        <div className="flex gap-3 py-3 w-full">
            {/* Avatar */}
            <img
                src={comment.avatar || "https://via.placeholder.com/150"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
            />

            {/* Content */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                            <span>@{comment.username}</span>
                            {comment.replyTo && (
                                <span className="flex items-center text-xs">
                                    <ArrowRight size={14} />
                                    <span>@{comment.replyTo}</span>
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-words">
                            {comment.content}
                        </p>
                    </div>

                    {/* Delete Button */}
                    {comment.user_id === decodedToken.id && postingan.comment_count > 0 && (
                        <button
                            onClick={() => deleteKomen(comment.id)}
                            className="text-red-500 hover:text-red-600 transition"
                            title="Hapus Komentar"
                        >
                            <Trash size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
