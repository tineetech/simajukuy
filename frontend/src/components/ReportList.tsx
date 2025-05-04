import { Report } from "../types";
import { motion } from "framer-motion";

type ReportListProps = {
    report: Report,
    index: number,
    onViewDetail: (report: Report) => void;
}

export default function ReportList({ report, onViewDetail, index }: ReportListProps) {

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "Tertunda":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
            case "Diterima":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
            case "Diproses":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200";
            case "Selesai":
                return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    return (
        <motion.div
            className="flex bg-tertiary dark:bg-tertiaryDark p-4 rounded-md shadow-md"
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout // opsional, untuk transisi yang lebih mulus saat list berganti
        >
            <div className="flex w-full justify-between items-center gap-6">
                <div className="flex gap-4 items-start w-2/3">
                    <img
                        src={report.image}
                        alt=""
                        className="rounded-md w-14 h-14 object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-medium truncate max-w-xs">{report.title}</h2>
                        <p className="text-sm text-textBody dark:text-textBodyDark line-clamp-1 max-w-md">
                            {report.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 w-1/3 shrink-0">
                    <p className="text-sm text-right whitespace-nowrap ml-auto">
                        {report.submittedAt}
                    </p>
                    <div className="flex min-w-[80px] justify-center">
                        <span
                            className={`text-sm font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(
                                report.status
                            )}`}
                        >
                            {report.status}
                        </span>
                    </div>
                    <button onClick={() => onViewDetail(report)} className="bg-primary hover:cursor-pointer px-4 py-2 text-white rounded-md text-sm whitespace-nowrap">
                        Detail Laporan
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
