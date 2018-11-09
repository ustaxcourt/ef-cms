const assert = require("assert");

const dotenvJSON = require("./index");

assert.ok(!process.env.hasOwnProperty("sample"));

dotenvJSON(); // loads .env.json

assert.ok(process.env.hasOwnProperty("sample"));
assert.equal(process.env.sample, "value1");
