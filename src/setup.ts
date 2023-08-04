import { FastifyInstance } from "fastify";
import { panic } from "./error";
import { createDataDirIfNotExists } from "./filesystem";
import config from "./config";

export default async function setup(server: FastifyInstance) {
	// Check if API key is set
	if (!apiKeyIsSet()) panic("API key not set, please set the `YTJAR_API_KEY` environment variable.");

	// Attempt to create data dir if it doesn't exist
	const err = createDataDirIfNotExists();
	if (err) panic(err);

	(async () => await server.register(require("@fastify/cors"), { origin: "*" }))();
}

function apiKeyIsSet(): boolean {
	return config.yjAPIKey !== undefined && config.yjAPIKey !== "";
}
