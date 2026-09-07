import { useState } from "react";
import { AnomalyResultDTO } from "../../../types/ueba/AnomalyResultDTO";
import AnomalyTableRow from "./AnomalyTableRow";

interface AnomaliesTableProps {
  anomalies: AnomalyResultDTO[];
  onRowClick: (anomaly: AnomalyResultDTO) => void;
}

export default function AnomaliesTable({ anomalies, onRowClick }: AnomaliesTableProps) {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyResultDTO | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSelectAnomaly = (anomaly: AnomalyResultDTO) => {
    setSelectedAnomaly(anomaly);
    setOpenDialog(true);
    onRowClick(anomaly);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedAnomaly(null);
  };

 return (
   <div className="bg-white rounded-[14px] mt-4! overflow-hidden shadow-md border border-gray-300">
  <table className="w-full border-collapse font-sans text-[14px]!">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">Title</th>
        <th className="px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">User/Role</th>
        <th className="px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">Alerts</th>
        <th className="px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]">Detected</th>
        <th className="px-4! py-3! text-center text-gray-500 font-semibold text-[13px] border-b border-gray-200 uppercase tracking-[0.5px]"></th>
      </tr>
    </thead>

    <tbody>
      {anomalies.length === 0 ? (
        <tr>
          <td colSpan={5} className="px-10 py-10 text-center border-b border-gray-200 text-gray-500">
            No anomalies found
          </td>
        </tr>
      ) : (
        anomalies.map((anomaly, index) => (
          <AnomalyTableRow
            key={anomaly.id || index}
            anomaly={anomaly}
            index={index}
            onSelect={handleSelectAnomaly}
          />
        ))
      )}
    </tbody>
  </table>
</div>
  );
}
