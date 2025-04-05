import { useRef, useState } from "react";
import { Image, Camera, MapPin, Smile, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function PostForm() {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [postContent, setPostContent] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleWrapperFocus = () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        setIsFocused(true);
    };

    const handleWrapperBlur = () => {
        blurTimeoutRef.current = setTimeout(() => {
            if (!wrapperRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
                setShowEmojis(false);
            }
        }, 150);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
                setIsFocused(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmojiClick = (emoji: string) => {
        setPostContent((prev) => prev + emoji);
    };

    return (
        <motion.div
            animate={{ scale: isFocused ? 1.01 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-secondary p-4 rounded-lg mb-6 overflow-hidden"
        >
            <div
                ref={wrapperRef}
                onFocus={handleWrapperFocus}
                onBlur={handleWrapperBlur}
                tabIndex={-1}
            >
                {/* Preview Gambar di atas */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            key="image-preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative mb-4"
                        >
                            <img src={selectedImage} alt="preview" className="rounded-lg max-h-60 object-cover" />
                            <button
                                className="absolute top-2 right-2 bg-black/60 p-1 rounded-full hover:bg-black/80"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text Area */}
                <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full bg-tertiary text-white p-3 rounded-lg resize-none outline-none"
                    rows={isFocused ? 4 : 3}
                    placeholder="Apa yang ingin kamu bagikan hari ini?"
                />

                {/* Aksi Form */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            key="form-actions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between mt-2 px-1">
                                <div className="flex gap-4 text-gray-400">
                                    <button
                                        type="button"
                                        className="hover:text-accent"
                                        title="Gambar"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Image size={20} />
                                    </button>
                                    <button type="button" className="hover:text-accent" title="Kamera">
                                        <Camera size={20} />
                                    </button>
                                    <button type="button" className="hover:text-accent" title="Lokasi">
                                        <MapPin size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        className="hover:text-accent"
                                        title="Emoji"
                                        onClick={() => setShowEmojis((prev) => !prev)}
                                    >
                                        <Smile size={20} />
                                    </button>
                                </div>
                                <button className="bg-accent text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition">
                                    Posting
                                </button>
                            </div>

                            {/* Picker Emoji */}
                            <AnimatePresence>
                                {showEmojis && (
                                    <motion.div
                                        key="emoji-picker"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.25 }}
                                        className="mt-2 grid grid-cols-8 gap-2 text-lg bg-tertiary p-2 rounded-lg"
                                    >
                                        {["😀", "😂", "😎", "😢", "🤔", "🔥", "❤️", "👍", "🙌", "🌟", "💡", "💬"].map((emoji) => (
                                            <button
                                                key={emoji}
                                                onClick={() => handleEmojiClick(emoji)}
                                                className="hover:scale-110 transition"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
