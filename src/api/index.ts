import { PlaywrightCrawler, Configuration } from "crawlee";
import type { IncomingMessage, ServerResponse } from "node:http";
import ollama from "ollama";
import z from "zod";
import { getCookies } from "../crawler/functions/get-cookies.function.js";
import { router } from "../crawler/crawlee-routers.js";
import { MODEL } from "../ollama/consts/model.const.js";
import { ParsedFacebookPostSchema } from "../ollama/schemas/parsed-facebook-post.schema.js";
import { PROMPT } from "../ollama/consts/prompt.const.js";
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
          },
          config,
        );

        // TODO: make sure req.body is string[] of urls
        if (!req.body) {
          logger("errored in req.body", "error");
          return;
        }
        console.log(JSON.parse(req.body));
        await crawler.run(JSON.parse(req.body).urls);
        res.end("done");
        break;
      }
      case "/api/crawler/facebook-post": {
        if (!req.body) return setError(res, new Error("Needs a body"));
        console.log(req.body);
        const ollamaResponse = await ollama.chat({
          model: MODEL,
          stream: false,
          format: z.toJSONSchema(ParsedFacebookPostSchema),
          messages: [
            { role: "assistant", content: PROMPT },
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
