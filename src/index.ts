import { createHmac, createHash, createCipheriv, randomBytes } from "crypto";
import { ErrorCodes, HError } from "./errors";

const IV = randomBytes(16);

/** Supported hash algorithms */
export type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

/** Crypt algorithms */
// export type CryptAlgorithms = "aes-128-gcm" | "aes-192-gcm" | "aes-256-gcm";

/** Hash sizes */
export const _hashSizes: { [k in HashAlgorithm]: number } = {
	md5: 16,
	sha1: 20,
	sha256: 32,
	sha512: 64,
};

/**
 * Generate token from Data
 * @param {string|Buffer}	data	- Data to sign. When string, will be encoded as "utf8". To use different encoding, insert a buffer instead.
 * @param {string}	secret	- Secret key
 * @param {string}	algorithm	- Hash algorithm @default sha256
 */
export function sign(
	data: string | Buffer,
	secret: string | Buffer,
	algorithm: HashAlgorithm = "sha512"
): Buffer {
	if (typeof data === "string") data = Buffer.from(data, "utf8");
	const hashAlg = createHmac(algorithm, secret);
	hashAlg.update(data);
	return Buffer.concat([hashAlg.digest(), data]);
}

/** verify and return data */
export function verify(
	data: string | Buffer,
	secret: string | Buffer,
	hashAlgorithm: HashAlgorithm = "sha512"
) {
	if (typeof data === "string") data = Buffer.from(data, "base64url");
	//* Decode signed data: Buffer.concat([B_ENCODE_TYPE_SIGN, hashAlg.digest(), data]);
	var hashSize = _hashSizes[hashAlgorithm],
		i: number;
	var hash = data.slice(0, hashSize);
	var resultData = data.slice(hashSize);
	//* Check data correct
	const hashAlg = createHmac(hashAlgorithm, secret);
	hashAlg.update(resultData);
	var resultHash = hashAlg.digest();
	if (resultHash.compare(hash) !== 0)
		throw new HError(
			ErrorCodes.WRONG_HASH,
			`Wrong data hash. Expected: "${resultHash.toString(
				"hex"
			)}", received: "${hash.toString("hex")}"`
		);
	return resultData;
}

// /**
//  * Encrypt data
//  */
// export function encrypt(
// 	data: string | Buffer,
// 	secret: string,
// 	hashAlgorithm: HashAlgorithm = "sha512",
// 	cryptAlgorithm: CryptAlgorithms = "aes-256-gcm"
// ) {
// 	if (typeof data === "string") data = Buffer.from(data, "utf8");
// 	// Create hash
// 	const hashAlg = createHash(hashAlgorithm);
// 	hashAlg.update(data);
// 	const hash = hashAlg.digest();
// 	// Concat data & hash
// 	const b2crypt = Buffer.alloc(data.length + hash.length);
// 	hash.copy(b2crypt, 0);
// 	data.copy(b2crypt, hash.length);
// 	// Crypt all
// 	const c = createCipheriv(cryptAlgorithm, secret, IV);
// 	c.update(b2crypt);
// 	return Buffer.concat([IV, c.final(), c.getAuthTag()]);
// }

// /**
//  * Decrypt data
//  * @param {Buffer|base64url_string} data - data to decode. If string and not base64url, convert it to buffer with your logic: like Buffer.from(data, "Encoding")
//  */
// export function decrypt(
// 	data: string | Buffer,
// 	secret: string,
// 	hashAlgorithm: HashAlgorithm = "sha512",
// 	cryptAlgorithm: CryptAlgorithms = "aes-256-gcm"
// ) {
// 	// if (typeof data === "string") data = Buffer.from(data, "base64url");
// 	// // Decrypt data
// 	// const iv = data.slice(0, 16);
// 	// const c = createCipheriv(cryptAlgorithm, secret, IV);
// 	// TODO
// 	throw new Error("Unimplemented!");
// }
