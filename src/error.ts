export class CustomException extends Error {
	code: number;

	constructor(message: string, code: number = 500) {
		super(message);
		this.name = "CustomException";
		this.code = code;
	}
}

export function unwrapException(e: unknown): { code: number; error: string } {
	if (e instanceof CustomException) {
		return { code: e.code, error: e.message };
	}
	return { code: 500, error: "Unknown error" };
}

export function extractErrorMsg(e: unknown): string {
	return e instanceof CustomException ? e.message : "Unknown error";
}

export function panic(msg: string): never {
	console.error(msg);
	process.exit(1);
}
