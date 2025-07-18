import { CoreMessage, generateObject } from "ai";
import { z } from "zod";
import { createAnthropic } from "@ai-sdk/anthropic";
import { Langfuse } from "langfuse";
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_HOST,
});

// Get production prompt

// const langfuse = new Langfuse({
//     secretKey: process.env.LANGFUSE_SECRET_KEY!,
//     publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
//     baseUrl: process.env.LANGFUSE_HOST
// });
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

async function checkForPromptInjection(data: string) {
  console.log({ data });
  const prompt = await langfuse.getPrompt("prompt-injection-pre-flight", undefined, {type: "chat"});
  const compiledPrompt = prompt.compile({ data })
  console.log({ compiledPrompt });

  const promptInjectionSecurityCheckSchema = z.object({
    safe: z.boolean(),
    issues: z.array(z.string()),
  });
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    schema: promptInjectionSecurityCheckSchema,
    messages: compiledPrompt,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "checkForPromptInjection",
    },
  });

  return object;
}
export async function parseTaxDocument(documentText: string) {
  // const traceId = crypto.randomUUID()
  // langfuse.trace({
  //     id: traceId,
  //     name: "parseTaxDocument"
  // });
  const messages: CoreMessage[] = [
    {
      role: "system",
      content: `
<instructions>
You are a tax expert. Analyze the document text and return a JSON object matching one of the following schemas. Do not include any extra text, comments, or formatting.
</instructions>
`,
    },
    {
      role: "user",
      content: documentText,
    },
  ];
  try {
    const securityResult = await checkForPromptInjection(documentText);

    if (!securityResult.safe || securityResult.issues.length > 0) {
      throw new Error(securityResult.issues.join(", ").trim());
    }

    const { object } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20240620"),
      schemaName: "TaxDocument",
      schemaDescription: "A tax document",
      schema: taxDocumentSchema,
      messages,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "parseTaxDocument",
        // metadata: {
        //     langfuseTraceId: traceId,
        //     langfuseParentUpdate: false
        // }
      },
    });
    // await langfuse.flushAsync();

    return object;
  } catch (error) {
    console.error(error);
    return null;
  }
}
