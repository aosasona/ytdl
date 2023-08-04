import fs from "node:fs";
import path from "node:path";
import { extractErrorMsg } from "./error";
import axios, { AxiosError } from "axios";

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

export async function downloadToDisk(url: string, id: string): Promise<string | null> {
	try {
		console.log(url);
		const response = await axios.get(url, { responseType: "stream" });
		const filename = path.join(DATA_DIR, id + ".mp3");
		const writer = fs.createWriteStream(filename);
		response.data.pipe(writer);
		return filename;
	} catch (e) {
		console.error((e as AxiosError).response?.data ?? e);
		return null;
	}
}

export function existsInFilesystem(id: string): boolean {
	return fs.existsSync(path.join(DATA_DIR, id + ".mp3"));
}
