import { IStorageAPI } from "../../../api/storage/IStorageAPI";
import { ArchiveDTO } from "../../../models/storage/ArchiveDTO";

export interface StorageTableProps  {
    archives: ArchiveDTO[];
    sortType?: number;
    storageApi: IStorageAPI;
};