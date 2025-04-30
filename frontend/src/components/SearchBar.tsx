import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
            <h2 className="text-3xl font-semibold mr-[-75px] mb-4">Mulai perjalanan literasimu hari ini!</h2>

            <div className="w-full relative">
                <input
                    type="text"
                    placeholder="Cari artikel..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-tertiary placeholder-textBody dark:bg-tertiaryDark dark:placeholder-textBodyDark focus:outline-none focus:ring-2 focus:ring-accent"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <Search className="absolute right-4 top-3 text-textBody dark:text-textBodyDark" size={20} />
            </div>
        </div>
    );
}
