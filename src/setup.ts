import { FastifyInstance } from "fastify";
import { panic } from "./error";
import { createDataDirIfNotExists } from "./filesystem";

export default async function setup(server: FastifyInstance) {
	// Check if API key is set
	require("dotenv").config();
	if (!apiKeyIsSet()) panic("API key not set, please set the `YTJAR_API_KEY` environment variable.");

	// Attempt to create data dir if it doesn't exist
	const err = createDataDirIfNotExists();
	if (err) panic(err);

	server.register(require("@fastify/cors"), {
		origin: "*",
	});
}

function apiKeyIsSet(): boolean {
	const API_KEY = process.env.YTJAR_API_KEY as string;
	return API_KEY !== undefined && API_KEY !== "";
}
