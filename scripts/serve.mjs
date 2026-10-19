import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { getPayload } from "../src/snapshot.js";
export function createApp(
  root = fileURLToPath(new URL("../", import.meta.url)),
) {
  const assets = new Map([
    ["/", ["public/index.html", "text/html; charset=utf-8"]],
    ["/app.js", ["public/app.js", "text/javascript; charset=utf-8"]],
    ["/styles.css", ["public/styles.css", "text/css; charset=utf-8"]],
    ["/src/data.js", ["src/data.js", "text/javascript; charset=utf-8"]],
    ["/src/metrics.js", ["src/metrics.js", "text/javascript; charset=utf-8"]],
  ]);
  return createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    );
    if (req.method !== "GET") {
      res.writeHead(405);
      res.end("Method not allowed");
      return;
    }
    let path;
    try {
      path = new URL(req.url, "http://localhost").pathname;
    } catch {
      res.writeHead(400);
      res.end("Invalid URL");
      return;
    }
    if (path === "/api/snapshot") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      try {
        res.end(JSON.stringify(await getPayload(root)));
      } catch (e) {
        res.writeHead(422);
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }
    const item = assets.get(path);
    if (!item) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    try {
      res.setHeader("Content-Type", item[1]);
      res.end(await readFile(join(root, item[0])));
    } catch {
      res.writeHead(500);
      res.end("Asset unavailable");
    }
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3100);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT must be 1–65535.");
  createApp().listen(port, "127.0.0.1", () =>
    console.log(
      "Dashboard ready: http://127.0.0.1:" + port + " — local demo / CSV only",
    ),
  );
}
