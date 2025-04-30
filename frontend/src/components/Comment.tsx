import { ArrowRight } from "lucide-react";
import { CommentInterface } from "../types";

interface CommentProps{
    comment: CommentInterface
}

export default function Comment({ comment }: CommentProps) {
    return (
        <div className="flex items-center gap-3 py-2 border-t border-white/10">
            <img src={comment.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover mt-1" />
            <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                    <span>@{comment.username}</span>
                    {comment.replyTo && (
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                            <ArrowRight size={14} />
                            <span>@{comment.replyTo}</span>
                        </span>
                    )}
                </div>
                <p className="text-sm mt-1 text-white">{comment.content}</p>
            </div>
        </div>
    );
}
