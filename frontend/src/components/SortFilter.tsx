interface SortFilterProps {
    sortBy: string;
    setSortBy: (value: string) => void;
}

export default function SortFilter({ sortBy, setSortBy }: SortFilterProps) {
    return (
        <div className="flex gap-4 mb-4 text-sm">
            {["terbaru", "populer"].map((type) => (
                <button
                    key={type}
                    onClick={() => setSortBy(type)}
                    className={`capitalize px-3 py-1 rounded-full transition ${sortBy === type ? "bg-accent text-white" : "bg-tertiary text-gray-400 hover:text-white"
                        }`}
                >
                    {type}
                </button>
            ))}
        </div>
    );
}
