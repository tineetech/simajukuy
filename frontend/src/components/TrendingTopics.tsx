const dummyTrends = ["#SampahKota", "#WiFiTaman", "#LampuJalan", "#Macet"];

export default function TrendingTopics({ post }) {
    console.log(post)
    const extractHashtags = (text: string) => {
    return text.match(/#\w+/g) || [];
    };

    const getUniqueHashtags = (posts: any[]) => {
    const allHashtags = posts.flatMap(post => 
        extractHashtags(post.content)
    );
    
    return [...new Set(allHashtags)]; // Mengambil nilai unik
    };

    const uniqueHashtags = getUniqueHashtags(post);
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Tren Topik</h2>
            <div className="flex flex-wrap gap-2">
                {uniqueHashtags.map((trend) => (
                    <span
                        key={trend}
                        className="text-sm bg-tertiary dark:bg-tertiaryDark px-3 py-1 rounded-full"
                    >
                        {trend}
                    </span>
                ))}
            </div>
        </div>
    );
}
