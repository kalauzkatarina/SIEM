import { ArchiveRow } from "../types/storage/ArchiveRow";

export function sortArchives(archives: ArchiveRow[], sortType: number): ArchiveRow[] {
    let copy = [...archives];
    //name, size, date
    if(sortType === 1){
        copy.sort((a, b) => a.fileName.localeCompare(b.fileName));
    } else if(sortType === 2) {
        copy.sort((a, b) => b.fileName.localeCompare(a.fileName));
    } else if(sortType === 3){
        copy.sort((a, b) => a.fileSize - b.fileSize);
    } else if(sortType === 4){
        copy.sort((a, b) => b.fileSize - a.fileSize);
    } else if(sortType === 5){
        copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortType === 6){
        copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return copy;
}