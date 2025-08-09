import { Injectable } from "@nestjs/common";

@Injectable()
export class CrawlerService {
  scrape(urls: string[]) {
    return urls;
  }
}
