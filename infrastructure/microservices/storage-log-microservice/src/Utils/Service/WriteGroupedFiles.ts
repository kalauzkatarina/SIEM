import fs from "fs";
import path from "path";

export function WriteGroupedFiles(
    baseTmpDir: string,
    groups: Record<string, string[]>
): string[] {

    const hourKeys: string[] = [];

    for (const hourKey of Object.keys(groups)) {
        const hourDir = path.join(baseTmpDir, hourKey);
        fs.mkdirSync(hourDir, { recursive: true });

        hourKeys.push(hourKey);

        groups[hourKey].forEach((line, index) => {
            const fileName = `logs_${hourKey}_${(index * 15).toString().padStart(2, "0")}.txt`;
            const filePath = path.join(hourDir, fileName);
            fs.writeFileSync(filePath, line + "\n");
        });
    }

    return hourKeys; 
}