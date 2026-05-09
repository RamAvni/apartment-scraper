import { createServer as createHttpServer } from "http";
import { getLanIp, logger } from "./common/functions/index.js";
import { setError } from "./common/functions/set-error.js";
import { provideStaticResource } from "./web/index.js";
import { handleApiRequest } from "./api/index.js";
import { PORT } from "./common/consts.js";
import dotenv from "dotenv";
import assert from "node:assert";

declare module "http" {
  interface IncomingMessage {
    body?: string;
  }
}

function loadEnvFile() {
  dotenv.config({ path: ".env.development.local" });
  const { FACEBOOK_XS, FACEBOOK_C_USER } = process.env;
  assert(FACEBOOK_XS && FACEBOOK_C_USER);
}

function main() {
  loadEnvFile();
  // TODO: setup mikro-orm or another db connection

  const server = createHttpServer();

  // On HTTP Request
  server.on("request", (req, res) => {
    const url = req.url;
    if (!url) {
      setError(res, new Error("improper req.url given"));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      req.body = body;
      if (url.startsWith("/api")) void handleApiRequest(req, res);
      else void provideStaticResource(url, res);
    });
  });

  server.listen(PORT, () => {
    logger(`Server is listening on port ${PORT}`, "debug");
    logger(
      `You may access static files at: 
\t ${`http://localhost:${PORT}`}, or at:
\t http://${getLanIp()}:${PORT}`,
      "debug",
    );
  });
}

main();
