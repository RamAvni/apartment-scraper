import { Injectable } from "@nestjs/common";
import { PROMPT } from "./consts/prompt.const";
import { MODEL } from "./consts/model.const";
import ollama from "ollama";

@Injectable()
export class OllamaService {
  // TODO:  validate the JSON got from the AI using zod.
  async parseFacebookPost(text: string) {
    const res = await ollama.chat({
      model: MODEL,
      stream: false,
      messages: [
        { role: "assistant", content: PROMPT },
        { role: "user", content: text },
      ],
    });
    return res.message.content;
  }
}
