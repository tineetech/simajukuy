type ReportStatusFilterProps = {
    filterStatus: string,
    setFilterStatus: (status: string) => void,
}

export default function ReportStatusFilter({filterStatus, setFilterStatus}: ReportStatusFilterProps) {
    return (
        <div className="flex gap-4 mb-4">
            {["Semua", "Diterima", "Diproses", "Selesai"].map((status) => (
                <button
                    key={status}
                    className={`font-medium ${filterStatus === status ? "" : "text-textBody/70 dark:text-textBody"
                        }`}
                    onClick={() => setFilterStatus(status)}
                >
                    {status}
                </button>
            ))}
        </div>
    )
}