import { createHmac, createHash, createCipheriv, randomBytes } from "crypto";

const IV = randomBytes(16);

/** Use compiler */
export enum EncoderType {
	SIGN,
	ENCODE,
}
//* ENCODE TYPES
const B_ENCODE_TYPE_SIGN = Buffer.alloc(1);
B_ENCODE_TYPE_SIGN.writeUInt8(EncoderType.SIGN);
const B_ENCODE_TYPE_ENCODE = Buffer.alloc(1);
B_ENCODE_TYPE_ENCODE.writeUInt8(EncoderType.ENCODE);

/**
 * Generate token from Data
 * @param {string|Buffer}	data	- Data to sign. When string, will be encoded as "utf8". To use different encoding, insert a buffer instead.
 * @param {string}	secret	- Secret key
 * @param {string}	algorithm	- Hash algorithm @default sha256
 */
export function sign(
	data: string | Buffer,
	secret: string,
	algorithm: HashAlgorithm = "sha256"
): Buffer {
	if (typeof data === "string") data = Buffer.from(data, "utf8");
	const hashAlg = createHmac(algorithm, secret);
	hashAlg.update(data);
	return Buffer.concat([B_ENCODE_TYPE_SIGN, hashAlg.digest(), data]);
}

/**
 * Encode data
 */
export function encode(
	data: string | Buffer,
	secret: string,
	hashAlgorithm: HashAlgorithm = "sha256",
	cryptAlgorithm: CryptAlgorithms = "aes-256-gcm"
) {
	if (typeof data === "string") data = Buffer.from(data, "utf8");
	// Create hash
	const hashAlg = createHash(hashAlgorithm);
	hashAlg.update(data);
	const hash = hashAlg.digest();
	// Concat data & hash
	const b2crypt = Buffer.alloc(data.length + hash.length);
	hash.copy(b2crypt, 0);
	data.copy(b2crypt, hash.length);
	// Crypt all
	const c = createCipheriv(cryptAlgorithm, secret, IV);
	c.update(b2crypt);
	return Buffer.concat([B_ENCODE_TYPE_ENCODE, IV, c.final(), c.getAuthTag()]);
}

/** Decode data */
export function decode(
	data: string | Buffer,
	secret: string,
	hashAlgorithm: HashAlgorithm = "sha256",
	cryptAlgorithm: CryptAlgorithms = "aes-256-gcm"
) {}

/** Supported hash algorithms */
export type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

/** Crypt algorithms */
export type CryptAlgorithms = "aes-128-gcm" | "aes-192-gcm" | "aes-256-gcm";
