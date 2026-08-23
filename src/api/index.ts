import { PlaywrightCrawler, Configuration } from "crawlee";
import type { IncomingMessage, ServerResponse } from "node:http";
import z from "zod";
import { getCookies } from "./crawler/functions/index.js";
import { results, router } from "./crawler/index.js";
import { setError } from "../common/functions/set-error.js";
import { logger } from "../common/functions/logger.js";
import { createParsedFacebookPostSchema } from "../common/schemas/parsed-facebook-post.schema.js";
import LLM_Layer from "llm-layer";
import { PROMPT } from "../common/consts/prompt.const.js";

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
        res.end(JSON.stringify(results));
        break;
      }
      case "/api/crawler/facebook-post": {
        if (!req.body) return setError(res, new Error("Needs a body"));
        const parsedFacebookPostSchema = createParsedFacebookPostSchema([], []);
        req.body = req.body.replaceAll(/\p{Emoji_Presentation}/gu, "");
        const LLMResponse = LLM_Layer.call(
          PROMPT,
          req.body,
          z.toJSONSchema(parsedFacebookPostSchema),
          "parsedFacebookPostSchema",
        );

        const result = parsedFacebookPostSchema.parse(
          JSON.parse(LLMResponse.message.content),
        );

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify(result), "utf8");
        break;
      }
    }
  }
}
