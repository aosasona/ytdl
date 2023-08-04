import Fastify, { FastifyRequest } from "fastify";
import { panic } from "./error";
import setup from "./setup";

const server = Fastify({ logger: true });
setup(server).catch((e: unknown) => panic("Failed to setup server" + (e as Error)?.message ?? e));

type ConvertRequest = FastifyRequest<{ Body: { id: string } }>;
type ConvertResponse = { id: string; audioUrl: string; youtubeUrl: string };

// Endpoints
server.post("/convert", async (request: ConvertRequest, reply) => {
	const { id } = request.body;

	const data: ConvertResponse = { id, audioUrl: "https://example.com", youtubeUrl: "https://example.com" };
	return reply.send(data);
});

try {
	const port = parseInt(process.env?.PORT || "5132");
	console.log("Listening on http://0.0.0.0:" + port);
	server.listen({ port, host: "0.0.0.0" });
} catch (e) {
	panic("Failed to start server: " + e);
}
