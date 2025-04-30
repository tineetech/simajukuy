const dummyTrends = ["#SampahKota", "#WiFiTaman", "#LampuJalan", "#Macet"];

export default function TrendingTopics() {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Tren Topik</h2>
            <div className="flex flex-wrap gap-2">
                {dummyTrends.map((trend) => (
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
