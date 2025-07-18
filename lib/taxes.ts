import { STANDARD_DEDUCTIONS, TAX_BRACKETS } from "@/constants";

export const calculateTaxes = ({
  filingStatus,
  totalWages,
  totalNonemployeeCompensation,
  totalInterestIncome,
  totalFederalIncomeTaxWithheld,
}: {
  filingStatus: string;
  totalWages: number;
  totalNonemployeeCompensation: number;
  totalInterestIncome: number;
  totalFederalIncomeTaxWithheld: number;
}) => {
  const deduction = STANDARD_DEDUCTIONS[filingStatus];
  const taxableIncome = Math.max(
    0,
    totalWages + totalNonemployeeCompensation + totalInterestIncome - deduction
  );

  let remaining = taxableIncome;
  let taxLiability = 0;
  for (const bracket of TAX_BRACKETS[filingStatus]) {
    if (remaining <= 0) break;
    const bracketMin = bracket.min;
    const bracketMax = bracket.max;
    if (taxableIncome > bracketMin) {
      const amountInBracket = Math.min(remaining, bracketMax - bracketMin);
      taxLiability += amountInBracket * bracket.rate;
      remaining -= amountInBracket;
    }
  }

  const refundOrAmountOwed = totalFederalIncomeTaxWithheld - taxLiability;
  return {
    taxLiability,
    deduction,
    filingStatus,
    taxableIncome,
    grossIncome:
      totalWages + totalNonemployeeCompensation + totalInterestIncome,
    refundOrAmountOwed,
  };
};
