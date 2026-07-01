// Singapore Salary Calculator Engine
// Computes gross-to-net salary with CPF contributions and income tax

import {
  type ResidencyType,
  type CPFRate,
  getCPFRateForAge,
  getCPFAllocationForAge,
  OW_CEILING_MONTHLY,
  AW_CEILING_ANNUAL,
  TAX_BRACKETS_YA2026,
  getEarnedIncomeRelief,
} from './cpf-rates-2026';

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface SalaryInput {
  monthlyGross: number;
  age: number;
  residencyType: ResidencyType;
  annualBonus: number;        // e.g. AWS or variable bonus
  includeNSmanRelief?: boolean;
}

export interface CPFBreakdown {
  employeeContribution: number;   // monthly
  employerContribution: number;   // monthly
  totalContribution: number;      // monthly
  oa: number;                     // monthly allocation to Ordinary Account
  sa: number;                     // monthly allocation to Special Account
  ma: number;                     // monthly allocation to MediSave Account
  annualEmployeeContribution: number;
  annualEmployerContribution: number;
  bonusEmployeeContribution: number;
  bonusEmployerContribution: number;
}

export interface SalaryResult {
  // Monthly figures
  monthlyGross: number;
  monthlyEmployeeCPF: number;
  monthlyNetBeforeTax: number;
  monthlyTakeHome: number;       // after CPF and monthly tax allocation
  monthlyTax: number;            // annual tax divided by 12

  // CPF breakdown
  cpf: CPFBreakdown;

  // Annual figures
  annualGross: number;
  annualBonus: number;
  annualTotalIncome: number;
  annualEmployeeCPF: number;
  annualTax: number;
  annualNetIncome: number;       // take-home for the year

  // Employer cost
  monthlyEmployerCost: number;
  annualEmployerCost: number;

  // Tax details
  chargeableIncome: number;
  totalReliefs: number;

  // Rates applied
  cpfRate: CPFRate | null;
}

// ─── CPF Calculation ────────────────────────────────────────────────────────────
export function calculateCPF(
  monthlyOW: number,
  age: number,
  residencyType: ResidencyType,
  annualBonus: number = 0
): CPFBreakdown {
  const rate = getCPFRateForAge(age, residencyType);

  if (!rate || residencyType === 'foreigner') {
    return {
      employeeContribution: 0,
      employerContribution: 0,
      totalContribution: 0,
      oa: 0, sa: 0, ma: 0,
      annualEmployeeContribution: 0,
      annualEmployerContribution: 0,
      bonusEmployeeContribution: 0,
      bonusEmployerContribution: 0,
    };
  }

  // Apply OW ceiling: CPF is calculated on the lower of actual OW or ceiling
  const cappedOW = Math.min(monthlyOW, OW_CEILING_MONTHLY);

  // Monthly CPF contributions (rounded to nearest dollar)
  const monthlyEmployee = Math.round(cappedOW * rate.employee / 100);
  const monthlyEmployer = Math.round(cappedOW * rate.employer / 100);
  const monthlyTotal = monthlyEmployee + monthlyEmployer;

  // Annual OW subject to CPF
  const annualOWSubjectToCPF = cappedOW * 12;

  // Additional Wage (AW) ceiling: $102,000 - total OW subject to CPF
  const awCeiling = Math.max(0, AW_CEILING_ANNUAL - annualOWSubjectToCPF);
  const cappedBonus = Math.min(annualBonus, awCeiling);

  // Bonus CPF contributions
  const bonusEmployee = Math.round(cappedBonus * rate.employee / 100);
  const bonusEmployer = Math.round(cappedBonus * rate.employer / 100);

  // Annual totals
  const annualEmployee = monthlyEmployee * 12 + bonusEmployee;
  const annualEmployer = monthlyEmployer * 12 + bonusEmployer;

  // CPF allocation (OA/SA/MA) based on age
  const allocation = getCPFAllocationForAge(age);
  const oa = Math.round(monthlyTotal * allocation.oa);
  const sa = Math.round(monthlyTotal * allocation.sa);
  // MA gets the remainder to avoid rounding issues
  const ma = monthlyTotal - oa - sa;

  return {
    employeeContribution: monthlyEmployee,
    employerContribution: monthlyEmployer,
    totalContribution: monthlyTotal,
    oa,
    sa,
    ma,
    annualEmployeeContribution: annualEmployee,
    annualEmployerContribution: annualEmployer,
    bonusEmployeeContribution: bonusEmployee,
    bonusEmployerContribution: bonusEmployer,
  };
}

// ─── Income Tax Calculation ─────────────────────────────────────────────────────
export function calculateIncomeTax(annualChargeable: number): number {
  if (annualChargeable <= 0) return 0;

  let tax = 0;
  let remaining = annualChargeable;

  for (const bracket of TAX_BRACKETS_YA2026) {
    if (remaining <= 0) break;

    const bracketSize = bracket.upperBound === Infinity
      ? remaining
      : bracket.upperBound - bracket.lowerBound + 1;

    const taxableInBracket = Math.min(remaining, bracketSize);
    tax += taxableInBracket * bracket.rate / 100;
    remaining -= taxableInBracket;
  }

  // Round to nearest dollar
  return Math.round(tax);
}

// ─── Full Salary Calculation ────────────────────────────────────────────────────
export function calculateSalary(input: SalaryInput): SalaryResult {
  const { monthlyGross, age, residencyType, annualBonus, includeNSmanRelief = false } = input;

  // Calculate CPF
  const cpf = calculateCPF(monthlyGross, age, residencyType, annualBonus);

  // Annual gross income
  const annualGross = monthlyGross * 12;
  const annualTotalIncome = annualGross + annualBonus;

  // Calculate reliefs
  let totalReliefs = 0;

  // Earned income relief
  totalReliefs += getEarnedIncomeRelief(age);

  // CPF relief (employee's share)
  totalReliefs += cpf.annualEmployeeContribution;

  // NSman relief (optional)
  if (includeNSmanRelief) {
    totalReliefs += 3000;
  }

  // Chargeable income
  const chargeableIncome = Math.max(0, annualTotalIncome - totalReliefs);

  // Income tax
  const annualTax = residencyType === 'foreigner'
    ? Math.round(annualTotalIncome * 0.15) // Non-resident flat rate (or progressive, whichever is higher — simplified to 15% flat)
    : calculateIncomeTax(chargeableIncome);

  const monthlyTax = Math.round(annualTax / 12);

  // Monthly figures
  const monthlyNetBeforeTax = monthlyGross - cpf.employeeContribution;
  const monthlyTakeHome = monthlyNetBeforeTax - monthlyTax;

  // Annual net income
  const annualNetIncome = annualTotalIncome - cpf.annualEmployeeContribution - annualTax;

  // Employer cost
  const monthlyEmployerCost = monthlyGross + cpf.employerContribution;
  const annualEmployerCost = annualTotalIncome + cpf.annualEmployerContribution + cpf.bonusEmployerContribution;

  // Get CPF rate applied
  const cpfRate = getCPFRateForAge(age, residencyType);

  return {
    monthlyGross,
    monthlyEmployeeCPF: cpf.employeeContribution,
    monthlyNetBeforeTax,
    monthlyTakeHome,
    monthlyTax,

    cpf,

    annualGross,
    annualBonus,
    annualTotalIncome,
    annualEmployeeCPF: cpf.annualEmployeeContribution,
    annualTax,
    annualNetIncome,

    monthlyEmployerCost,
    annualEmployerCost,

    chargeableIncome,
    totalReliefs,

    cpfRate,
  };
}
