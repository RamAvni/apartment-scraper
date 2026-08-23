import z from "zod";

// NOTE: Every change in the schema must be reflected in the prompt as well, or it might cause severe hallucinations.
export function createParsedFacebookPostSchema(
  neighborhoods: string[],
  streets: string[],
) {
  return z
    .object({
      thinking: z
        .array(z.string())
        .describe(
          "Analyze the text here first. Translate slang/typos (like שוטפות to roommates), isolate numbers, and plan the fields.",
        ),
      rent_type: z
        .nullable(z.enum(["long-term", "short-term", "sublet"]))
        .describe(
          "Is there a mention for duration time? i.e. לזמן ארוך, סאבלט, for X months, etc.",
        ),
      is_shared: z
        .nullable(z.boolean())
        .describe("Are there already people in this apartment?"),
      city: z
        .nullable(z.string())
        .describe("Only if the name of the city is mentioned. Prefer null"),
      neighborhood: z
        .nullable(neighborhoods ? z.enum(neighborhoods) : z.string())
        .describe(
          "A possible neighborhood. If no neighborhood is written, write null here.",
        ),
      street: z
        .nullable(streets ? z.enum(streets) : z.string())
        .describe("A possible street"),
      rent_price: z.nullable(z.number()),
      num_rooms: z
        .nullable(z.number())
        .describe("i.e. x חדרים where x is a number"),
      floor_num: z
        .nullable(z.number())
        .describe("i.e. קומה x where x is a number"),
      size_sqm: z
        .nullable(z.float32())
        .describe(`i.e. x.y קמ"ר where x and y are numbers`),
      entry_date: z
        .nullable(z.string())
        .describe(
          "the exact date, if only a month is given then the 1st of that month or 'immidiate'",
        ),
      leave_date: z.nullable(z.string()).describe("If mentioned. Prefer null."),
      contact_phone: z.nullable(z.string()),
      amenities: z.nullable(z.array(z.string())),
      notes: z.nullable(z.array(z.string())),
    })
    .describe("All fields that include text, must be in english only.");
}

// export type ParsedFacebookPostType = z.infer<typeof ParsedFacebookPostSchema>;
