/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TermsModal from "../modals/TermsModal";

export default function CoinExchangeForm() {
    const [showModal, setShowModal] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [amount, setAmount] = useState("");
    const [showAmountError, setShowAmountError] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const options = {
        Bank: ["BCA", "Mandiri", "BNI", "BRI"],
        "E-Wallet": ["DANA", "OVO", "GoPay", "ShopeePay"],
    };

    const handleAmountChange = (e: { target: { value: any } }) => {
        const value = e.target.value;
        setAmount(value);
        setShowAmountError(value && Number(value) < 10000);
    };

    const handleTermsClick = () => {
        setShowModal(true);
    };

    const handleAgree = () => {
        setAgreed(true);
        setTermsChecked(true);
        setShowModal(false);
    };

    const handleSelect = (item: string) => {
        setSelected(item);
        setOpen(false);
    };

    return (
        <>
            <form className="bg-tertiary dark:bg-tertiaryDark p-6 rounded-lg shadow-md max-w-md mx-auto mt-10 space-y-6">
                <h2 className="text-xl font-semibold">Tukar Koin</h2>

                <div className="flex flex-col">
                    <label htmlFor="amount" className="text-sm mb-1">Jumlah Koin</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        className="p-2 rounded bg-background dark:bg-backgroundDark border border-textBody"
                        placeholder="Masukkan jumlah koin"
                    />
                    {showAmountError && (
                        <p className="text-red-500 text-sm mt-1">Minimal penukaran adalah 10.000 koin</p>
                    )}
                </div>

                <div className="relative">
                    <label className="text-sm mb-1 block">Pilih Penukaran</label>
                    <div
                        className="p-2 rounded bg-background dark:bg-backgroundDark border border-textBody cursor-pointer"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        {selected || "Pilih opsi penukaran..."}
                    </div>

                    <AnimatePresence>
                        {open && (
                            <motion.ul
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full max-h-40 overflow-y-auto bg-white dark:bg-backgroundDark border-r border-l border-b border-textBody rounded shadow-lg"
                            >
                                {Object.entries(options).map(([group, values]) => (
                                    <li key={group} className="px-3 py-1 font-semibold">
                                        {group}
                                        <ul>
                                            {values.map((item) => (
                                                <li
                                                    key={item}
                                                    className="text-sm px-3 py-2 text-textBody dark:text-textBodyDark hover:bg-accent hover:text-white dark:hover:bg-accentDark cursor-pointer"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-start gap-2 text-sm">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsChecked}
                        onChange={handleTermsClick}
                        className="mt-1"
                    />
                    <label htmlFor="terms" onClick={handleTermsClick} className="cursor-pointer">
                        Saya menyetujui <span className="underline">syarat dan ketentuan</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!agreed || Number(amount) < 10000}
                    className={`w-full p-2 rounded ${agreed && Number(amount) >= 10000
                        ? "bg-accent hover:opacity-90"
                        : "bg-gray-500 cursor-not-allowed"
                        }`}
                >
                    Tukar Sekarang
                </button>
            </form>

            {showModal && (
                <TermsModal
                    onClose={() => setShowModal(false)}
                    onAgree={handleAgree}
                />
            )}
        </>
    );
}
