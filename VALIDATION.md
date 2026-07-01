# Validation Test Cases — SalaryCalculator.sg

These test cases can be verified against the CPF Board contribution calculator (cpf.gov.sg) and IRAS income tax calculator (iras.gov.sg).

---

## Test Case 1: Singapore Citizen, Age 30, $5,000/month, No Bonus

**Input:**
- Monthly Gross Salary: $5,000
- Age: 30
- Residency: Singapore Citizen
- Annual Bonus: $0

**Expected CPF (Source: CPF Board):**
- Employee CPF (20%): $1,000/month | $12,000/year
- Employer CPF (17%): $850/month | $10,200/year
- Total CPF: $1,850/month | $22,200/year

**Expected Tax (Source: IRAS YA2026):**
- Annual Gross: $60,000
- Reliefs: Earned Income Relief ($1,000) + CPF Relief ($12,000) = $13,000
- Chargeable Income: $60,000 - $13,000 = $47,000
- Tax: $0 (first $20k) + $200 (next $10k @ 2%) + $350 (next $10k @ 3.5%) + $490 ($7k @ 7%) = $1,040
- Monthly Tax: ~$87

**Expected Take-Home:**
- Monthly: $5,000 - $1,000 - $87 = $3,913
- Annual: $60,000 - $12,000 - $1,040 = $46,960

---

## Test Case 2: Singapore Citizen, Age 30, $10,000/month (Above OW Ceiling), No Bonus

**Input:**
- Monthly Gross Salary: $10,000
- Age: 30
- Residency: Singapore Citizen
- Annual Bonus: $0

**Expected CPF (Source: CPF Board — OW Ceiling $6,800):**
- Employee CPF (20% of $6,800): $1,360/month | $16,320/year
- Employer CPF (17% of $6,800): $1,156/month | $13,872/year
- Total CPF: $2,516/month | $30,192/year

**Expected Tax (Source: IRAS YA2026):**
- Annual Gross: $120,000
- Reliefs: Earned Income Relief ($1,000) + CPF Relief ($16,320) = $17,320
- Chargeable Income: $120,000 - $17,320 = $102,680
- Tax: $0 + $200 + $350 + $2,800 + $2,608.20 = ~$5,958 (progressive through brackets)
- Monthly Tax: ~$497

**Expected Take-Home:**
- Monthly: $10,000 - $1,360 - $497 = $8,143
- Annual: $120,000 - $16,320 - $5,958 = $97,722

---

## Test Case 3: Foreigner, Age 35, $8,000/month, No Bonus

**Input:**
- Monthly Gross Salary: $8,000
- Age: 35
- Residency: Foreigner (Employment Pass)
- Annual Bonus: $0

**Expected CPF:**
- Employee CPF: $0 (Foreigners do not contribute to CPF)
- Employer CPF: $0

**Expected Tax (Source: IRAS — Non-resident flat rate 15%):**
- Annual Gross: $96,000
- Tax (15% flat): $14,400
- Monthly Tax: $1,200

**Expected Take-Home:**
- Monthly: $8,000 - $0 - $1,200 = $6,800
- Annual: $96,000 - $0 - $14,400 = $81,600

---

## Sources
- **CPF Board:** https://www.cpf.gov.sg/employer/employer-obligations/how-much-cpf-contributions-to-pay
- **IRAS:** https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates
- **CPF Allocation Rates:** https://www.cpf.gov.sg/member/faq/growing-your-savings/saving-as-an-employee/what-are-the-cpf-allocation-rates
- **CPF Contribution Rates Table:** https://www.cpf.gov.sg/employer/employer-obligations/how-much-cpf-contributions-to-pay
