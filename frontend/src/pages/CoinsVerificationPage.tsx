import { SetStateAction, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import clsx from "clsx";
import SearchBar from "../components/widgets/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import OptionFilter from "../components/widgets/OptionFilterProps";

const statusColor = {
    Tertunda: "bg-yellow-100 text-yellow-800",
    Berhasil: "bg-green-100 text-green-800",
    Ditolak: "bg-red-100 text-red-800",
};

export default function CoinVerificationPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Tertunda");
    const statusOptions = ["Semua", "Tertunda", "Berhasil", "Ditolak"];
    const [dummyData, setDummyData] = useState([
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
    ]);

    useEffect(() => {
        getPenukaran();
    }, []);

    const token = localStorage.getItem("authToken") ?? "";
    const getPenukaran = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_USER_SERVICE}/api/koin/riwayat-penukaran`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res) console.log("gagal get penukaran: ", res);

            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };

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
            <div className="flex flex-col md:flex-row justify-between gap-3">
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

            {/* Desktop Table */}
            <div className="bg-tertiary dark:bg-tertiaryDark shadow-md rounded-md border border-textBody overflow-x-auto hidden md:block">
                <table className="min-w-full text-sm">
                    <thead className="text-left uppercase text-xs bg-primary dark:bg-primaryDark text-textDark">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Jumlah</th>
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
                                                "p-1.5 rounded-md",
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
                                                "p-1.5 rounded-md",
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {filteredData.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-tertiary dark:bg-tertiaryDark rounded-md p-4 shadow-md border border-textBody"
                    >
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex justify-between w-full items-center">
                                <h3 className="text-lg font-medium">{item.user}</h3>
                                <span
                                    className={clsx(
                                        "px-2 py-1 rounded-full text-xs font-medium inline-block",
                                        statusColor[item.status as keyof typeof statusColor]
                                    )}
                                >
                                    {item.status}
                                </span>
                            </div>
                            <h4 className="text-textBody dark:text-textBodyDark">{item.email}</h4>
                            <h4 className="text-lg">Metode : {item.method}</h4>
                            <h4 className="text-lg">Jumlah : {item.coin}</h4>
                        </div>

                        <div className="flex justify-between mt-4 items-center">
                            <h4>{item.date}</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVerify(item.id)}
                                    disabled={item.status !== "Tertunda"}
                                    className={clsx(
                                        "p-2 rounded-md text-white",
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
                                        "p-2 rounded-md text-white",
                                        item.status === "Tertunda"
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-red-900 opacity-40 cursor-not-allowed"
                                    )}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredData.length === 0 && (
                    <div className="text-center text-gray-400 p-4">
                        Tidak ada data ditemukan.
                    </div>
                )}
            </div>
        </div>
    );
}
