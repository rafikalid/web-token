/** Error codes */
export enum ErrorCodes {
	/** Wrong hash */
	WRONG_HASH,
}

/** Error */
export class HError extends Error {
	code: ErrorCodes;
	constructor(code: ErrorCodes, message: string) {
		super(message);
		this.code = code;
	}
}
