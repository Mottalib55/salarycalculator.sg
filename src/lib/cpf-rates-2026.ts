// Singapore CPF contribution rates and income tax brackets for YA2026
// Source: CPF Board (cpf.gov.sg) and IRAS (iras.gov.sg)

// ─── Residency Types ───────────────────────────────────────────────────────────
export type ResidencyType =
  | 'citizen'
  | 'pr_1st_year'
  | 'pr_2nd_year'
  | 'pr_3rd_year_onwards'
  | 'foreigner';

// ─── CPF Rate Structure ────────────────────────────────────────────────────────
export interface CPFRate {
  ageLabel: string;
  minAge: number;
  maxAge: number;
  employee: number;  // percentage
  employer: number;  // percentage
  total: number;     // percentage
}

export interface CPFAllocation {
  ageLabel: string;
  minAge: number;
  maxAge: number;
  oa: number;   // Ordinary Account ratio of total
  sa: number;   // Special Account ratio of total
  ma: number;   // MediSave Account ratio of total
}

// ─── CPF Rates for Singapore Citizens and 3rd-year+ PRs ────────────────────────
export const CPF_RATES_CITIZEN: CPFRate[] = [
  { ageLabel: '55 and below', minAge: 0, maxAge: 55, employee: 20, employer: 17, total: 37 },
  { ageLabel: 'Above 55 to 60', minAge: 56, maxAge: 60, employee: 15, employer: 15, total: 30 },
  { ageLabel: 'Above 60 to 65', minAge: 61, maxAge: 65, employee: 9.5, employer: 11.5, total: 21 },
  { ageLabel: 'Above 65 to 70', minAge: 66, maxAge: 70, employee: 7, employer: 9, total: 16 },
  { ageLabel: 'Above 70', minAge: 71, maxAge: 999, employee: 5, employer: 7.5, total: 12.5 },
];

// ─── CPF Rates for PR 1st Year (Graduated Employer/Employee) ────────────────────
export const CPF_RATES_PR_1ST_YEAR: CPFRate[] = [
  { ageLabel: '55 and below', minAge: 0, maxAge: 55, employee: 5, employer: 4, total: 9 },
  { ageLabel: 'Above 55 to 60', minAge: 56, maxAge: 60, employee: 5, employer: 4, total: 9 },
  { ageLabel: 'Above 60 to 65', minAge: 61, maxAge: 65, employee: 5, employer: 3.5, total: 8.5 },
  { ageLabel: 'Above 65 to 70', minAge: 66, maxAge: 70, employee: 5, employer: 3.5, total: 8.5 },
  { ageLabel: 'Above 70', minAge: 71, maxAge: 999, employee: 5, employer: 3.5, total: 8.5 },
];

// ─── CPF Rates for PR 2nd Year (Graduated Employer/Employee) ────────────────────
export const CPF_RATES_PR_2ND_YEAR: CPFRate[] = [
  { ageLabel: '55 and below', minAge: 0, maxAge: 55, employee: 15, employer: 9, total: 24 },
  { ageLabel: 'Above 55 to 60', minAge: 56, maxAge: 60, employee: 12.5, employer: 6, total: 18.5 },
  { ageLabel: 'Above 60 to 65', minAge: 61, maxAge: 65, employee: 7.5, employer: 3.5, total: 11 },
  { ageLabel: 'Above 65 to 70', minAge: 66, maxAge: 70, employee: 5, employer: 3.5, total: 8.5 },
  { ageLabel: 'Above 70', minAge: 71, maxAge: 999, employee: 5, employer: 3.5, total: 8.5 },
];

// ─── CPF Allocation Ratios (percentage of total wage to each account) ──────────
// These represent how the total CPF contribution is split among OA, SA, MA
export const CPF_ALLOCATION_RATIOS: CPFAllocation[] = [
  { ageLabel: '35 and below', minAge: 0, maxAge: 35, oa: 0.6217, sa: 0.1621, ma: 0.2162 },
  { ageLabel: 'Above 35 to 45', minAge: 36, maxAge: 45, oa: 0.5676, sa: 0.1891, ma: 0.2432 },
  { ageLabel: 'Above 45 to 50', minAge: 46, maxAge: 50, oa: 0.5136, sa: 0.2162, ma: 0.2702 },
  { ageLabel: 'Above 50 to 55', minAge: 51, maxAge: 55, oa: 0.4054, sa: 0.2702, ma: 0.3243 },
  { ageLabel: 'Above 55 to 60', minAge: 56, maxAge: 60, oa: 0.4667, sa: 0.1333, ma: 0.4000 },
  { ageLabel: 'Above 60 to 65', minAge: 61, maxAge: 65, oa: 0.1429, sa: 0.0952, ma: 0.7619 },
  { ageLabel: 'Above 65 to 70', minAge: 66, maxAge: 70, oa: 0.0625, sa: 0.0625, ma: 0.8750 },
  { ageLabel: 'Above 70', minAge: 71, maxAge: 999, oa: 0.0800, sa: 0.0400, ma: 0.8800 },
];

// ─── CPF Wage Ceilings ─────────────────────────────────────────────────────────
export const OW_CEILING_MONTHLY = 6800;    // Ordinary Wage ceiling per month
export const AW_CEILING_ANNUAL = 102000;   // Annual ceiling for total wages subject to CPF

// ─── Income Tax Brackets YA2026 ────────────────────────────────────────────────
export interface TaxBracket {
  lowerBound: number;
  upperBound: number;
  rate: number;          // percentage
}

export const TAX_BRACKETS_YA2026: TaxBracket[] = [
  { lowerBound: 0, upperBound: 20000, rate: 0 },
  { lowerBound: 20001, upperBound: 30000, rate: 2 },
  { lowerBound: 30001, upperBound: 40000, rate: 3.5 },
  { lowerBound: 40001, upperBound: 80000, rate: 7 },
  { lowerBound: 80001, upperBound: 120000, rate: 11.5 },
  { lowerBound: 120001, upperBound: 160000, rate: 15 },
  { lowerBound: 160001, upperBound: 200000, rate: 18 },
  { lowerBound: 200001, upperBound: 240000, rate: 19 },
  { lowerBound: 240001, upperBound: 280000, rate: 19.5 },
  { lowerBound: 280001, upperBound: 320000, rate: 20 },
  { lowerBound: 320001, upperBound: 500000, rate: 22 },
  { lowerBound: 500001, upperBound: 1000000, rate: 23 },
  { lowerBound: 1000001, upperBound: Infinity, rate: 24 },
];

// ─── Tax Reliefs ────────────────────────────────────────────────────────────────
export function getEarnedIncomeRelief(age: number): number {
  if (age < 55) return 1000;
  if (age <= 59) return 6000;
  return 8000; // 60 and above
}

// Maximum CPF relief cap (employee's CPF contribution, capped)
export const CPF_RELIEF_CAP = 20400; // $6,800 x 12 months x 25% ... effectively up to ordinary wage ceiling * employee rate

// NSman relief (self, for eligible males)
export const NSMAN_RELIEF_SELF = 3000;
export const NSMAN_RELIEF_WIFE = 750;
export const NSMAN_RELIEF_PARENT = 750;

// ─── Helper: Get CPF rates for residency type ──────────────────────────────────
export function getCPFRatesForResidency(residencyType: ResidencyType): CPFRate[] {
  switch (residencyType) {
    case 'citizen':
    case 'pr_3rd_year_onwards':
      return CPF_RATES_CITIZEN;
    case 'pr_1st_year':
      return CPF_RATES_PR_1ST_YEAR;
    case 'pr_2nd_year':
      return CPF_RATES_PR_2ND_YEAR;
    case 'foreigner':
      return []; // No CPF for foreigners
    default:
      return CPF_RATES_CITIZEN;
  }
}

// ─── Helper: Get CPF rate for a specific age ────────────────────────────────────
export function getCPFRateForAge(age: number, residencyType: ResidencyType): CPFRate | null {
  if (residencyType === 'foreigner') return null;
  const rates = getCPFRatesForResidency(residencyType);
  return rates.find(r => age >= r.minAge && age <= r.maxAge) ?? null;
}

// ─── Helper: Get CPF allocation for a specific age ──────────────────────────────
export function getCPFAllocationForAge(age: number): CPFAllocation {
  return CPF_ALLOCATION_RATIOS.find(a => age >= a.minAge && age <= a.maxAge)
    ?? CPF_ALLOCATION_RATIOS[0];
}
