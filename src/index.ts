import { createHmac, randomBytes } from "crypto";

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
	expires: number = -1,
	algorithm: HashAlgorithm = "sha512"
): Buffer {
	if (typeof data === "string") data = Buffer.from(data, "utf8");
	const hashSize = _hashSizes[algorithm];
	const hashExpSize = hashSize + 8; // Hash & expires size
	const resultBuffer = Buffer.allocUnsafe(hashExpSize + data.length);
	resultBuffer.writeDoubleLE(expires, hashSize);
	data.copy(resultBuffer, hashExpSize);
	// Hash
	const hashAlg = createHmac(algorithm, secret);
	hashAlg.update(resultBuffer.slice(hashSize));
	hashAlg.digest().copy(resultBuffer);
	return resultBuffer;
}

/** verify and return data */
export function verify(
	data: string | Buffer,
	secret: string | Buffer,
	hashAlgorithm: HashAlgorithm = "sha512"
): verifyResult {
	if (typeof data === "string") data = Buffer.from(data, "base64url");
	//* Decode signed data: Buffer.concat([B_ENCODE_TYPE_SIGN, hashAlg.digest(), data]);
	var hashSize = _hashSizes[hashAlgorithm];
	var hash = data.slice(0, hashSize);
	const expires = data.readDoubleLE(hashSize);
	//* Check data correct
	const hashAlg = createHmac(hashAlgorithm, secret);
	hashAlg.update(data.slice(hashSize));
	var resultHash = hashAlg.digest();
	return {
		isValid: resultHash.compare(hash) === 0,
		expires: expires,
		data: data.slice(hashSize + 8),
	};
}

export interface verifyResult {
	data: Buffer;
	expires: number;
	isValid: boolean;
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

//* HASH PASSWORDS
export function hash(
	data: string | Buffer,
	secret: string | Buffer,
	hashAlgorithm: HashAlgorithm = "sha512"
): Buffer {
	if (typeof data === "string") data = Buffer.from(data, "utf8");
	const hashAlg = createHmac(hashAlgorithm, secret);
	hashAlg.update(data);
	return hashAlg.digest();
}
