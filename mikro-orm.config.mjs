import { defineConfig } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { config } from "dotenv";

config({ path: `./.env.${process.env.NODE_ENV}.local` });

console.log("DB_NAME:", process.env.DB_NAME);

export default defineConfig({
  driver: MySqlDriver,
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // NOTE: Both of these are for the mikro-cli, but won't work with the MikroOrmModule of NestJs
  entities: ["build/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  // metadataProvider: TsMorphMetadataProvider, // TODO: Check if needed with nestjs
  // enable debug mode to log SQL queries and discovery information
  debug: true,
});
