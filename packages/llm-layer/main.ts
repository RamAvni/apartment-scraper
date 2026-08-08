import z, { type ZodSchema } from "zod";

export async function call(
  systemPrompt: string,
  userPrompt: string,
  zodSchema: ZodSchema,
) {
  const res = await fetch("http://localhost:8080/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          schema: z.toJSONSchema(zodSchema),
        },
      },
      cache_prompt: true,
    }),
  });

  const data = await res.json();
  const raw = JSON.parse(data.choices[0].message.content);
  return zodSchema.parse(raw);
}
