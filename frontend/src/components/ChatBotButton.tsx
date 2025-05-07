import { MessageCircle } from 'lucide-react';

type ChatBotButtonProps = {
    onClick: () => void;
};

export default function ChatBotButton({ onClick }: ChatBotButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 bg-primary dark:bg-primaryDark text-textDark rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
        >
            <MessageCircle className="w-6 h-6" />
        </button>
    )
}
