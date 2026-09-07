import { EventRow } from "../../../types/events/EventRow";
import { RecentEventsTableRow } from "./RecentEventsTableRow";

export default function RecentEventsTable({ events }: { events: EventRow[] }) {

    return (
        <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-200 m-2.5! mt-3!">
            <table className="w-full border-collapse font-sans text-[14px]">
                <thead className="bg-slate-100/80">
                    <tr>
                        <th className="px-4! py-3! text-center text-slate-600 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">Source</th>
                        <th className="px-4! py-3! text-center text-slate-600 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">Date and Time</th>
                        <th className="px-4! py-3! text-center text-slate-600 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">Type</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {events.map((e, index) => (
                        <RecentEventsTableRow e={e} index={index} key={e.id}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}