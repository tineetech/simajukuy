'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Hourglass } from 'lucide-react';

type StatusType = 'Selesai' | 'Diproses' | 'Menunggu';

const reports: {
    id: number;
    title: string;
    date: string;
    status: StatusType;
    description: string;
}[] = [
        {
            id: 1,
            title: 'Jalan berlubang di Jl. Merpati',
            date: '2025-04-21',
            status: 'Diproses',
            description: 'Laporan sedang dalam proses oleh petugas lapangan.',
        },
        {
            id: 2,
            title: 'Tumpukan sampah di TPS ilegal',
            date: '2025-04-20',
            status: 'Selesai',
            description: 'Masalah telah ditangani dan area sudah dibersihkan.',
        },
        {
            id: 3,
            title: 'Pohon tumbang menutup jalan',
            date: '2025-04-19',
            status: 'Menunggu',
            description: 'Menunggu konfirmasi dari pihak berwenang.',
        },
    ];

const statusIcon = {
    Selesai: <CheckCircle className="text-green-500" size={20} />,
    Diproses: <Clock className="text-yellow-500" size={20} />,
    Menunggu: <Hourglass className="text-red-500" size={20} />,
};

export default function ReportHistoryTable() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md space-y-3"
        >
            {reports.map((report) => (
                <motion.div
                    key={report.id}
                    className="relative rounded-xl p-4 bg-background dark:bg-backgroundDark shadow hover:shadow-md transition cursor-pointer"
                    onMouseEnter={() => setHoveredId(report.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="font-semibold text-sm">{report.title}</div>
                            <div className="text-xs text-textBody dark:text-textBodyDark">{report.date}</div>
                        </div>
                        <div>{statusIcon[report.status]}</div>
                    </div>
                    <AnimatePresence>
                        {hoveredId === report.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-xs text-textBody dark:text-textBodyDark overflow-hidden"
                            >
                                {report.description}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </motion.div>
    );
}
