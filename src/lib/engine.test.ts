import { describe, it, expect } from 'vitest';
import { calculateCPF, calculateIncomeTax, calculateSalary } from './engine';

describe('calculateCPF', () => {
  it('should calculate CPF for citizen aged 30 at $5,000/month', () => {
    const cpf = calculateCPF(5000, 30, 'citizen');
    expect(cpf.employeeContribution).toBe(1000); // 20% of 5000
    expect(cpf.employerContribution).toBe(850);  // 17% of 5000
  });

  it('should apply OW ceiling of $6,800 for high earners', () => {
    const cpf = calculateCPF(10000, 30, 'citizen');
    // CPF should be on $6,800, not $10,000
    expect(cpf.employeeContribution).toBe(1360); // 20% of 6800
    expect(cpf.employerContribution).toBe(1156); // 17% of 6800
  });

  it('should use reduced rates for age 56-60', () => {
    const cpf = calculateCPF(5000, 58, 'citizen');
    expect(cpf.employeeContribution).toBe(750);  // 15% of 5000
    expect(cpf.employerContribution).toBe(750);  // 15% of 5000
  });

  it('should use reduced rates for age 61-65', () => {
    const cpf = calculateCPF(5000, 63, 'citizen');
    expect(cpf.employeeContribution).toBe(475);  // 9.5% of 5000
    expect(cpf.employerContribution).toBe(575);  // 11.5% of 5000
  });

  it('should use reduced rates for age 66-70', () => {
    const cpf = calculateCPF(5000, 68, 'citizen');
    expect(cpf.employeeContribution).toBe(350);  // 7% of 5000
    expect(cpf.employerContribution).toBe(450);  // 9% of 5000
  });

  it('should use reduced rates for age above 70', () => {
    const cpf = calculateCPF(5000, 75, 'citizen');
    expect(cpf.employeeContribution).toBe(250);  // 5% of 5000
    expect(cpf.employerContribution).toBe(375);  // 7.5% of 5000
  });

  it('should return zero CPF for foreigners', () => {
    const cpf = calculateCPF(8000, 30, 'foreigner');
    expect(cpf.employeeContribution).toBe(0);
    expect(cpf.employerContribution).toBe(0);
    expect(cpf.totalContribution).toBe(0);
  });

  it('should use PR 1st year rates', () => {
    const cpf = calculateCPF(5000, 30, 'pr_1st_year');
    expect(cpf.employeeContribution).toBe(250);  // 5% of 5000
    expect(cpf.employerContribution).toBe(200);  // 4% of 5000
  });

  it('should use PR 2nd year rates', () => {
    const cpf = calculateCPF(5000, 30, 'pr_2nd_year');
    expect(cpf.employeeContribution).toBe(750);  // 15% of 5000
    expect(cpf.employerContribution).toBe(450);  // 9% of 5000
  });

  it('should handle bonus with AW ceiling', () => {
    // OW = $6,800/month, annual OW subject = $81,600
    // AW ceiling = $102,000 - $81,600 = $20,400
    const cpf = calculateCPF(6800, 30, 'citizen', 30000);
    expect(cpf.bonusEmployeeContribution).toBe(Math.round(20400 * 0.20)); // 4080
    expect(cpf.bonusEmployerContribution).toBe(Math.round(20400 * 0.17)); // 3468
  });

  it('should handle bonus within AW ceiling', () => {
    // OW = $3,000/month, annual OW subject = $36,000
    // AW ceiling = $102,000 - $36,000 = $66,000
    // Bonus of $5,000 is well within ceiling
    const cpf = calculateCPF(3000, 30, 'citizen', 5000);
    expect(cpf.bonusEmployeeContribution).toBe(1000); // 20% of 5000
    expect(cpf.bonusEmployerContribution).toBe(850);  // 17% of 5000
  });

  it('should allocate CPF to OA/SA/MA accounts', () => {
    const cpf = calculateCPF(5000, 30, 'citizen');
    // Total = 1850, allocation for age <=35: OA=62.17%, SA=16.21%, MA=21.62%
    expect(cpf.oa + cpf.sa + cpf.ma).toBe(cpf.totalContribution);
    expect(cpf.oa).toBeGreaterThan(0);
    expect(cpf.sa).toBeGreaterThan(0);
    expect(cpf.ma).toBeGreaterThan(0);
  });
});

describe('calculateIncomeTax', () => {
  it('should return 0 tax for income under $20,000', () => {
    expect(calculateIncomeTax(15000)).toBe(0);
    expect(calculateIncomeTax(20000)).toBe(0);
  });

  it('should calculate tax for $30,000 chargeable income', () => {
    // First $20,000: $0
    // Next $10,000 at 2%: $200
    expect(calculateIncomeTax(30000)).toBe(200);
  });

  it('should calculate tax for $50,000 chargeable income', () => {
    // First $20,000: $0
    // Next $10,000 at 2%: $200
    // Next $10,000 at 3.5%: $350
    // Next $10,000 at 7%: $700
    // Total: $1,250
    expect(calculateIncomeTax(50000)).toBe(1250);
  });

  it('should calculate tax for $100,000 chargeable income', () => {
    // First $20,000: $0
    // Next $10,000 at 2%: $200
    // Next $10,000 at 3.5%: $350
    // Next $40,000 at 7%: $2,800
    // Next $20,000 at 11.5%: $2,300
    // Total: $5,650
    expect(calculateIncomeTax(100000)).toBe(5650);
  });

  it('should calculate tax for $200,000 chargeable income', () => {
    // First $20,000: $0
    // Next $10,000 at 2%: $200
    // Next $10,000 at 3.5%: $350
    // Next $40,000 at 7%: $2,800
    // Next $40,000 at 11.5%: $4,600
    // Next $40,000 at 15%: $6,000
    // Next $40,000 at 18%: $7,200
    // Total: $21,150
    expect(calculateIncomeTax(200000)).toBe(21150);
  });

  it('should handle zero income', () => {
    expect(calculateIncomeTax(0)).toBe(0);
  });

  it('should handle negative income', () => {
    expect(calculateIncomeTax(-5000)).toBe(0);
  });
});

describe('calculateSalary', () => {
  it('should calculate full salary for citizen aged 30 at $5,000/month', () => {
    const result = calculateSalary({
      monthlyGross: 5000,
      age: 30,
      residencyType: 'citizen',
      annualBonus: 0,
    });

    expect(result.monthlyGross).toBe(5000);
    expect(result.monthlyEmployeeCPF).toBe(1000);
    expect(result.monthlyNetBeforeTax).toBe(4000);
    expect(result.annualGross).toBe(60000);
    expect(result.cpf.employerContribution).toBe(850);
    expect(result.monthlyEmployerCost).toBe(5850);
    expect(result.annualTax).toBeGreaterThanOrEqual(0);
    expect(result.monthlyTakeHome).toBeLessThan(result.monthlyGross);
  });

  it('should calculate salary for foreigner (no CPF)', () => {
    const result = calculateSalary({
      monthlyGross: 8000,
      age: 35,
      residencyType: 'foreigner',
      annualBonus: 0,
    });

    expect(result.monthlyEmployeeCPF).toBe(0);
    expect(result.cpf.employerContribution).toBe(0);
    expect(result.monthlyEmployerCost).toBe(8000);
    // Foreigner tax at 15% flat
    expect(result.annualTax).toBe(Math.round(96000 * 0.15));
  });

  it('should include bonus in annual calculations', () => {
    const withBonus = calculateSalary({
      monthlyGross: 5000,
      age: 30,
      residencyType: 'citizen',
      annualBonus: 10000,
    });

    const withoutBonus = calculateSalary({
      monthlyGross: 5000,
      age: 30,
      residencyType: 'citizen',
      annualBonus: 0,
    });

    expect(withBonus.annualTotalIncome).toBe(withoutBonus.annualTotalIncome + 10000);
    expect(withBonus.annualNetIncome).toBeGreaterThan(withoutBonus.annualNetIncome);
  });

  it('should apply earned income relief based on age', () => {
    const young = calculateSalary({
      monthlyGross: 5000,
      age: 30,
      residencyType: 'citizen',
      annualBonus: 0,
    });

    const senior = calculateSalary({
      monthlyGross: 5000,
      age: 60,
      residencyType: 'citizen',
      annualBonus: 0,
    });

    // Senior gets $8,000 relief vs $1,000 for young
    expect(senior.totalReliefs).toBeGreaterThan(young.totalReliefs - young.cpf.annualEmployeeContribution + senior.cpf.annualEmployeeContribution);
  });

  it('should ensure take-home is positive for reasonable salaries', () => {
    const result = calculateSalary({
      monthlyGross: 3000,
      age: 25,
      residencyType: 'citizen',
      annualBonus: 0,
    });

    expect(result.monthlyTakeHome).toBeGreaterThan(0);
    expect(result.annualNetIncome).toBeGreaterThan(0);
  });
});
