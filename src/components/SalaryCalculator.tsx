import { useState, useMemo } from 'react';
import { calculateSalary, type SalaryInput, type SalaryResult } from '../lib/engine';
import type { ResidencyType } from '../lib/cpf-rates-2026';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

const RESIDENCY_OPTIONS: { value: ResidencyType; label: string }[] = [
  { value: 'citizen', label: 'Singapore Citizen' },
  { value: 'pr_1st_year', label: 'PR (1st Year)' },
  { value: 'pr_2nd_year', label: 'PR (2nd Year)' },
  { value: 'pr_3rd_year_onwards', label: 'PR (3rd Year+)' },
  { value: 'foreigner', label: 'Foreigner / EP / S Pass' },
];

export default function SalaryCalculator() {
  const [monthlyGross, setMonthlyGross] = useState<number>(5000);
  const [age, setAge] = useState<number>(30);
  const [residencyType, setResidencyType] = useState<ResidencyType>('citizen');
  const [annualBonus, setAnnualBonus] = useState<number>(0);
  const [includeNSman, setIncludeNSman] = useState<boolean>(false);

  const result: SalaryResult = useMemo(() => {
    return calculateSalary({
      monthlyGross: Math.max(0, monthlyGross),
      age: Math.max(16, Math.min(99, age)),
      residencyType,
      annualBonus: Math.max(0, annualBonus),
      includeNSmanRelief: includeNSman,
    });
  }, [monthlyGross, age, residencyType, annualBonus, includeNSman]);

  const effectiveTaxRate = result.annualTotalIncome > 0
    ? (result.annualTax / result.annualTotalIncome) * 100
    : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>

          {/* Monthly Gross Salary */}
          <div className="mb-5">
            <label htmlFor="monthlyGross" className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Gross Salary (SGD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                id="monthlyGross"
                type="number"
                min={0}
                max={999999}
                step={100}
                value={monthlyGross}
                onChange={(e) => setMonthlyGross(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg font-semibold transition-colors"
              />
            </div>
          </div>

          {/* Quick salary presets */}
          <div className="mb-5 flex flex-wrap gap-2">
            {[3000, 4500, 6000, 8000, 10000, 15000].map((val) => (
              <button
                key={val}
                onClick={() => setMonthlyGross(val)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  monthlyGross === val
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                ${val.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Age */}
          <div className="mb-5">
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
              Age: <span className="text-primary font-bold text-lg">{age}</span>
            </label>
            <input
              id="age"
              type="range"
              min={16}
              max={80}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>16</span>
              <span>55</span>
              <span>65</span>
              <span>80</span>
            </div>
          </div>

          {/* Residency Type */}
          <div className="mb-5">
            <label htmlFor="residency" className="block text-sm font-semibold text-gray-700 mb-2">
              Residency Status
            </label>
            <select
              id="residency"
              value={residencyType}
              onChange={(e) => setResidencyType(e.target.value as ResidencyType)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base bg-white transition-colors"
            >
              {RESIDENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Annual Bonus */}
          <div className="mb-5">
            <label htmlFor="bonus" className="block text-sm font-semibold text-gray-700 mb-2">
              Annual Bonus / AWS (SGD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                id="bonus"
                type="number"
                min={0}
                max={9999999}
                step={500}
                value={annualBonus}
                onChange={(e) => setAnnualBonus(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg font-semibold transition-colors"
              />
            </div>
          </div>

          {/* NSman Relief */}
          {(residencyType === 'citizen' || residencyType === 'pr_3rd_year_onwards') && (
            <div className="mb-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNSman}
                  onChange={(e) => setIncludeNSman(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm font-medium text-gray-700">Include NSman Relief ($3,000)</span>
              </label>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Take-Home Highlight */}
          <div className="bg-primary rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-medium text-red-100 uppercase tracking-wider">Monthly Take-Home Pay</p>
            <p className="text-4xl font-black mt-2">{formatCurrency(result.monthlyTakeHome)}</p>
            <p className="text-red-200 text-sm mt-2">
              {formatCurrency(result.annualNetIncome)} per year
            </p>
            <div className="mt-4 pt-4 border-t border-red-400/30 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-red-200 uppercase">Effective Tax Rate</p>
                <p className="text-lg font-bold">{formatPercent(effectiveTaxRate)}</p>
              </div>
              <div>
                <p className="text-xs text-red-200 uppercase">CPF Rate</p>
                <p className="text-lg font-bold">
                  {result.cpfRate ? formatPercent(result.cpfRate.employee) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Breakdown</h3>
            <div className="space-y-3">
              <Row label="Gross Salary" value={formatCurrency(result.monthlyGross)} bold />
              <Row label="Employee CPF" value={`-${formatCurrency(result.monthlyEmployeeCPF)}`} className="text-orange-600" />
              <Row label="Income Tax (monthly)" value={`-${formatCurrency(result.monthlyTax)}`} className="text-red-600" />
              <div className="border-t border-gray-200 pt-3">
                <Row label="Net Take-Home" value={formatCurrency(result.monthlyTakeHome)} bold className="text-green-700" />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="Employer CPF" value={`+${formatCurrency(result.cpf.employerContribution)}`} className="text-blue-600" />
                <Row label="Total Employer Cost" value={formatCurrency(result.monthlyEmployerCost)} bold className="text-gray-900" />
              </div>
            </div>
          </div>

          {/* CPF Breakdown */}
          {residencyType !== 'foreigner' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">CPF Allocation (Monthly)</h3>
              <div className="space-y-3">
                <CPFBar label="Ordinary Account (OA)" value={result.cpf.oa} total={result.cpf.totalContribution} color="bg-blue-500" />
                <CPFBar label="Special Account (SA)" value={result.cpf.sa} total={result.cpf.totalContribution} color="bg-green-500" />
                <CPFBar label="MediSave Account (MA)" value={result.cpf.ma} total={result.cpf.totalContribution} color="bg-purple-500" />
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Total monthly CPF: {formatCurrency(result.cpf.totalContribution)} (Employee: {formatCurrency(result.cpf.employeeContribution)} + Employer: {formatCurrency(result.cpf.employerContribution)})
              </p>
            </div>
          )}

          {/* Annual Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Annual Summary</h3>
            <div className="space-y-3">
              <Row label="Annual Gross" value={formatCurrency(result.annualGross)} />
              {result.annualBonus > 0 && (
                <Row label="Annual Bonus" value={formatCurrency(result.annualBonus)} />
              )}
              <Row label="Total Income" value={formatCurrency(result.annualTotalIncome)} bold />
              <Row label="Annual Employee CPF" value={`-${formatCurrency(result.annualEmployeeCPF)}`} className="text-orange-600" />
              <Row label="Annual Income Tax" value={`-${formatCurrency(result.annualTax)}`} className="text-red-600" />
              <div className="border-t border-gray-200 pt-3">
                <Row label="Annual Net Income" value={formatCurrency(result.annualNetIncome)} bold className="text-green-700" />
              </div>
              <div className="border-t border-gray-100 pt-3">
                <Row label="Total Reliefs" value={formatCurrency(result.totalReliefs)} className="text-gray-500" />
                <Row label="Chargeable Income" value={formatCurrency(result.chargeableIncome)} className="text-gray-500" />
                <Row label="Annual Employer Cost" value={formatCurrency(result.annualEmployerCost)} bold />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold = false,
  className = '',
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex justify-between items-center ${bold ? 'font-bold' : ''} ${className}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm ${bold ? 'text-base' : ''}`}>{value}</span>
    </div>
  );
}

function CPFBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{formatCurrency(value)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
