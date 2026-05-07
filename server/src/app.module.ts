import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CrawlerModule } from "./crawler/crawler.module";
import { ConfigModule } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import mikroOrmConfig from "mikro-orm.config";

// Since the MikroOrmModule already finds the entities by itself- mentioning it will create a duplicate
const { entitiesTs: _1, entities: _2, ...moduleOrmConfig } = mikroOrmConfig;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
      ],
    }),
    MikroOrmModule.forRoot({
      ...moduleOrmConfig,
      autoLoadEntities: true,
    }),
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
