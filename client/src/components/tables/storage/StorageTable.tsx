import { useEffect, useState } from "react";
import { StorageTableProps } from "../../../types/props/storage/StorageTableProps";
import { ArchiveRow } from "../../../types/storage/ArchiveRow";
import { sortArchives } from "../../../helpers/sortArchives";
import StorageTableRow from "./StorageTableRow";


export default function StorageTable({ archives, sortType, storageApi }: StorageTableProps) {
    const [sortedArchives, setSortedArchives] = useState<ArchiveRow[]>(archives);

    useEffect(() => {
        const sort = sortArchives(archives, sortType!);
        setSortedArchives(sort);
    }, [sortType, archives]);

    const thClass = "px-4! py-3! text-center text-[#d0d0d0] font-semibold text-[13px] border-b border-[#3a3a3a] uppercase tracking-[0.5px]"

    return (
        <div className="bg-[#1f1f1f] rounded-[10px]! overflow-hidden shadow-md border border-[#333]">
            <table className="w-full border-collapse font-sans text-[14px]">
                <thead className="bg-[#2a2a2a]">
                    <tr>
                        <th className={`${thClass} w-[40px]`}></th>
                        <th className={thClass}>Archive name</th>
                        <th className={thClass}>Time</th>
                        <th className={thClass}>Size</th>
                        <th className={thClass}>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedArchives.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-10 py-10 text-center border-b border-[#2d2d2d] text-center text-[#a6a6a6]">
                                No archives found
                            </td>
                        </tr>
                    ) : (
                        sortedArchives.map(a => <StorageTableRow key={a.id} archive={a} storageApi={storageApi} />)
                    )}
                </tbody>
            </table>
        </div>
    );
}
