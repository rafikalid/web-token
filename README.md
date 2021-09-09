# web-token

Generate safe tokens for web and networks
Fast & memory wise alternative for "jws" & "jwt" & "json web token"

# Sign key

```typescript
import { sign } from 'web-token';

const signedKey: Buffer= sign(
	/** Data to sign */
	data:	string | NodeJS.ArrayBufferView,
	/** Secret key */
	secret:	string | Buffer,
	/** Hash algorithm */
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

# Examples:

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
