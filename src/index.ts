require("dotenv").config();

import Fastify, { FastifyRequest } from "fastify";
import { panic, unwrapException } from "./error";
import setup from "./setup";
import config from "./config";
import { existsInFilesystem } from "./filesystem";

const server = Fastify({ logger: true });
setup(server).catch((e: unknown) => panic("Failed to setup server" + (e as Error)?.message ?? e));

type ConvertRequest = FastifyRequest<{ Body: { id: string } }>;
type ConvertResponse = {
	id: string;
	title: string;
	audioUrl: string;
	youtubeUrl: string;
};

// Endpoints
server.post("/convert", async (request: ConvertRequest, reply) => {
	try {
		const { id } = request.body;

		if (id === undefined || id === "") return reply.code(400).send({ error: "Invalid ID" });
		if (id.length < 11) return reply.code(400).send({ error: "ID should be at least 11 characters long" });

		if (existsInFilesystem(id)) {
			const { getVideoTitle } = await import("./requests");
			const title = await getVideoTitle(id);
			const data: ConvertResponse = {
				id,
				title: title,
				audioUrl: `${config.apiUrl}/audio/${id}.mp3`,
				youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
			};
			return reply.send({ message: "Fetched from cache!", data });
		}

		const { convertToMP3 } = await import("./requests");
		const response = await convertToMP3(id);
		if (response === null) return reply.code(500).send({ error: "Failed to convert to audio" });
		if (response.status == "processing") return reply.code(102).send({ message: "Processing..." });

		const { downloadToDisk } = await import("./filesystem");
		const filename = await downloadToDisk(response.link, id);
		if (filename === null) return reply.code(500).send({ error: "Failed to download audio" });

		const data: ConvertResponse = {
			id,
			title: response.title,
			audioUrl: `${config.apiUrl}/audio/${filename}`,
			youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
		};
		return reply.send({ message: "Here you go!", data });
	} catch (e) {
		const { code, error } = unwrapException(e);
		reply.code(code).send({ error });
	}
});

try {
	const port = config.port;
	console.log("Listening on http://0.0.0.0:" + port);
	server.listen({ port, host: "0.0.0.0" });
} catch (e) {
	panic("Failed to start server: " + e);
}
