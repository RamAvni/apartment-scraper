import { Body, Controller, Param, Post } from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { scrapeDto } from "./dtos/scrape.dto";
import ollama from "ollama";

@Controller("crawler")
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post()
  async scrape(@Body() body: scrapeDto) {
    return await this.crawlerService.scrape(body.urls);
  }

  @Post(":message")
  async ollama(@Param("message") message: string) {
    console.log(message);
    return await ollama.chat({
      model: "llama3.1",
      messages: [{ role: "user", content: message }],
    });
  }
}
