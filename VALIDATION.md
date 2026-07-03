# Validation — salarycalculator.sg

## Sources

- [IRAS (iras.gov.sg)](https://www.iras.gov.sg)
- [CPF Board (cpf.gov.sg)](https://www.cpf.gov.sg)
- [MOM (mom.gov.sg)](https://www.mom.gov.sg)

---

## Test Case 1: Citizen under 55, S$5,000/month

**Input:** Gross S$5,000/month, Singapore Citizen, age 30
**Expected:**
- CPF employee (20%): S$1,000
- CPF employer (17%): S$850
- Take-home: S$4,000/month
- Annual taxable: S$48,000
- Income tax: ~S$1,480
- **Annual net after tax: ~S$46,520**

**Source:** cpf.gov.sg contribution rates 2026

### Test Case 2: PR age 58, S$8,000/month

**Input:** Gross S$8,000, PR, age 58 (55-60 bracket)
**Expected:**
- CPF employee (13%): S$1,040
- CPF employer (11%): S$880
- **Take-home: S$6,960** (higher than under-55 due to lower CPF)

### Test Case 3: EP holder, S$10,000/month

**Input:** Gross S$10,000, Employment Pass (foreigner)
**Expected:**
- CPF: S$0 (EP exempt)
- Income tax (resident, progressive): ~S$7,350/year
- **Take-home: S$10,000/month** (no CPF)
- Effective tax rate: ~6.1%

---

## Build status

- **Build:** 31 pages, 0 errors
- **Tests:** 24/24 passed
- **Sitemap:** auto-generated (sitemap-index.xml)

## Page inventory (31 pages)

| Category | Count | Details |
|---|---|---|
| Home + legal | 3 | index, legal, privacy |
| Tool pages | 1 | faq |
| Guides index | 1 | /guides/ |
| Guide articles | 8 | cpf-contribution-rates, cpf-for-foreigners, singapore-income-tax, ep-vs-pr-salary, cpf-oa-sa-ma-explained, tax-residency-183-days, bonus-aws-tax, salary-negotiation-singapore |
| Salary pages | 12 | salary-[amount] (3000 through 30000) |
| CPF age bracket pages | 6 | cpf-[bracket] (below-55, 55-60, 60-65, 65-70, above-70, foreigner-ep) |

## Components

- SalaryCalculator.tsx (Singapore CPF/income tax calculator)

## Data files

- cpf-rates-2026.ts — CPF rates by age bracket, OW/AW ceilings
- salaries-data.ts — 12 salary entries
- age-brackets-data.ts — 6 CPF age bracket entries

## Quality gates

- [x] Build passes (31 pages, 0 errors)
- [x] Tests pass (24/24)
- [x] Sitemap generated
- [x] Schema.org on every page (WebApplication, FAQPage, BreadcrumbList)
- [x] Analytics: Plausible + GA4 placeholder
- [x] robots.txt present
- [x] llms.txt present
- [x] All guide pages > 1500 words
- [x] Disclaimer in footer
- [x] Mobile-responsive navigation (hamburger menu)
- [x] Internal cross-linking between tools and guides
