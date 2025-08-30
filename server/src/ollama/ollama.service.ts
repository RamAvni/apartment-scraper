import { Injectable } from "@nestjs/common";
import { PROMPT } from "./consts";
import { MODEL } from "./consts";
import ollama from "ollama";
import z from "zod";
import { ParsedFacebookPostSchema } from "./schemas";

@Injectable()
export class OllamaService {
  async parseFacebookPost(text: string) {
    const res = await ollama.chat({
      model: MODEL,
      stream: false,
      format: z.toJSONSchema(ParsedFacebookPostSchema),
      messages: [
        { role: "assistant", content: PROMPT },
        { role: "user", content: text },
      ],
    });

    const result = ParsedFacebookPostSchema.parse(
      JSON.parse(res.message.content),
    );
    return result;
  }
}
