# web-token

-   Generate safe tokens for web and networks
    Fast & memory wise alternative for "jws" & "jwt" & "json web token"

-   Hash passwords before storing them on the database, best alternative to Bcrypt.

# Sign tokens

Use it to sign cookies, authorizations, ...

## Sign key

```typescript
import { sign } from 'web-token';

const signedKey: Buffer= sign(
	/** Data to sign */
	data:	string | NodeJS.ArrayBufferView,
	/** Secret key */
	secret:	string | Buffer,
	/** @optional token expiration date as timestamp */
	expires: number = -1
	/** @Optional Hash algorithm */
	algorithm: HashAlgorithm = "sha256"
);

// Convert to string using any encoding
const encodedSignedKey= signedKey.toString('base64url');
```

_Supported encoding by "::toString" are:_

-   ascii
-   utf8
-   utf-8
-   utf16le
-   ucs2
-   ucs-2
-   base64
-   base64url
-   latin1
-   binary
-   hex'

### Examples:

```javascript
import { sign } from "web-token";

// Sign text
var signedData = sign("My-vulnerable-id", "my-secret-key");

// Sign object
var signedObj = sign(
	JSON.stringify({ id: "xxxx", expires: "2070-01-01" }),
	"my-secret-key"
);

// Sign Buffer
var signedObj = sign(Buffer.from("myData", "my-encoding"), "Secret-key");
```

## Verify signature

```typescript
import { verify } from "web-token";

{
	isValid:	boolean,
	expires:	number,
	data:		Buffer
}= verify(
	/** Signed data */
	data: string | Buffer,
	/** Secret key */
	secret: string | Buffer,
	/** @Optional hash algorithm */
	hashAlgorithm: HashAlgorithm = "sha512"
);
```

### Examples

1- Sign & verify simple text:

```javascript
import { sign, verify } from "web-token";
const SECRET_KEY = "my-secret-key";
const TextToEncode = "My-vulnerable-id";

//* SIGN DATA ----------------------
var signedDataAsText = sign(
	TextToEncode,
	SECRET_KEY,
	55541455485 // Expiration date
).toString("base64url");

//* VERIFY & DECODE ----------------
var info = verify(Buffer.from(signedDataAsText, "base64url"), SECRET_KEY);
if (info.isValid === false) throw new Error("Invalid token");
else if (info.expires < Date.now()) throw new Error("Expired token");

/**
 * @Assert TextToEncode === originalData
 */
const originalData = info.data.toString();
```

2- Sign & Verify Object as JSON:

```javascript
import { sign, verify } from "web-token";
const SECRET_KEY = "my-secret-key";
// Object to encode
const ObjectToEncode = { id: 1, firstName: "khalid", lastName: "RAFIK" };

//* SIGN DATA ----------------------
var signedDataAsText = sign(
	JSON.stringify(ObjectToEncode),
	SECRET_KEY,
	55541455485 // Expiration date
).toString("base64url");

//* VERIFY & DECODE ----------------
var info = verify(Buffer.from(signedDataAsText, "base64url"), SECRET_KEY);
if (info.isValid === false) throw new Error("Invalid token");
else if (info.expires < Date.now()) throw new Error("Expired token");

/**
 * @Assert ObjectToEncode equals originalData
 */
const originalData = JSON.parse(info.data.toString());
```

# Hash password

## Create Hash

For security reasons: NEVER store your user passwords plain in your database . Store password hashes instead.

```typescript
import { hash } from "web-token";

var passwordHash= hash(
	data: string | Buffer,
	secret: string | Buffer,
	hashAlgorithm: HashAlgorithm = "sha512"
);

// Example: Generate password hash & convert it to Hexadecimal
var hs= hash('pass', 'secretKey').toString('hex');
```

**_ NOTE: Better to store password hash when ever possible as buffer instead of string. This will enhance performance and reduce required space _**

## Compare passwords

```typescript
// Password sent by client form
const userPassword= ...
// Password stored in the database
const dbUserPassword= ...

// If password is stored as string, convert it to Buffer first
// Use the same encoding as when you converted it to string (most cases hex or base64)
// We recommend to store passwords as buffers when possible to preserve space and performance.
const buffPassword= Buffer.from(dbUserPassword, 'hex');

// Hash requested password
var reqPassword= hash(userPassword, 'Your secret');

// And than compare theme
// Buffer::compare will return "0" if equals, 1 or -1 otherwise
var areEquals= reqPassword.compare(buffPassword) === 0;
```

# Author

_khalid RAFIK_
Senior full Stack Web, Mobile, Data & Security Engineer
khalid.rfk@gmail.com
