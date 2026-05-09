import { createServer as createHttpServer } from "http";
import { getLanIp, logger } from "./common/functions/index.js";
import { setError } from "./common/functions/set-error.js";
import { provideStaticResource } from "./web/index.js";
import { handleApiRequest } from "./api/index.js";
import { PORT } from "./common/consts.js";
import dotenv from "dotenv";
import assert from "node:assert";

function main() {
  dotenv.config({ path: ".env.development.local" });
  const { FACEBOOK_XS, FACEBOOK_C_USER } = process.env;
  assert(FACEBOOK_XS && FACEBOOK_C_USER);

  // TODO: setup mikro-orm or another db connection

  const server = createHttpServer();

  // On HTTP Request
  server.on("request", (req, res) => {
    if (!req.url) {
      setError(res, new Error("improper req.url given"));
      return;
    } else if (req.url.startsWith("/api")) {
      handleApiRequest(req, res);
      return;
    } else {
      provideStaticResource(req.url, res);
      return;
    }
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
