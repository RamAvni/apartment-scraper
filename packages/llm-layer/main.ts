import z from "zod";
import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

/**
For the types, see: https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md#post-v1chatcompletions-openai-compatible-chat-completions-api
 */
export async function call(
  systemPrompt: string,
  userPrompt: string,
  zodSchema: unknown,
  zodSchemaName: string,
  timeout: number = 3 * 60 * 1000,
) {
  const body: ChatCompletionCreateParams = {
    model: "", // Use any
    stream: false,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: zodSchemaName,
        schema: z.toJSONSchema(zodSchema),
      },
    },
  };

  try {
    const res = await fetch("http://localhost:1111/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    });

    console.log(res);
    const data = await res.json();
    const raw = JSON.parse(data.choices[0].message.content);
    return zodSchema.parse(raw);
  } catch (e) {
    console.log(e);
  }
}
