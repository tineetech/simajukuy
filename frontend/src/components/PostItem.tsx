import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2, Send, Eye, X, Flag, MessageCircleMore, Facebook, Twitter, Instagram } from "lucide-react";
import Comment from "./Comment";
import { jwtDecode } from "jwt-decode";
import { PostInterface } from "../types";
import Swal from "sweetalert2";

export default function PostItem({ post }: { post: PostInterface }) {
  const [showComments, setShowComments] = useState(false);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("authToken") ?? "";
  const [showPopup, setShowPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleLike = async (postId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        console.log(data);
      }

      alert("berhasil like");
    } catch (e) {
      console.log(e);
    }
  };

  const handleReportedPost = () => {
    console.log("Postingan telah dilaporkan");
  };

  const handleShare = () => {
    const postUrl = window.location.href;
    const text = encodeURIComponent(`Cek postingan ini!`);

    const shareOptions = [
      {
        name: "WhatsApp",
        url: `https://wa.me/?text=${text}%20${encodeURIComponent(postUrl)}`,
      },
      {
        name: "Facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      },
      {
        name: "X",
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${text}`,
      },
      {
        name: "Instagram",
        url: `https://www.instagram.com/`,
      },
    ];

    shareOptions.forEach((option) => {
      window.open(option.url, "_blank");
    });
  };

  const handlePlatformShare = (platform: string) => {
    const postUrl = window.location.href;
    const text = encodeURIComponent(`Cek postingan ini!`);
    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${text}%20${encodeURIComponent(postUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${text}`;
        break;
      case "instagram":
        url = `https://www.instagram.com/`;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
    setShowSharePopup(false);
  };

  const handleComment = async (id: number) => {
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("content", content);

    try {
      const res = await fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/${id}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData.toString(),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        Swal.fire({
          title: "Gagal Membuat Komentar",
          text: "Terjadi kesalahan saat menghubungi server.",
          icon: "error",
        });
        return;
      }

      const data = await res.json();
      console.log(data);

      Swal.fire({
        title: "Berhasil Menambahkan Komentar.",
        text: "Komentar berhasil ditambahkan.",
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

  const decodedToken: any = jwtDecode(token);

  return (
    <>
      <div className="bg-gray-100 border border-gray-300 dark:border-gray-600 dark:bg-tertiaryDark p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={post.avatar ?? "https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">@{post?.users?.username ?? "Unknown"}</p>
            <span className="text-sm text-textBody dark:text-textBodyDark">{post.timestamp}</span>
          </div>
        </div>
            {
                post.type === 'image' ? (
                    <img src={import.meta.env.VITE_POST_SERVICE + post.image} className="w-50 rounded-sm" alt="" />       
                ) : ''
            }
        <p className="text-sm md:text-base mb-3">{post.content}</p>

        <div className="flex justify-between text-textBody dark:text-textBodyDark text-sm z-10">
          <div className="flex gap-6">
            <button
              className={`flex items-center gap-1 hover:text-accent hover:cursor-pointer ${post.user_id == decodedToken.id && post.like_count > 0 ? "text-red-400" : ""
                }`}
              onClick={() => handleLike(post.id)}
            >
              <ThumbsUp size={18} /> {post.like_count}
            </button>
            <button
              className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageCircle size={18} /> {post.comment_count}
            </button>
            <button
              className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
              onClick={() => setShowPopup(true)}
            >
              <Eye size={18} /> Lihat Detail
            </button>
            <div className="relative inline-block">
              <button
                ref={shareButtonRef}
                className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
                onClick={() => setShowSharePopup(prev => !prev)}
              >
                <Share2 size={18} /> Bagikan
              </button>

              <AnimatePresence>
                {showSharePopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background dark:bg-backgroundDark shadow-md rounded-md px-4 py-2 z-50"
                  >
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => handlePlatformShare("whatsapp")}
                        title="WhatsApp"
                        className="600 hover:scale-110 transition-transform"
                      >
                        <MessageCircleMore size={24} />
                      </button>
                      <button
                        onClick={() => handlePlatformShare("facebook")}
                        title="Facebook"
                        className="00 hover:scale-110 transition-transform"
                      >
                        <Facebook size={24} />
                      </button>
                      <button
                        onClick={() => handlePlatformShare("twitter")}
                        title="X"
                        className="hover:scale-110 transition-transform"
                      >
                        <Twitter size={24} />
                      </button>
                      <button
                        onClick={() => handlePlatformShare("instagram")}
                        title="Instagram"
                        className="00 hover:scale-110 transition-transform"
                      >
                        <Instagram size={24} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
              onClick={handleReportedPost}
            >
              <Flag size={18} /> Laporkan
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-gray-200 dark:bg-gray-800 rounded-xl p-5 gap-2 flex flex-col"
            >
              {post.comments.map((comment: any) => (
                <Comment key={comment.id} postingan={post} comment={comment} />
              ))}
              <div className="flex gap-2 items-center mt-3">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-300 dark:bg-gray-700 p-3 rounded-md"
                  placeholder="Tulis komentarmu disini.."
                  name="commentContent"
                  id="commentContent"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => handleComment(post.id)}
                    className="bg-primary p-4 text-white flex items-center justify-center rounded-2xl"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div >

      {/* Popup */}
      <AnimatePresence>
        {
          showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: "rgba(0, 0, 0, .5)" }}
              transition={{ duration: 0.2 }}
              className="fixed flex items-center justify-center top-0 start-0 w-full h-screen z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-[400px] h-auto p-5 bg-tertiary dark:bg-gray-700 rounded-2xl"
              >
                <div className="flex justify-between items-center">
                  <h1 className="font-bold">Detail Postingan</h1>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => setShowPopup(false)}
                  >
                    <X />
                  </button>
                </div>
                {post.type === "image" && (
                  <img src={import.meta.env.VITE_POST_SERVICE + post.image} className="w-full" alt="" />
                )}
                <span>@{post?.users?.username ?? "Unknown"}</span>
                <p className="text-gray-300">{post.content}</p>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >
    </>
  );
}
