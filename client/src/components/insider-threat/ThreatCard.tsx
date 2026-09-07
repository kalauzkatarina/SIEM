import { ThreatCardProps } from "../../types/props/insider-threat/ThreatCardProps";

export default function ThreatCard({ measurementUnit, color, message }: ThreatCardProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] rounded-[12px] p-5! border border-[rgba(255,255,255,0.1)] backdrop-blur-[10px]">
      <div
        className="font-bold text-[28px]"
        style={{ color }}
      >
        {measurementUnit}
      </div>
      <div className="text-[12px] text-[#a6a6a6] mt-1!">{message}</div>
    </div>
  );
}