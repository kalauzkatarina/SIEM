import { StatCardProps } from "../../types/props/dashboard/StatCardProps";

export default function StatCard({ title, value, valueDescription, icon, iconColor, subtitle }: StatCardProps) {

    if (subtitle) {
        return (
            <div className="flex h-full flex-col items-start bg-white w-[40%] border border-gray-200 gap-4 rounded-[12px] shadow-sm text-slate-800 p-3!">
                <h3 className="text-[14px] text-slate-500 font-semibold m-0">
                    {title}
                </h3>

                <p className="text-[clamp(16px,1.8vw,22px)] -mt-2 text-slate-700">
                    {subtitle}
                </p>

                <p className="text-[clamp(16px,1.8vw,22px)] font-bold text-slate-900 break-words overflow-hidden">
                    {value}
                    {valueDescription && (
                        <span className="text-[clamp(12px,1.2vw,18px)] font-normal text-slate-500 ml-1.5!">
                            {valueDescription}
                        </span>
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 rounded-[10px] bg-white flex-1 border border-gray-200 flex-1 text-slate-800 shadow-sm p-4! h-full">
            {icon && (
                <div style={{ color: iconColor }} className="text-[38px]">
                    {icon}
                </div>
            )}

            <div className="flex flex-col justify-start h-full">
                <h3 className="m-0 text-[14px] font-semibold text-slate-500">{title}</h3>
                <p className="text-[clamp(20px,2.2vw,22px)] font-bold text-slate-900 break-all">
                    {value}
                    {valueDescription && (
                        <span className="text-[clamp(12px,1.2vw,18px)] font-normal text-slate-500 ml-1.5!">
                            {valueDescription}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}
