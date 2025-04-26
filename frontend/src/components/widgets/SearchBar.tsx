import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeHolder: string;
}

export default function SearchBar({ value, onChange, placeHolder }: SearchBarProps) {
    return (

        <div className="w-full relative">
            <input
                type="text"
                placeholder={placeHolder}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-tertiary placeholder-textBody dark:bg-tertiaryDark dark:placeholder-textBodyDark focus:outline-none focus:ring-2 focus:ring-accent"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <Search className="absolute right-4 top-3 text-textBody dark:text-textBodyDark" size={20} />
        </div>
    );
}
