import { Injectable } from "@nestjs/common";
import { PlaywrightCrawler } from "crawlee";
import { router } from "./crawlee-routers";
import { getCookies } from "./functions/get-cookies.function";

@Injectable()
export class CrawlerService {
  async scrape(urls: string[]) {
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

    await crawler.run(urls);
  }
}
