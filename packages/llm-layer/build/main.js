"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = call;
const zod_1 = __importDefault(require("zod"));
async function call(systemPrompt, userPrompt, zodSchema) {
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
                    schema: zod_1.default.toJSONSchema(zodSchema),
                },
            },
            cache_prompt: true,
        }),
    });
    const data = await res.json();
    const raw = JSON.parse(data.choices[0].message.content);
    return zodSchema.parse(raw);
}
//# sourceMappingURL=main.js.map