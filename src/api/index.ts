import { PlaywrightCrawler, Configuration } from "crawlee";
import type { IncomingMessage, ServerResponse } from "node:http";
import ollama from "ollama";
import z from "zod";
import { getCookies } from "./crawler/functions/index.js";
import { results, router } from "./crawler/index.js";
import { MODEL, PROMPT } from "./ollama/consts/index.js";
import { ParsedFacebookPostSchema } from "./ollama/schemas/index.js";
import { setError } from "../common/functions/set-error.js";
import { logger } from "../common/functions/logger.js";

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.url?.startsWith("/api/crawler")) {
    switch (req.url) {
      case "/api/crawler": {
        const config = new Configuration({ persistStorage: false });
        const crawler = new PlaywrightCrawler(
          {
            headless: false,
            preNavigationHooks: [
              async ({ page }) => {
                await page.context().addCookies(getCookies());
              },
            ],
            requestHandlerTimeoutSecs: 60 * 4,
            requestHandler: router,
            maxConcurrency: 5,
          },
          config,
        );

        // TODO: make sure req.body is string[] of urls
        if (!req.body) {
          logger("errored in req.body", "error");
          return;
        }
        const parsedBody: unknown = JSON.parse(req.body);
        if (
          !(
            parsedBody instanceof Object &&
            "urls" in parsedBody &&
            Array.isArray(parsedBody.urls)
          )
        )
          return setError(
            res,
            new Error(
              "Incorrect body has been given. expected { urls: string[] }",
            ),
          );

        await crawler.run(parsedBody.urls);
        console.log(results);
        res.end(JSON.stringify(results));
        break;
      }
      case "/api/crawler/facebook-post": {
        if (!req.body) return setError(res, new Error("Needs a body"));
        req.body = req.body.replaceAll(/\p{Emoji_Presentation}/gu, "");
        console.log(req.body);
        const ollamaResponse = await ollama.chat({
          model: MODEL,
          stream: false,
          format: z.toJSONSchema(ParsedFacebookPostSchema),
          messages: [
            {
              role: "assistant",
              content: PROMPT,
            },
            { role: "user", content: req.body },
          ],
        });

        const result = ParsedFacebookPostSchema.parse(
          JSON.parse(ollamaResponse.message.content),
        );
        console.log(result);

        res.end(JSON.stringify(result));
        break;
      }
    }
  }
}
