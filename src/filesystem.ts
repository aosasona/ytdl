import fs from "node:fs";
import path from "node:path";
import { extractErrorMsg } from "./error";

const DATA_DIR = path.join(__dirname, "..", "data");

export function createDataDirIfNotExists(): string | null {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      console.log("Creating data dir");
      fs.mkdirSync(DATA_DIR);
    }
    return null;
  } catch (e: unknown) {
    return "Failed to create root dir: " + extractErrorMsg(e);
  }
}

// export function checkIDExists(id: string): boolean {
//   return false;
// }
