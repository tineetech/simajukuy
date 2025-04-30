export interface PostInterface {
    id: number;
    username: string;
    avatar: string;
    content: string;
    users: object;
    timestamp: string;
    likes: number;
    comment_count: number;
    like_count: number;
    comments: number;
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
    title: string;
    submittedAt: string;
    description: string;
    image: string;
    status: "Tertunda" | "Diterima" | "Diproses" | "Selesai"
};