export class CustomException extends Error {
  code: number;

  constructor(message: string, code: number = 500) {
    super(message);
    this.name = "CustomException";
    this.code = code;
  }
}

export function extractErrorMsg(e: unknown): string {
  return e instanceof CustomException ? e.message : "Unknown error";
}

export function panic(msg: string): never {
  console.error(msg);
  process.exit(1);
}
