import { PlaywrightCrawler } from "crawlee";
import type { IncomingMessage, ServerResponse } from "node:http";
import ollama from "ollama";
import z from "zod";
import { getCookies } from "../crawler/functions/get-cookies.function.js";
import { router } from "../crawler/crawlee-routers.js";
import { MODEL } from "../ollama/consts/model.const.js";
import { ParsedFacebookPostSchema } from "../ollama/schemas/parsed-facebook-post.schema.js";
import { PROMPT } from "../ollama/consts/prompt.const.js";

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.url?.startsWith("crawler")) {
    switch (req.url) {
      case "/crawler": {
        console.log("hi");

        const crawler = new PlaywrightCrawler({
          headless: false,
          preNavigationHooks: [
            async ({ page }) => {
              await page.context().addCookies(getCookies());
            },
          ],
          requestHandlerTimeoutSecs: 60 * 4,
          requestHandler: router,
        });

        // TODO: make sure req.body is string[] of urls
        // @ts-ignore
        await crawler.run(req.body);
        break;
      }
      case "/crawler/facebook-post": {
        console.log("hi");
        const res = await ollama.chat({
          model: MODEL,
          stream: false,
          format: z.toJSONSchema(ParsedFacebookPostSchema),
          messages: [
            { role: "assistant", content: PROMPT },
            // @ts-expect-error -- hello
            { role: "user", content: text },
          ],
        });

        const result = ParsedFacebookPostSchema.parse(
          JSON.parse(res.message.content),
        );
        return result;
        break;
      }
    }
  }
}
