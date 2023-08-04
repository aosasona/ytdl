import axios from "axios";
import config from "./config";
import { CustomException } from "./error";

const YJ_URL = "https://youtube-mp36.p.rapidapi.com/dl";
const RAPID_API_HOST = "youtube-mp36.p.rapidapi.com";

export type ConvertToMP3Response = {
	link: string;
	title: string;
	progress: number;
	duration: number;
	status: "ok" | "fail" | "processing";
	msg: string;
};

export async function convertToMP3(id: string): Promise<ConvertToMP3Response | null> {
	try {
		const options = {
			method: "GET",
			url: YJ_URL,
			params: { id },
			headers: {
				"Content-Type": "application/json",
				"X-RapidAPI-Key": config.yjAPIKey,
				"X-RapidAPI-Host": RAPID_API_HOST,
			},
		};

		const response = (await axios.request(options)) as { data: ConvertToMP3Response };

		if (response.data.status == "fail") throw new CustomException(response.data.msg);

		return response?.data;
	} catch (e) {
		console.error(e);
		return null;
	}
}

export async function getVideoTitle(id: string): Promise<string> {
	try {
		const response = await axios.get(`https://www.youtube.com/watch?v=${id}`);
		const title = response.data.match(/<title>(.*?)<\/title>/)[1];
		return title;
	} catch (e) {
		console.error(e);
		return "Unknown title";
	}
}
