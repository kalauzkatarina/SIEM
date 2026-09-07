import { ScoreInput } from "../types/ScoreInput";
import { SMScore } from "../types/SMScore";
export interface ISecurityMaturityService {
  calculateCurrentMaturity(input: ScoreInput): Promise<SMScore>;
}
