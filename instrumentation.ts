import { registerOTel } from "@vercel/otel";
import { LangfuseExporter } from "langfuse-vercel";
 
export function register() {
  registerOTel({
    serviceName: "tax-buddy-ai",
    traceExporter: new LangfuseExporter({
        environment: process.env.NODE_ENV,
        secretKey: process.env.LANGFUSE_SECRET_KEY!,
        publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
        baseUrl: process.env.LANGFUSE_HOST
    }),
  });
}