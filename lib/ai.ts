import { generateObject } from "ai";
import { z } from "zod";
import { createAnthropic } from "@ai-sdk/anthropic";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Zod schema for tax documents (W2, 1099-NEC, or 1099-INT)
export const taxDocumentSchema = z.object({
  data: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("W2"),
      employerName: z.string(),
      employeeName: z.string(),
      wages: z.number(),
      federalIncomeTaxWithheld: z.number(),
    }),
    z.object({
      type: z.literal("1099-NEC"),
      payerName: z.string(),
      recipientName: z.string(),
      nonemployeeCompensation: z.number(),
    }),
    z.object({
      type: z.literal("1099-INT"),
      payerName: z.string(),
      recipientName: z.string(),
      interestIncome: z.number(),
    }),
  ]),
});

export async function parseTaxDocument(documentText: string) {
  try {
    const { object } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20240620"),
      schemaName: "TaxDocument",
      schemaDescription: "A tax document",
      schema: taxDocumentSchema,
      prompt: `
<instructions>
You are a tax expert. Analyze the document text and return a JSON object matching one of the following schemas. Do not include any extra text, comments, or formatting.
</instructions>
<document>
${documentText}
</document>
`,
    });

    return object;
  } catch (error) {
    console.error(error);
    return null;
  }
}

