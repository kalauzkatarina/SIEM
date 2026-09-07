import { BackupValidationResultDTO } from "../models/backup/BackupValidationResultDTO";

export const emptyBackupStats: BackupValidationResultDTO = {
    totalRuns: 0,
    successRuns: 0,
    failedRuns: 0,
    lastCheckAt: null,
    lastStatus: null
}