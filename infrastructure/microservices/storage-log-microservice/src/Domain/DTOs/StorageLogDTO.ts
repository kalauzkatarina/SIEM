export interface StorageLogDTO {
    storageLogId: number;
    fileName: string;
    archiveType: "EVENT" | "ALERT";
    recordCount: number;
    fileSize: number;
    createdAt: string;
}