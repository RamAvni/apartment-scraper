import { Body, Controller, Post } from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { scrapeDto } from "./dtos/scrape.dto";

@Controller("crawler")
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post()
  scrape(@Body() scrapeBody: scrapeDto) {
    return this.crawlerService.scrape(scrapeBody.urls);
  }
}
