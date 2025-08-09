import { IsUrl } from "class-validator";
export class scrapeDto {
  @IsUrl(
    {
      protocols: ["https"],
      require_host: true,
      host_whitelist: ["www.facebook.com"],
      allow_query_components: false,
    },
    { each: true },
  )
  urls: string[];
}
