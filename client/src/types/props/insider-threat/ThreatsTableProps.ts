import { InsiderThreatDTO } from "../../../models/insider-threat/InsiderThreatDTO";

export interface ThreatsTableProps {
  threats: InsiderThreatDTO[];
  onSelectThreat: (id: number) => void;
}
