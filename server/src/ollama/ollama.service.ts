import { Injectable } from "@nestjs/common";
import { PROMPT } from "./consts";
import { MODEL } from "./consts";
import ollama from "ollama";
import z from "zod";
import { ParsedFacebookPostSchema } from "./schemas";

@Injectable()
export class OllamaService {
  // TODO:  validate the JSON got from the AI using zod.
  async parseFacebookPost(text: string) {
    console.log("parsing facebook post...");
    const res = await ollama.chat({
      model: MODEL,
      stream: false,
      format: z.toJSONSchema(ParsedFacebookPostSchema),
      messages: [
        { role: "assistant", content: PROMPT },
        { role: "user", content: text },
      ],
    });
    console.log("done parsing facebook post");

    const result = ParsedFacebookPostSchema.parse(
      JSON.parse(res.message.content),
    );
    console.log(result);
    return result;
  }
}
