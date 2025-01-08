import { generateObject } from "ai";
import { readFileSync } from "fs";
import { z } from "zod";
import { pdfModel } from "../../_shared/models";

/**
 * We're using a model which supports analysing PDF's:
 */
const model = pdfModel;

/**
 * In this case, we're extracting an object from the invoice.
 *
 * We carefully describe each attribute of the object:
 */
const schema = z
  .object({
    total: z
      .number()
      .describe("The total amount of the invoice."),
    currency: z
      .string()
      .describe("The currency of the total amount."),
    invoiceNumber: z
      .string()
      .describe("The invoice number.")
      .transform((n) => {
        /**
         * Here, we're using a Zod transform to remove the "#" character
         * from the invoice number.
         *
         * We could ask the LLM to do this, but why bother when you
         * can do it deterministically.
         */
        if (n.startsWith("#")) {
          return n.slice(1);
        }
        return n;
      }),
    companyAddress: z
      .string()
      .describe(
        "The address of the company or person issuing the invoice.",
      ),
    companyName: z
      .string()
      .describe(
        "The name of the company issuing the invoice.",
      ),
    invoiceeAddress: z
      .string()
      .describe(
        "The address of the company or person receiving the invoice.",
      ),
  })
  .describe("The extracted data from the invoice.");

export const extractDataFromInvoice = async (
  invoicePath: string,
) => {
  const { object } = await generateObject({
    model,
    system:
      `You will receive an invoice. ` +
      `Please extract the data from the invoice.`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            /**
             * We provide the PDF file as a buffer:
             */
            data: readFileSync(invoicePath),
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema,
  });

  return object;
};
