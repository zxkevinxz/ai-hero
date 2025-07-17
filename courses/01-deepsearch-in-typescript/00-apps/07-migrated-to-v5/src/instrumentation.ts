import { env } from "~/env";
import { LangfuseExporter } from "langfuse-vercel";
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "deepsearch-course",
    traceExporter: new LangfuseExporter({
      environment: env.NODE_ENV,
    }),
  });
}
