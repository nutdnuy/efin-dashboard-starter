import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../scripts/serve.mjs";
async function request(url, method = "GET") {
  const server = createApp();
  const handler = server.listeners("request")[0];
  const headers = {};
  let code = 200,
    body = "";
  await handler(
    { url, method },
    {
      setHeader(k, v) {
        headers[k.toLowerCase()] = v;
      },
      writeHead(c) {
        code = c;
      },
      end(b) {
        body = b?.toString() || "";
      },
    },
  );
  return { code, headers, body };
}
test("server serves modules and readable snapshot", async () => {
  const module = await request("/src/data.js");
  assert.equal(module.code, 200);
  assert.match(module.headers["content-type"], /javascript/);
  const api = await request("/api/snapshot");
  assert.equal(api.code, 200);
  assert.equal(JSON.parse(api.body).dashboard.records.length, 3);
});
test("server denies private/config/source files and unsupported methods", async () => {
  for (const url of [
    "/data/private/current.json",
    "/.env",
    "/dashboard.config.json",
    "/src/snapshot.js",
    "/../../package.json",
  ])
    assert.equal((await request(url)).code, 404);
  assert.equal((await request("/", "POST")).code, 405);
});
test("malformed request target returns 400 instead of rejecting handler", async () => {
  assert.equal((await request("http://[")).code, 400);
  assert.equal((await request("/")).code, 200);
});
