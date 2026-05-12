import { createServer as createHttpServer } from "http";
import { getLanIp, logger } from "./common/functions/index.js";
import { setError } from "./common/functions/set-error.js";
import { provideStaticResource } from "./web/index.js";
import { handleApiRequest } from "./api/index.js";
import { PORT } from "./common/consts.js";
import dotenv from "dotenv";
import assert from "node:assert";
import mysql from "mysql2/promise";

declare module "http" {
  interface IncomingMessage {
    body?: string;
  }
}

function loadEnvFile() {
  dotenv.config({ path: ".env.development.local" });
  const {
    FACEBOOK_XS,
    FACEBOOK_C_USER,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
  } = process.env;

  assert(FACEBOOK_XS && FACEBOOK_C_USER);
  assert(DB_HOST && DB_USER && DB_PASSWORD && DB_NAME && DB_PORT);
}

async function initDatabase() {
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });

  await dbConnection.query(
    `CREATE TABLE IF NOT EXISTS posts 
		(id int AUTO_INCREMENT PRIMARY KEY,
		 posterName VARCHAR(255),
		 postContent VARCHAR(255))`,
  );

  await dbConnection.query(
    `CREATE TABLE IF NOT EXISTS apartments
			(id int AUTO_INCREMENT PRIMARY KEY,
			 itemType VARCHAR(255),
			 rentType ENUM('long-term', 'short-term', 'sublet'),
			 isShared boolean,
			 city VARCHAR(255),
			 neighborhood VARCHAR(255),
			 street VARCHAR(255),
 			 rentPrice int,
 			 numRooms tinyint,
 			 floorNumber tinyint,
 			 sizeInSquareMeters float,
 			 entryDate date,
 			 leaveDate date,
			 contactPhone VARCHAR(255),
			 postId int,
			 CONSTRAINT fk_post
			 FOREIGN KEY (postId)
			 REFERENCES posts(id))
	 `,
  );

  // TODO: 'notes' and 'amenities'
  // string[]
  // amenities
  // string[]
  // notes

  return dbConnection;
}

async function main() {
  loadEnvFile();
  await initDatabase();
  logger(process.env.DB_NAME || "", "info");

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

await main();
