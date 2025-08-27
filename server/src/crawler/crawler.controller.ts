import { Body, Controller, Post } from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { scrapeDto } from "./dtos/scrape.dto";
import { facebookPostDto } from "./dtos/facebook-post.dto";
import { OllamaService } from "src/ollama/ollama.service";

@Controller("crawler")
export class CrawlerController {
  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly ollamaService: OllamaService,
  ) {}

  @Post()
  async scrape(@Body() { urls }: scrapeDto) {
    return await this.crawlerService.scrape(urls);
  }

  @Post("facebook-post")
  async ollama(@Body() { text }: facebookPostDto) {
    return await this.ollamaService.parseFacebookPost(text);
  }
}
