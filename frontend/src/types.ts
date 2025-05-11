export interface PostInterface {
    id: number;
    user_id: number;
    username: string;
    avatar: string;
    image: string;
    content: string;
    type: string;
    users: {
        user_id: number
        username: string
    };
    created_at: string;
    likes: number;
    comment_count: number;
    like_count: number;
    comments: object;
}

export interface CommentInterface {
    id: number;
    avatar: string;
    username: string;
    replyTo?: string;
    content: string;
}

export interface ArticleInterface {
    id: number;
    title: string;
    image: string;
    description: string;
    content: string;
}

export interface Report {
    [x: string]: string;
    title: string;
    submittedAt: string;
    description: string;
    image: string;
    status: "Tertunda" | "Diterima" | "Diproses" | "Selesai"
};

export interface ReportedPost {
    image?: string;
    reportedBy: string;
    date: string;
    content: string;
    reason: string;
}