import { ArrowRight, Trash } from "lucide-react";
import { CommentInterface } from "../types";
import { jwtDecode } from "jwt-decode";

interface CommentProps{
    comment: CommentInterface
    postingan: any
}

export default function Comment({ comment, postingan }: CommentProps) {
    const token = localStorage.getItem('authToken') ?? '';
    const decodedToken = jwtDecode(token);

    const deleteKomen = () => {

    }
    return (
        <div className="flex items-center gap-3 py-2 border-2 px-3 rounded-md border-gray-300 dark:border-gray-700">
            <img src={comment.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover mt-1" />
            <div className="flex w-full items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-white font-medium">
                        <span>@{comment.username}</span>
                        {comment.replyTo && (
                            <span className="flex items-center gap-1 text-gray-700 text-xs">
                                <ArrowRight size={14} />
                                <span>@{comment.replyTo}</span>
                            </span>
                        )}
                    </div>
                    <p className="text-sm mt-1 text-black dark:text-white">{comment.content}</p>
                </div>
                <div>
                    {
                        comment.user_id == decodedToken.id && postingan.comment_count > 0 ? (
                            <button className="bg-red-500 p-2 rounded-md text-white" onClick={() => deleteKomen()}>
                                <Trash />
                            </button>
                        ) : ''
                    }
                </div>
            </div>
        </div>
    );
}
