"use server";
import z from "zod";
import { createServerAction } from "zsa";
import pdfParse from "pdf-parse";
import { parseTaxDocument } from "@/lib/ai";
import { calculateTaxes } from "@/lib/taxes";

export const uploadTaxDocumentsAction = createServerAction()
  .input(
    z.object({
      files: z.array(z.instanceof(File)),
      personalInfo: z.object({
        firstName: z.string(),
        lastName: z.string(),
        ssn: z.string(),
        dateOfBirth: z.string(),
        filingStatus: z.enum([
          "single",
          "married-filing-jointly",
          "married-filing-separately",
          "head-of-household",
          "qualifying-widow",
        ]),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        occupation: z.string(),
      }),
    })
  )
  .handler(async ({ input }) => {
    const { files } = input;

    let totalWages = 0;
    let totalFederalIncomeTaxWithheld = 0;
    let totalInterestIncome = 0;
    let totalNonemployeeCompensation = 0;
    for (const file of files) {
      const pdf = await pdfParse(Buffer.from(await file.arrayBuffer()));
      console.log(pdf.text);
      const result = await parseTaxDocument(pdf.text);
      console.log(result);

      if (!result) {
        throw new Error("Failed to parse tax document");
      }

      const { data } = result;
      switch (data.type) {
        case "W2":
          totalWages += data.wages;
          totalFederalIncomeTaxWithheld += data.federalIncomeTaxWithheld;
          break;
        case "1099-NEC":
          totalNonemployeeCompensation += data.nonemployeeCompensation;
          break;
        case "1099-INT":
          totalInterestIncome += data.interestIncome;
          break;
      }
    }

    const {
      taxLiability,
      taxableIncome,
      grossIncome,
      refundOrAmountOwed,
      deduction,
      filingStatus,
    } = calculateTaxes({
      filingStatus: input.personalInfo.filingStatus,
      totalWages,
      totalNonemployeeCompensation,
      totalInterestIncome,
      totalFederalIncomeTaxWithheld,
    });

    return {
      taxLiability,
      taxableIncome,
      grossIncome,
      totalWages,
      totalNonemployeeCompensation,
      totalFederalIncomeTaxWithheld,
      totalInterestIncome,
      deduction,
      filingStatus,
      refundOrAmountOwed,
    };
  });
