import { motion, AnimatePresence } from "framer-motion";
import { Report } from "../types";

interface ReportModalProps {
    report: Report | null;
    onClose: () => void;
    onVerify?: () => void;
}

export default function ReportModal({ report, onClose, onVerify }: ReportModalProps) {
    return (
        <AnimatePresence>
            {report && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-tertiary p-6 rounded-xl shadow-xl w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <img
                            src={report.image}
                            alt={report.title}
                            className="rounded-lg mb-4 w-full max-h-56 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-text">{report.title}</h2>
                        <p className="text-sm text-textBody mt-2">{report.description}</p>
                        <p className="text-xs text-textBody mt-3">
                            Dilaporkan pada: <span>{report.submittedAt}</span>
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    onVerify?.();
                                    onClose();
                                }}
                                className="px-3 py-1.5 text-sm bg-primary hover:bg-primary/50 transition text-white rounded-md"
                            >
                                Verifikasi
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
