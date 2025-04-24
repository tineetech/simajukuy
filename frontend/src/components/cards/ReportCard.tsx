import { Report } from "../../types";

type ReportCardProps = {
    index: number;
    item: Report;
    onViewDetail: (report: Report) => void;
};

export default function ReportCard({ index, item, onViewDetail }: ReportCardProps) {
    return (
        <div
            key={index}
            className="bg-tertiary dark:bg-tertiaryDark rounded-md col-span-4 shadow-md p-8 flex flex-col justify-between"
        >
            <div className="flex flex-col mb-4">
                <h1 className="text font-medium mb-2 line-clamp-2">{item.title}</h1>
                <p className="text-sm line-clamp-3 text-textBody dark:text-textBodyDark">{item.description}</p>
            </div>
            <div className="flex justify-between items-center">
                <p className="text-xs font-light text-textBody dark:text-textBodyDark">{item.submittedAt}</p>
                <button onClick={() => onViewDetail(item)} className="hover:cursor-pointer">
                    Detail
                </button>
            </div>
        </div>
    );
}
