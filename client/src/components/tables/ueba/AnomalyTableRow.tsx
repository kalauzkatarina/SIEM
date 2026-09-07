import { AnomalyResultDTO } from "../../../types/ueba/AnomalyResultDTO";
import { MdKeyboardArrowRight } from "react-icons/md";

interface AnomalyTableRowProps {
  anomaly: AnomalyResultDTO;
  index: number;
  onSelect: (anomaly: AnomalyResultDTO) => void;
}

export default function AnomalyTableRow({ anomaly, index, onSelect }: AnomalyTableRowProps) {
  const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50";

  return (
    <tr
      onClick={() => onSelect(anomaly)}
      className={`${rowBg} hover:bg-gray-100 transition-colors cursor-pointer`}
    >
      <td className="px-4! py-3! text-center border-b border-gray-200">
        <span className="text-gray-800 font-medium text-[13px]">{anomaly.title}</span>
      </td>

      <td className="px-4! py-3! text-center border-b border-gray-200">
        <span className="text-gray-500 text-[12px]">
          {anomaly.userId ? `User ${anomaly.userId}` : anomaly.userRole || "N/A"}
        </span>
      </td>

      <td className="px-4! py-3! text-center border-b border-gray-200">
        <span className="text-[#0a84ff] text-[13px] font-semibold">
          {anomaly.correlatedAlerts.length}
        </span>
      </td>

      <td className="px-4! py-3! text-center border-b border-gray-200">
        {anomaly.createdAt ? (
          <span className="text-gray-500 text-[12px]">
            {new Date(anomaly.createdAt).toLocaleDateString()} {new Date(anomaly.createdAt).toLocaleTimeString()}
          </span>
        ) : (
          <span className="text-gray-400 text-[12px]">-</span>
        )}
      </td>

      <td className="px-4! py-3! text-center border-b border-gray-200">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(anomaly); }}
          className="text-[#0a84ff] hover:text-[#0066d6] transition-colors"
        >
          <MdKeyboardArrowRight size={20} />
        </button>
      </td>
    </tr>
  );
}
