export interface IKpiSnapshotService {
  createSnapshotForWindow(windowFrom: Date, windowTo: Date): Promise<void>;
}