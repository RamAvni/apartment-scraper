import { type ServerResponse } from "node:http";
import { join as joinPath } from "path";
import { logger } from "../common/functions/logger.js";
import { readFile } from "node:fs/promises";

export function getContentType(fileSuffix: string) {
  switch (fileSuffix) {
    case ".js":
      return `text/javascript`;
    case ".html":
    case ".css":
      return `text/${fileSuffix.replace(".", "")}`;
    default:
      return "text/plain"; // The browser may even default to this, if an improper mime type has been given (e.g. ico)
  }
}

export async function provideStaticResource(
  reqUrl: string,
  res: ServerResponse,
) {
  const filePath = joinPath(import.meta.dirname, "/static", reqUrl);
  const data = await readFile(filePath, { encoding: "utf8" }).catch(() =>
    logger("Request failed", "error"),
  );
  if (!data) return;
  res.writeHead(200, {
    // "Content-Type": getContentType(fileSuffix),
    "x-content-type-options": "no-sniff",
  });

  res.end(data, () => {
    logger(
      `Served ${filePath.replaceAll(import.meta.dirname, "")} successfully`,
      "info",
    );
  });
}
