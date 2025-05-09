import { SetStateAction, useState } from "react";
import { Check, X } from "lucide-react";
import clsx from "clsx";
import SearchBar from "../components/widgets/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import OptionFilter from "../components/widgets/OptionFilterProps";

const dummyData = [
    {
        id: 1,
        user: "Budi Santoso",
        email: "budi@gmail.com",
        coin: 1500,
        method: "DANA",
        date: "2025-05-09 13:24",
        status: "Tertunda",
    },
    {
        id: 2,
        user: "Siti Aminah",
        email: "siti@gmail.com",
        coin: 1000,
        method: "OVO",
        date: "2025-05-09 12:40",
        status: "Berhasil",
    },
];

const statusColor = {
    Tertunda: "bg-yellow-100 text-yellow-800",
    Berhasil: "bg-green-100 text-green-800",
    Ditolak: "bg-red-100 text-red-800",
};

export default function CoinVerificationPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Tertunda");
    const statusOptions = ["Semua","Tertunda", "Berhasil", "Ditolak"];

    const filteredData = dummyData.filter(
        (item) =>
            (filterStatus === "Semua" || item.status === filterStatus) &&
            (item.user.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toLowerCase().includes(search.toLowerCase()))
    );

    const handleVerify = (id: number) => {
        console.log("Berhasil ID:", id);
    };

    const handleReject = (id: number) => {
        console.log("Ditolak ID:", id);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <OptionFilter
                    options={statusOptions}
                    selected={filterStatus}
                    onChange={(val: SetStateAction<string>) => setFilterStatus(val)}
                />
                <div className="max-w-md">
                    <SearchBar
                        value={search}
                        onChange={(val) => setSearch(val)}
                        placeHolder="Cari pengguna..."
                    />
                </div>
            </div>

            <div className="bg-tertiary dark:bg-tertiaryDark shadow-md rounded-md border-textBody border overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="text-left uppercase text-xs bg-primary dark:bg-primaryDark text-textDark">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Coin</th>
                            <th className="p-4">Metode</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredData.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="border-t border-textBody"
                                >
                                    <td className="p-4">{item.user}</td>
                                    <td className="p-4">{item.email}</td>
                                    <td className="p-4">{item.coin}</td>
                                    <td className="p-4">{item.method}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">
                                        <span
                                            className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                statusColor[item.status as keyof typeof statusColor]
                                            )}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2 text-textDark">
                                        <button
                                            onClick={() => handleVerify(item.id)}
                                            disabled={item.status !== "Tertunda"}
                                            className={clsx(
                                                "p-1.5 rounded-md cursor-pointer",
                                                item.status === "Tertunda"
                                                    ? "bg-green-500 hover:bg-green-600"
                                                    : "bg-green-900 opacity-40 cursor-not-allowed"
                                            )}
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleReject(item.id)}
                                            disabled={item.status !== "Tertunda"}
                                            className={clsx(
                                                "p-1.5 rounded-md cursor-pointer",
                                                item.status === "Tertunda"
                                                    ? "bg-red-500 hover:bg-red-600"
                                                    : "bg-red-900 opacity-40 cursor-not-allowed"
                                            )}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-gray-400">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
