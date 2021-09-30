import { verify, sign } from "../dist/commonjs/index.js";
import { randomBytes } from "crypto";

describe("Value Text: ", function () {
	const originalValue = "hello world";
	var token = sign(originalValue, "my-secret-key");

	var info = verify(token, "my-secret-key");

	test("Is valid", function () {
		expect(info.isValid);
	});
	test("Expires === -1", function () {
		expect(info.expires === -1);
	});
	test("Correct original value", function () {
		expect(info.data.toString() === originalValue);
	});
});

describe("With expiration: ", function () {
	const originalValue = "hello world";
	const expires = Date.now();
	var token = sign(originalValue, "my-secret-key", expires);

	console.log("token: ", token.toString("base64url"));
	var info = verify(token, "my-secret-key");

	test("Is valid", function () {
		expect(info.isValid);
	});
	test("Expires", function () {
		expect(info.expires === expires);
	});
	test("Correct original value", function () {
		expect(info.data.toString() === originalValue);
	});
});

describe("With Buffer: ", function () {
	const originalValue = randomBytes(32);
	const expires = Date.now();
	var token = sign(originalValue, "my-secret-key", expires).toString(
		"base64url"
	);

	console.log("token: ", token);
	var info = verify(token, "my-secret-key");

	test("Is valid", function () {
		expect(info.isValid);
	});
	test("Expires", function () {
		expect(info.expires === expires);
	});
	test("Correct original value", function () {
		expect(originalValue.compare(info.data) === 0);
	});
});
