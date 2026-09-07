import fs from "fs";

export function CleanUpFiles(dirPath: string) {
    fs.rmSync(dirPath, { recursive: true, force: true });
}