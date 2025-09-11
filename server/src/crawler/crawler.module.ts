import { Module } from "@nestjs/common";
import { CrawlerService } from "./crawler.service";
import { CrawlerController } from "./crawler.controller";
import { OllamaService } from "src/ollama/ollama.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { User } from "src/entities/user.entity";

@Module({
  imports: [MikroOrmModule.forFeature([User])], // NOTE: here for testing purposes only
  controllers: [CrawlerController],
  providers: [CrawlerService, OllamaService],
})
export class CrawlerModule {}
