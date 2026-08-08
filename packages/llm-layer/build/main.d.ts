import { type ZodSchema } from "zod";
export declare function call(systemPrompt: string, userPrompt: string, zodSchema: ZodSchema): Promise<unknown>;
