export interface PostInterface {
    id: number;
    username: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
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