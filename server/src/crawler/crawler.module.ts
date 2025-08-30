import { Module } from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { CrawlerController } from "./crawler.controller";
import { OllamaService } from "src/ollama/ollama.service";

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService, OllamaService],
})
export class CrawlerModule {}
