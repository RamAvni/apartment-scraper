import { Body, Controller, Post } from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { scrapeDto } from "./dtos/scrape.dto";
import ollama from "ollama";
import { facebookPostDto } from "./dtos/facebook-post.dto";
import { PROMPT } from "./consts/prompt.const";
import { MODEL } from "./consts/model.const";

@Controller("crawler")
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post()
  async scrape(@Body() { urls }: scrapeDto) {
    return await this.crawlerService.scrape(urls);
  }

  @Post("facebook-post")
  async ollama(@Body() { text }: facebookPostDto) {
    console.log(text);
    const res = await ollama.chat({
      model: MODEL,
      messages: [
        { role: "assistant", content: PROMPT },
        { role: "user", content: text },
      ],
    });
    console.log(res);
    return res.message.content;
  }
}
