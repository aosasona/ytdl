export default {
	yjAPIKey: process.env.YTJAR_API_KEY as string,
	port: parseInt(process.env?.PORT || "5132"),
	apiUrl: process.env?.API_URL || "http://localhost:5132",
} as const;
