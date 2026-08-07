import z from "zod";

// NOTE: Every change in the schema must be reflected in the prompt as well, or it might cause severe hallucinations.
export const ParsedFacebookPostSchema = z.object({
  thinking: z
    .array(z.string())
    .describe(
      "Analyze the text here first. Translate slang/typos (like שוטפות to roommates), isolate numbers, and plan the fields.",
    ),
  rent_type: z.nullable(z.enum(["long-term", "short-term", "sublet"])),
  is_shared: z.nullable(z.boolean()),
  city: z.nullable(z.string()),
  neighborhood: z.nullable(z.string()),
  street: z.nullable(z.string()),
  rent_price: z.nullable(z.number()),
  num_rooms: z.nullable(z.number()),
  floor_num: z.nullable(z.number()),
  size_sqm: z.nullable(z.float32()),
  entry_date: z.nullable(z.string()),
  leave_date: z.nullable(z.string()),
  contact_phone: z.nullable(z.string()),
  amenities: z.nullable(z.array(z.string())),
  notes: z.nullable(z.array(z.string())),
});

// export type ParsedFacebookPostType = z.infer<typeof ParsedFacebookPostSchema>;
