import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { cacheModelInFs } from "../caching/cache-model-in-fs";
import { readFileSync } from "fs";
import { anthropic } from "@ai-sdk/anthropic";

const model = cacheModelInFs(anthropic("claude-3-5-sonnet-latest"));

export const extractDataFromInvoice = async (invoicePath: string) => {
  const { object } = await generateObject({
    model,
    system:
      `You will receive an invoice. ` +
      `Please extract the following information from the invoice: ` +
      `the total amount, the invoice number, the company address, the company name, and the invoicee address. `,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: readFileSync(invoicePath),
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: z
      .object({
        total: z.number().describe("The total amount of the invoice."),
        currency: z.string().describe("The currency of the total amount."),
        invoiceNumber: z
          .string()
          .describe("The invoice number.")
          .transform((n) => {
            if (n.startsWith("#")) {
              return n.slice(1);
            }
            return n;
          }),
        companyAddress: z
          .string()
          .describe(
            "The address of the company or person issuing the invoice."
          ),
        companyName: z
          .string()
          .describe("The name of the company issuing the invoice."),
        invoiceeAddress: z
          .string()
          .describe(
            "The address of the company or person receiving the invoice."
          ),
      })
      .describe("The extracted data from the invoice."),
  });

  return object;
};
