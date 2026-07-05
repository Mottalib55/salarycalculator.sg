// Dynamic salary page content generator
// Produces UNIQUE text per exact salary level to achieve 80%+ inter-page uniqueness
// Strategy: completely different paragraph structures, sentence patterns, and vocabulary per salary band

import { calculateSalary, type SalaryResult } from './engine';
import { OW_CEILING_MONTHLY } from './cpf-rates-2026';

// Singapore benchmarks
const SG_MEDIAN_GROSS = 5500;
const WORKING_DAYS_PER_MONTH = 22;
const WORKING_HOURS_PER_DAY = 8;

// ─── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return `S$${Math.round(n).toLocaleString('en-SG')}`;
}

function fmtDec(n: number): string {
  return `S$${n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pct(n: number, d: number = 1): string {
  return `${n.toFixed(d)}%`;
}

// ─── Salary-specific career data ────────────────────────────────────────────────
interface CareerData {
  roles: string[];
  industries: string[];
  experience: string;
  context: string; // unique paragraph about this salary band's workforce
}

const CAREERS: Record<number, CareerData> = {
  3000: {
    roles: ['junior retail supervisor', 'entry-level administrative assistant', 'food and beverage crew leader', 'warehouse logistics assistant', 'customer service representative'],
    industries: ['Retail', 'F&B Hospitality', 'Warehousing', 'Customer Support'],
    experience: 'fresh diploma graduates or workers with up to 2 years of experience',
    context: 'This income bracket represents Singapore\'s entry-level workforce. Many workers here hold ITE or polytechnic qualifications and are building foundational skills. The Progressive Wage Model (PWM) has lifted wages in sectors like cleaning, security, and food services, meaning some PWM-covered roles now start at or near this level. Workers at this salary often supplement income through overtime, shift allowances, or gig economy work on platforms like Grab or foodpanda during off-hours.',
  },
  4000: {
    roles: ['junior software developer', 'banking operations executive', 'marketing coordinator', 'junior accountant at a local firm', 'dental clinic administrator'],
    industries: ['Technology', 'Banking Operations', 'Marketing', 'Accounting', 'Healthcare Admin'],
    experience: 'fresh university graduates or professionals with 1 to 3 years of work history',
    context: 'The four-thousand-dollar bracket captures Singapore\'s graduate entry point. Local university graduates from NUS, NTU, and SMU typically start between this level and the next bracket depending on their discipline. Engineering and computing graduates often start higher, while arts, social sciences, and business graduates may begin here. Many workers at this level are in their first professional role and actively building credentials through courses on platforms like SkillsFuture, aiming for rapid salary progression within 2 to 3 years.',
  },
  5000: {
    roles: ['mid-level software engineer', 'registered nurse with 3 to 5 years seniority', 'senior marketing executive', 'construction project coordinator', 'HR generalist at an SME'],
    industries: ['Information Technology', 'Nursing and Healthcare', 'Marketing Communications', 'Built Environment', 'Human Resources'],
    experience: 'professionals possessing 3 to 5 years of relevant industry tenure',
    context: 'At the five-thousand-dollar level, workers have typically proven their competence and begun specialising. This is near Singapore\'s median income, meaning roughly half of all full-time workers earn less. Professionals here are often considering whether to deepen technical expertise or pivot toward management. Many hold bachelor\'s degrees and are pursuing professional certifications such as PMP, ACCA, or AWS cloud credentials. Job-hopping every 2 to 3 years is common at this level as a strategy to accelerate salary growth beyond the typical 3 to 5 percent annual increment.',
  },
  6000: {
    roles: ['senior accountant at a mid-tier audit firm', 'mechanical engineer holding PE status', 'HR manager at a 50-person SME', 'UX designer at a digital agency', 'operations manager in third-party logistics'],
    industries: ['Audit and Accounting', 'Professional Engineering', 'HR Management', 'Digital Design', 'Supply Chain Logistics'],
    experience: 'professionals with 4 to 7 years of cumulative experience and sector-specific certifications',
    context: 'Six thousand dollars monthly positions a worker in the sweet spot just below the CPF wage ceiling. Almost the entire salary attracts full CPF contributions, maximising retirement savings without losing significant cash flow. Workers here often manage small teams or own specific business processes. The transition from individual contributor to people manager frequently happens at this compensation band. Industries like accounting see this as the "pre-manager" grade, where seniors are assessed for partnership track potential.',
  },
  7000: {
    roles: ['senior software engineer at a growth-stage startup', 'assistant manager in retail banking', 'senior physiotherapist in private practice', 'IT operations team lead', 'business development manager for Southeast Asia'],
    industries: ['Startup Technology', 'Retail Banking', 'Allied Health Professionals', 'IT Infrastructure', 'Regional Business Development'],
    experience: 'seasoned professionals with 5 to 10 years of domain expertise and leadership responsibilities',
    context: 'The seven-thousand mark is notable because it crosses the CPF Ordinary Wage ceiling of six thousand eight hundred dollars. This means the marginal dollar above the ceiling goes entirely to cash without attracting additional CPF. Workers at this level commonly hold titles containing "Senior" or "Lead" and are responsible for mentoring juniors. In tech, this is the level where individual contributors with strong skills can match or exceed the pay of early managers, reflecting Singapore\'s growing recognition of technical career tracks.',
  },
  8000: {
    roles: ['lead data engineer at a multinational', 'assistant vice president in transaction banking', 'senior quantity surveyor at a consultancy', 'regional sales manager covering ASEAN', 'principal clinical pharmacist'],
    industries: ['Data Engineering', 'Transaction Banking', 'Quantity Surveying', 'ASEAN Sales', 'Clinical Pharmacy'],
    experience: 'first-line managers and senior specialists carrying 7 to 12 years of progressive career growth',
    context: 'Eight thousand per month places a professional in approximately the 65th to 70th income percentile nationally. Titles at this band often include "Assistant Vice President," "Lead," or "Principal." The gap between this salary and the CPF ceiling means twelve hundred dollars monthly avoids CPF deduction entirely, flowing straight to disposable income. Workers here typically manage budgets, lead cross-functional projects, or serve as subject-matter experts consulted across their organisation. Stock options or restricted share units begin appearing in compensation packages at this tier, particularly in technology and banking.',
  },
  10000: {
    roles: ['engineering manager at a FAANG-tier company', 'vice president in investment banking coverage', 'senior data scientist leading ML initiatives', 'specialist registrar in a public hospital', 'head of performance marketing at a D2C brand'],
    industries: ['Big Tech Engineering', 'Investment Banking', 'Machine Learning', 'Specialist Medicine', 'Performance Marketing'],
    experience: 'senior managers and recognised domain authorities with 10 to 15 years of career progression',
    context: 'Crossing the ten-thousand-dollar threshold places a professional in the top quarter of Singapore earners. At this level, compensation discussions shift from purely base salary to total package including bonuses, equity, and benefits. Tech professionals here often receive annual stock grants worth 20 to 40 percent of base. Doctors in public hospitals at registrar grade reach this level before specialist accreditation unlocks significantly higher private practice earnings. Banking VPs at this base typically earn an additional 30 to 100 percent in annual performance bonuses.',
  },
  12000: {
    roles: ['director of engineering at a Series B venture', 'senior associate at an international law firm', 'head of financial planning and analysis at a listed company', 'consultant physician in an outpatient specialty', 'country general manager for a SaaS platform'],
    industries: ['Venture-Backed Tech', 'International Legal', 'Corporate FP&A', 'Specialist Medical Practice', 'Enterprise SaaS'],
    experience: 'directors and deep specialists with 12 to 18 years of accumulated professional capital',
    context: 'Twelve thousand monthly reflects a level where professionals have significant organisational influence. In law firms, senior associates at this base are typically 8 to 10 years post-qualification and billing upwards of two thousand dollars per hour. In tech, directors at this level manage multiple teams totalling 15 to 40 engineers. The compensation structure often includes a guaranteed bonus of 2 to 4 months plus performance-linked variable pay. These professionals are frequently headhunted, with executive recruiters actively maintaining relationships at this tier.',
  },
  15000: {
    roles: ['VP of product at a unicorn valuation company', 'equity partner at a mid-size Singapore law firm', 'head of treasury at a regional bank', 'chief solutions architect at a global consultancy', 'medical director overseeing clinical operations'],
    industries: ['Unicorn Product Management', 'Legal Partnership', 'Bank Treasury', 'Global Consulting', 'Private Hospital Leadership'],
    experience: 'C-minus-one executives and equity-holding partners with 15 to 20 years of career commitment',
    context: 'At fifteen thousand monthly, professionals typically sit one level below the C-suite or hold equity partnership stakes. In law, equity partners at this base salary draw additional profit shares that can double or triple total compensation. In medicine, this level reflects senior consultants who have completed subspecialty training and built referral networks. Tech leaders here manage P&L responsibility for product lines generating tens of millions in revenue. The Employment Pass minimum qualifying salary for experienced professionals is well exceeded at this level, making it straightforward for foreign hires.',
  },
  20000: {
    roles: ['chief technology officer at a funded growth company', 'managing director in global markets at a bulge bracket bank', 'senior partner at a Big Four professional services firm', 'chief medical officer at a hospital group', 'regional chief executive of a mid-capitalisation multinational'],
    industries: ['Growth-Stage CTO', 'Global Markets Trading', 'Big Four Partnership', 'Hospital Group Administration', 'Regional Multinational Leadership'],
    experience: 'apex-level executives and equity-holding managing partners commanding 18 to 25 or more years of leadership trajectory',
    context: 'Twenty thousand per month as base salary positions a professional among the top five percent of Singapore income earners. However, base salary at this level often represents only 40 to 60 percent of total annual compensation. Managing Directors at investment banks supplement this with bonuses of 50 to 200 percent of base. Big Four senior partners receive profit-sharing distributions. Tech CTOs receive equity packages that vest over four years. At this compensation tier, professionals employ personal tax advisors and wealth managers, and many structure aspects of their compensation to maximise after-tax efficiency through vehicles like SRS, family trusts, and holding companies.',
  },
  25000: {
    roles: ['chief executive of a mid-cap SGX-listed corporation', 'global head of a banking product vertical', 'named partner at a premier Singapore law practice', 'chief of surgery at a leading private hospital', 'country president of a Fortune 500 multinational'],
    industries: ['SGX-Listed Leadership', 'Global Banking Products', 'Premier Legal Practice', 'Surgical Leadership', 'Fortune 500 Country Management'],
    experience: 'pinnacle-level leaders holding board-reportable positions and substantial equity stakes in their organisations',
    context: 'Twenty-five thousand in monthly base salary signals board-level executive positioning. These professionals typically negotiate multi-year employment contracts with guaranteed bonuses, long-term incentive plans tied to shareholder value, and golden parachute clauses. Their compensation packages are approved by remuneration committees and disclosed in annual reports for listed companies. At this income level in Singapore, the absence of capital gains tax and dividend tax makes equity-heavy compensation particularly attractive compared to jurisdictions that tax investment gains. Many executives at this tier hold directorships at multiple boards, adding non-executive director fees of fifty to one hundred thousand dollars annually.',
  },
  30000: {
    roles: ['group chief executive of a large SGX-listed conglomerate', 'executive director and desk head at Goldman Sachs or JP Morgan', 'founding and managing partner of a Magic Circle law firm Singapore office', 'chief of department at a leading academic medical centre', 'Asia-Pacific regional president of a Fortune 100 corporation'],
    industries: ['SGX Blue-Chip Conglomerate', 'Bulge Bracket Investment Banking', 'Magic Circle Legal', 'Academic Medical Centre', 'Fortune 100 APAC Operations'],
    experience: 'the highest echelon of professional achievement, representing individuals in the top one to two percent of all Singapore income earners',
    context: 'Thirty thousand dollars monthly base places a professional at the apex of Singapore\'s employment income pyramid. At this rarefied level, base salary is often the smaller component of total pay. Investment banking executive directors and managing directors receive bonuses of 100 to 300 percent of base in strong years. Listed company CEOs receive equity grants, performance shares, and long-term incentive plans that can equal several multiples of base salary. These executives shape corporate strategy, manage thousands of employees, and bear fiduciary responsibility to shareholders. Singapore\'s tax cap of 24 percent on marginal income, combined with zero capital gains and zero dividend taxes, makes the city-state exceptionally attractive for accumulating wealth at this compensation level compared to nearly every other global financial centre.',
  },
};

// ─── getBandContext ─────────────────────────────────────────────────────────────
export function getBandContext(amount: number, result: SalaryResult): string {
  const ratio = amount / SG_MEDIAN_GROSS;
  const dailyGross = amount / WORKING_DAYS_PER_MONTH;
  const hourlyGross = dailyGross / WORKING_HOURS_PER_DAY;
  const dailyNet = result.monthlyTakeHome / WORKING_DAYS_PER_MONTH;
  const hourlyNet = dailyNet / WORKING_HOURS_PER_DAY;
  const annualGross = amount * 12;
  const cpfTotal = result.cpf.employeeContribution + result.cpf.employerContribution;
  const effectiveTaxRate = result.annualTax / annualGross * 100;
  const retentionRate = (result.monthlyTakeHome / amount) * 100;
  const totalComp = amount + result.cpf.employerContribution;

  // Different paragraph structure per salary band
  if (amount <= 3000) {
    return `Earning ${fmt(amount)} gross each month in Singapore means taking home ${fmt(result.monthlyTakeHome)} after the mandatory CPF employee deduction of ${fmt(result.monthlyEmployeeCPF)} and income tax of ${fmt(result.monthlyTax)} per month. This translates to a daily earning power of ${fmtDec(dailyNet)} net across ${WORKING_DAYS_PER_MONTH} working days, or ${fmtDec(hourlyNet)} for each hour worked. Your annual gross income reaches ${fmt(annualGross)}, which sits at ${pct(ratio * 100, 0)} of the national median. The government effectively adds ${fmt(result.cpf.employerContribution)} to your package through employer CPF, bringing total monthly compensation to ${fmt(totalComp)}. Across twelve months, your combined CPF (employee plus employer) accumulates ${fmt(cpfTotal * 12)}, building retirement and housing savings even at this entry-level income. Your cash retention rate stands at ${pct(retentionRate)} of gross pay.`;
  }
  if (amount <= 4000) {
    return `On a ${fmt(amount)} monthly gross, Singapore's tax and CPF system leaves you with ${fmt(result.monthlyTakeHome)} in spendable income each month. Your employer shoulders an additional ${fmt(result.cpf.employerContribution)} in CPF contributions beyond your salary, making the true value of your employment package ${fmt(totalComp)} monthly or ${fmt(totalComp * 12)} per year. Breaking it down further: each working day earns you ${fmtDec(dailyNet)} net, and each working hour puts ${fmtDec(hourlyNet)} in your pocket after all deductions. At ${pct(ratio * 100, 0)} of the Singapore median wage, this income level provides a foundation for career growth. The total CPF flowing into your accounts each month is ${fmt(cpfTotal)}, while your annual tax burden of ${fmt(result.annualTax)} works out to an effective rate of just ${pct(effectiveTaxRate)} — among the lowest in the developed world.`;
  }
  if (amount <= 5000) {
    return `A ${fmt(amount)} salary positions you near the heart of Singapore's income distribution at approximately ${ratio.toFixed(1)} times the median. Every month, CPF deducts ${fmt(result.monthlyEmployeeCPF)} from your pay and the taxman claims ${fmt(result.monthlyTax)}, leaving ${fmt(result.monthlyTakeHome)} for your living expenses. Your employer contributes a further ${fmt(result.cpf.employerContribution)} to CPF on top of your salary, effectively valuing your position at ${fmt(totalComp)} per month. Converting to daily figures, you earn ${fmtDec(dailyGross)} gross per working day or ${fmtDec(dailyNet)} after all withholdings. The per-hour calculation works out to ${fmtDec(hourlyGross)} gross and ${fmtDec(hourlyNet)} net. Over a full year, you'll have ${fmt(result.annualNetIncome)} in actual spending money from ${fmt(annualGross)} in gross earnings, representing a ${pct(retentionRate)} retention of your headline salary.`;
  }
  if (amount <= 6000) {
    return `Singapore workers bringing home ${fmt(amount)} in gross monthly pay sit just below the CPF Ordinary Wage ceiling, meaning nearly every dollar attracts full CPF contributions. The employee share of ${fmt(result.monthlyEmployeeCPF)} comes off your pay, while your employer adds ${fmt(result.cpf.employerContribution)} — totalling ${fmt(cpfTotal)} flowing into your three CPF accounts. After CPF and ${fmt(result.monthlyTax)} in monthly tax, you bank ${fmt(result.monthlyTakeHome)}. This is ${pct(ratio * 100, 0)} of the national median salary, placing you above most working residents. On a per-day basis, your net earning rate is ${fmtDec(dailyNet)} across standard working days, and per hour it comes to ${fmtDec(hourlyNet)}. The annual picture shows ${fmt(result.annualNetIncome)} in cash income against a gross of ${fmt(annualGross)}, with an effective tax rate of only ${pct(effectiveTaxRate)}.`;
  }
  if (amount <= 7000) {
    return `At ${fmt(amount)} monthly, you cross above Singapore's CPF wage ceiling of ${fmt(OW_CEILING_MONTHLY)}. This ceiling effect means CPF is calculated on only ${fmt(OW_CEILING_MONTHLY)} of your salary, and the excess ${fmt(amount - OW_CEILING_MONTHLY)} flows directly to your bank account without deduction. Your total monthly deductions are ${fmt(result.monthlyEmployeeCPF)} for CPF plus ${fmt(result.monthlyTax)} for income tax, yielding ${fmt(result.monthlyTakeHome)} in take-home pay. This salary exceeds the national median by a factor of ${ratio.toFixed(2)}x. Your employer's CPF contribution of ${fmt(result.cpf.employerContribution)} raises your total compensation to ${fmt(totalComp)}. Daily, you net ${fmtDec(dailyNet)} per working day; hourly, that's ${fmtDec(hourlyNet)} after all statutory deductions. The effective tax impost on your ${fmt(annualGross)} annual earnings is a competitive ${pct(effectiveTaxRate)}.`;
  }
  if (amount <= 8000) {
    return `Professionals drawing ${fmt(amount)} per month in Singapore retain ${pct(retentionRate)} of their gross as disposable income, taking home ${fmt(result.monthlyTakeHome)} each month. The CPF wage ceiling at ${fmt(OW_CEILING_MONTHLY)} means your employee CPF is capped at ${fmt(result.monthlyEmployeeCPF)}, with the remaining ${fmt(amount - OW_CEILING_MONTHLY)} above the ceiling untouched by CPF. Monthly income tax accounts for ${fmt(result.monthlyTax)}. Your income sits ${ratio.toFixed(1)} times above the national median, placing you well within the upper-middle range of Singapore earners. In daily terms, you command ${fmtDec(dailyNet)} net for each working day, translating to ${fmtDec(hourlyNet)} per productive hour. The annual gross of ${fmt(annualGross)} faces an effective tax burden of ${pct(effectiveTaxRate)}, leaving you ${fmt(result.annualNetIncome)} in yearly take-home. Your employer's cost for your position totals ${fmt(result.monthlyEmployerCost)} inclusive of the ${fmt(result.cpf.employerContribution)} CPF top-up.`;
  }
  if (amount <= 10000) {
    return `Drawing ${fmt(amount)} in monthly gross places you squarely in the top quarter of Singapore earners, at ${ratio.toFixed(1)}x the median salary. The gap between your pay and the CPF ceiling of ${fmt(OW_CEILING_MONTHLY)} means ${fmt(amount - OW_CEILING_MONTHLY)} of each month's wages bypasses CPF entirely, boosting your cash position. After ${fmt(result.monthlyEmployeeCPF)} in CPF and ${fmt(result.monthlyTax)} in tax, you retain ${fmt(result.monthlyTakeHome)} — a retention rate of ${pct(retentionRate)}. Annualised, your gross of ${fmt(annualGross)} converts to ${fmt(result.annualNetIncome)} in spending power. Per working day, you effectively earn ${fmtDec(dailyNet)} net; per hour, ${fmtDec(hourlyNet)}. Your employer invests ${fmt(result.monthlyEmployerCost)} total per month in your compensation, with ${fmt(result.cpf.employerContribution)} directed to CPF. At this income level, Singapore's effective tax rate of ${pct(effectiveTaxRate)} is approximately one-third of what the same gross would attract in London or New York.`;
  }
  if (amount <= 12000) {
    return `A ${fmt(amount)} monthly salary in Singapore reflects upper-quartile professional compensation, registering ${ratio.toFixed(1)} times the national median. Your after-deduction income of ${fmt(result.monthlyTakeHome)} per month results from subtracting capped CPF of ${fmt(result.monthlyEmployeeCPF)} and income tax of ${fmt(result.monthlyTax)} from gross. With ${fmt(amount - OW_CEILING_MONTHLY)} sitting above the CPF ceiling each month, a substantial portion of your earnings avoids retirement fund lock-up. The hourly economics are compelling: ${fmtDec(hourlyNet)} net per hour worked, or ${fmtDec(dailyNet)} per standard working day. Your employer's all-in monthly cost is ${fmt(result.monthlyEmployerCost)}, inclusive of their ${fmt(result.cpf.employerContribution)} CPF obligation. Over twelve months, your ${fmt(annualGross)} gross yields ${fmt(result.annualNetIncome)} in liquid income after the ${pct(effectiveTaxRate)} effective tax rate — a rate that positions Singapore among the world's most tax-efficient jurisdictions for high earners.`;
  }
  if (amount <= 15000) {
    return `Earning ${fmt(amount)} per month puts you in the top decile of Singapore's income distribution, exceeding the median by ${ratio.toFixed(1)} times. The contrast between gross and net is instructive: from ${fmt(amount)}, the system extracts ${fmt(result.monthlyEmployeeCPF)} for CPF (capped at the ${fmt(OW_CEILING_MONTHLY)} ceiling) and ${fmt(result.monthlyTax)} for IRAS, depositing ${fmt(result.monthlyTakeHome)} into your account. That's ${fmtDec(dailyNet)} for every working day, or ${fmtDec(hourlyNet)} for each working hour. The amount above the CPF ceiling — ${fmt(amount - OW_CEILING_MONTHLY)} monthly — goes straight to cash, reflecting the system's design to limit mandatory savings for higher earners. Your employer pays ${fmt(result.monthlyEmployerCost)} total monthly to employ you. Annually, ${fmt(annualGross)} in gross becomes ${fmt(result.annualNetIncome)} in net at an effective rate of ${pct(effectiveTaxRate)}, a figure that attracts global talent to Singapore.`;
  }
  if (amount <= 20000) {
    return `At ${fmt(amount)} monthly gross, you belong to the top five to seven percent of Singapore income earners — earning ${ratio.toFixed(1)}x the national median. The post-deduction reality: ${fmt(result.monthlyEmployeeCPF)} goes to CPF (hitting the ceiling long before your actual salary), ${fmt(result.monthlyTax)} services your income tax obligation, and ${fmt(result.monthlyTakeHome)} reaches your bank each month. On a per-hour basis, your net earning power is ${fmtDec(hourlyNet)}; per day, ${fmtDec(dailyNet)}. The ${fmt(amount - OW_CEILING_MONTHLY)} monthly that exceeds the CPF ceiling represents pure cash compensation. Your employer's total investment in your role amounts to ${fmt(result.monthlyEmployerCost)} monthly or ${fmt(result.annualEmployerCost)} annually. The effective income tax on ${fmt(annualGross)} is just ${pct(effectiveTaxRate)}, meaning you retain the vast majority of every dollar earned.`;
  }
  if (amount <= 25000) {
    return `A monthly salary of ${fmt(amount)} situates you among Singapore's top three to four percent of income recipients, commanding ${ratio.toFixed(1)} times what the median worker earns. The mathematics of your pay: gross of ${fmt(amount)} minus ${fmt(result.monthlyEmployeeCPF)} CPF (ceiling-capped) minus ${fmt(result.monthlyTax)} tax equals ${fmt(result.monthlyTakeHome)} liquid monthly income. Each hour of your working time produces ${fmtDec(hourlyNet)} in after-tax value; each day generates ${fmtDec(dailyNet)}. Because the CPF ceiling of ${fmt(OW_CEILING_MONTHLY)} is far below your salary, ${fmt(amount - OW_CEILING_MONTHLY)} per month — the majority of your earnings — carries zero CPF deduction. The annual trajectory: ${fmt(annualGross)} gross converts to ${fmt(result.annualNetIncome)} cash at an effective ${pct(effectiveTaxRate)} tax burden. Your full employer cost per annum is ${fmt(result.annualEmployerCost)}.`;
  }
  // 30000
  return `Commanding ${fmt(amount)} in monthly gross compensation places you at the pinnacle of Singapore employment income — ${ratio.toFixed(1)} times the national median and firmly within the top two percent. After ceiling-capped CPF of ${fmt(result.monthlyEmployeeCPF)} and income tax of ${fmt(result.monthlyTax)}, you receive ${fmt(result.monthlyTakeHome)} per month in cash. The hourly value of your time: ${fmtDec(hourlyNet)} net, or ${fmtDec(dailyNet)} per working day. A remarkable ${fmt(amount - OW_CEILING_MONTHLY)} of each monthly pay packet sits above the CPF ceiling, avoiding any mandatory savings deduction. Over the year, ${fmt(annualGross)} in gross becomes ${fmt(result.annualNetIncome)} in disposable income — with Singapore's ${pct(effectiveTaxRate)} effective rate preserving the lion's share of your earnings in a manner unmatched by comparable global financial centres.`;
}

// ─── getCareerDescription ───────────────────────────────────────────────────────
export function getCareerDescription(amount: number): string {
  const career = CAREERS[amount];
  if (!career) return '';

  const rolesText = career.roles.join(', ').replace(/, ([^,]*)$/, ', and $1');
  const industryText = career.industries.join(', ').replace(/, ([^,]*)$/, ', and $1');

  // Each salary level gets a completely different sentence structure
  const paragraphs: Record<number, string> = {
    3000: `Workers earning ${fmt(amount)} in Singapore are predominantly ${career.experience}. The roles at this income band include ${rolesText}. These positions exist across ${industryText} sectors. ${career.context}`,
    4000: `The ${fmt(amount)} salary point in Singapore captures ${career.experience}. Typical job titles include ${rolesText}, spread across sectors such as ${industryText}. ${career.context}`,
    5000: `Singapore professionals at the ${fmt(amount)} monthly mark tend to be ${career.experience}. Representative roles span ${rolesText}, operating within ${industryText}. ${career.context}`,
    6000: `Individuals commanding ${fmt(amount)} per month in Singapore are typically ${career.experience}. Roles at this level include ${rolesText} across ${industryText}. ${career.context}`,
    7000: `The market positions ${career.experience} at around ${fmt(amount)} monthly in Singapore. Common titles include ${rolesText}. Key industry verticals are ${industryText}. ${career.context}`,
    8000: `At ${fmt(amount)} monthly compensation, Singapore employers recruit ${career.experience}. Representative positions include ${rolesText}. Industry sectors where this salary prevails include ${industryText}. ${career.context}`,
    10000: `The ${fmt(amount)} per month bracket in Singapore attracts ${career.experience}. Positions at this tier include ${rolesText}, predominantly found in ${industryText}. ${career.context}`,
    12000: `Professionals earning ${fmt(amount)} in Singapore represent ${career.experience}. Specific roles include ${rolesText}. These opportunities concentrate in ${industryText}. ${career.context}`,
    15000: `At the ${fmt(amount)} monthly threshold, Singapore's labour market rewards ${career.experience}. Characteristic positions include ${rolesText} within ${industryText}. ${career.context}`,
    20000: `The rarefied ${fmt(amount)} salary level in Singapore is reserved for ${career.experience}. Titles at this compensation include ${rolesText}. Dominant sectors are ${industryText}. ${career.context}`,
    25000: `Reaching ${fmt(amount)} monthly in Singapore typically requires ${career.experience}. Executive positions at this band include ${rolesText} across ${industryText}. ${career.context}`,
    30000: `The top-tier ${fmt(amount)} monthly salary in Singapore is earned by ${career.experience}. Roles at this apex include ${rolesText}. The sectors commanding this premium are ${industryText}. ${career.context}`,
  };

  return paragraphs[amount] || '';
}

// ─── getTaxTips ─────────────────────────────────────────────────────────────────
export function getTaxTips(amount: number, result: SalaryResult): string {
  const annualGross = amount * 12;
  const chargeableIncome = result.chargeableIncome;
  const currentTax = result.annualTax;

  let marginalRate = 0;
  if (chargeableIncome > 320000) marginalRate = 22;
  else if (chargeableIncome > 280000) marginalRate = 20;
  else if (chargeableIncome > 240000) marginalRate = 19.5;
  else if (chargeableIncome > 200000) marginalRate = 19;
  else if (chargeableIncome > 160000) marginalRate = 18;
  else if (chargeableIncome > 120000) marginalRate = 15;
  else if (chargeableIncome > 80000) marginalRate = 11.5;
  else if (chargeableIncome > 40000) marginalRate = 7;
  else if (chargeableIncome > 30000) marginalRate = 3.5;
  else if (chargeableIncome > 20000) marginalRate = 2;

  const srsMax = 15300;
  const srsSaving = Math.round(srsMax * marginalRate / 100);
  const cpfTopUpMax = 8000;
  const cpfTopUpSaving = Math.round(cpfTopUpMax * marginalRate / 100);
  const donationSample = Math.round(amount * 0.1); // 10% of monthly as annual donation
  const donationRelief = Math.round(donationSample * 2.5);
  const donationTaxSaved = Math.round(donationRelief * marginalRate / 100);
  const combinedSaving = srsSaving + cpfTopUpSaving + donationTaxSaved;
  const optimisedTax = Math.max(0, currentTax - combinedSaving);

  // Completely different advice depending on income band
  if (amount <= 4000) {
    return `With chargeable income of ${fmt(chargeableIncome)} on your ${fmt(amount)} monthly salary, your annual tax bill is only ${fmt(currentTax)} — an effective rate of ${pct(currentTax / annualGross * 100)}. At the ${pct(marginalRate, 0)} marginal bracket, aggressive tax optimisation yields limited returns. The priority at this income level should be maximising your CPF contributions (already happening automatically at ${fmt(result.cpf.totalContribution)} per month combined) and building an emergency fund covering 3 to 6 months of expenses (${fmt(result.monthlyTakeHome * 3)} to ${fmt(result.monthlyTakeHome * 6)}). If you can afford it, a CPF Special Account voluntary top-up of even ${fmt(2000)} per year saves ${fmt(Math.round(2000 * marginalRate / 100))} in tax while earning guaranteed 4% interest — outperforming most bank deposits. Focus on income growth strategies like skills upgrading through SkillsFuture credits rather than tax minimisation at this stage.`;
  }
  if (amount <= 6000) {
    return `Your ${fmt(amount)} monthly salary generates chargeable income of ${fmt(chargeableIncome)} and annual tax of ${fmt(currentTax)}, placing you in the ${pct(marginalRate, 0)} marginal bracket. Two key opportunities exist at this level. First, a voluntary CPF SA top-up of up to ${fmt(cpfTopUpMax)} qualifies for tax relief, saving ${fmt(cpfTopUpSaving)} annually while earning guaranteed 4% interest on the topped-up amount. Second, if your chargeable income approaches the next bracket boundary, the Supplementary Retirement Scheme (SRS) contribution of up to ${fmt(srsMax)} can clip ${fmt(srsSaving)} off your tax bill. Combined, these strategies reduce your annual tax from ${fmt(currentTax)} to approximately ${fmt(optimisedTax)}. Your entire salary falls ${amount <= OW_CEILING_MONTHLY ? 'within' : 'mostly within'} the CPF ceiling, so your full employer-employee CPF of ${fmt(result.cpf.totalContribution)} per month is already maximising your statutory retirement savings. Consider also: parent relief (${fmt(9000)} per dependent parent) and working mother child relief if applicable.`;
  }
  if (amount <= 8000) {
    return `Earning ${fmt(amount)} monthly positions you in the ${pct(marginalRate, 0)} marginal bracket where targeted interventions yield tangible savings. The Supplementary Retirement Scheme stands out: depositing ${fmt(srsMax)} per year directly clips ${fmt(srsSaving)} from your IRAS assessment, and SRS funds can be allocated across unit trusts, Singapore savings bonds, or fixed deposits — compounding without tax drag until drawdown at statutory retirement age. Adding a voluntary CPF SA top-up of ${fmt(cpfTopUpMax)} captures another ${fmt(cpfTopUpSaving)} in relief while principal earns guaranteed 4% interest annually. With ${fmt(amount - OW_CEILING_MONTHLY)} of monthly salary above the CPF ceiling, that ${fmt((amount - OW_CEILING_MONTHLY) * 12)} annually receives no automatic CPF tax shield — voluntary contributions plug this gap. Approved IPC donations of ${fmt(donationSample)} produce ${fmt(donationRelief)} in deductions via the 250% multiplier, worth ${fmt(donationTaxSaved)} in tax reduction. Aggregate optimisation: annual tax moves from ${fmt(currentTax)} toward approximately ${fmt(optimisedTax)}, recapturing ${fmt(combinedSaving)} for your investment portfolio or discretionary spending.`;
  }
  if (amount <= 10000) {
    return `At ${fmt(amount)} monthly gross (${fmt(annualGross)} per annum), the ${pct(marginalRate, 0)} marginal bracket unlocks substantial tax efficiency opportunities. First priority: the SRS vehicle — depositing the maximum ${fmt(srsMax)} annually shaves ${fmt(srsSaving)} off your obligation, and these funds can be deployed into globally diversified ETFs through operators like Endowus or Saxo Capital Markets, compounding without tax incidence until statutory age withdrawal. Second: voluntary CPF Special Account top-ups of ${fmt(cpfTopUpMax)} generate ${fmt(cpfTopUpSaving)} in savings while principal earns the guaranteed 4% SA rate — outperforming most fixed income alternatives on a risk-adjusted basis. Third: structuring charitable commitments of ${fmt(donationSample)} annually to IPC-approved organisations translates to ${fmt(donationRelief)} in deductions via the 250% multiplier, saving ${fmt(donationTaxSaved)}. The above-ceiling income gap is notable — ${fmt(amount - OW_CEILING_MONTHLY)} monthly (${fmt((amount - OW_CEILING_MONTHLY) * 12)} annually) carries no CPF relief, creating exposure that only voluntary schemes address. Total optimised outcome: ${fmt(combinedSaving)} annual saving, moving effective tax from ${fmt(currentTax)} closer to ${fmt(optimisedTax)}.`;
  }
  if (amount <= 15000) {
    return `Your ${pct(marginalRate, 0)} marginal bracket on a ${fmt(amount)} salary makes every tax deduction worth ${Math.round(marginalRate)} cents on the dollar. Three core strategies: SRS contribution of ${fmt(srsMax)} saves ${fmt(srsSaving)}; CPF SA top-up of ${fmt(cpfTopUpMax)} saves ${fmt(cpfTopUpSaving)}; charitable donations of ${fmt(donationSample)} (generating ${fmt(donationRelief)} deduction at 250%) saves ${fmt(donationTaxSaved)}. Together, these reduce annual tax from ${fmt(currentTax)} to roughly ${fmt(optimisedTax)}. With ${fmt(amount - OW_CEILING_MONTHLY)} monthly above the CPF ceiling, proactive planning is essential — that ${fmt((amount - OW_CEILING_MONTHLY) * 12)} annual income receives zero CPF tax shield. Additionally, consider timing bonus payments relative to the Annual Wage ceiling of ${fmt(102000)} to maximise CPF on variable pay. If you have dependent parents aged 55 or above living with you, parent relief adds ${fmt(9000)} per qualifying parent. NSman relief provides ${fmt(3000)} if you have fulfilled NS obligations during the year.`;
  }
  if (amount <= 20000) {
    return `Your ${fmt(amount)} salary places you in the ${pct(marginalRate, 0)} marginal bracket, where each dollar of tax deduction returns ${Math.round(marginalRate)} cents. Priority one: the SRS contribution limit of ${fmt(srsMax)} yields ${fmt(srsSaving)} in direct tax savings — funds that can then be invested in ETFs, bonds, or structured deposits within the SRS account, growing tax-free until drawdown at age 62. Priority two: CPF SA voluntary top-up of ${fmt(cpfTopUpMax)} delivers ${fmt(cpfTopUpSaving)} tax saving plus 4% guaranteed growth on the principal. Priority three: structured donations of ${fmt(donationSample)} annually to approved IPCs create ${fmt(donationRelief)} in deductions (at the 250% multiplier), reducing tax by ${fmt(donationTaxSaved)}. Combined annual tax reduction: from ${fmt(currentTax)} to approximately ${fmt(optimisedTax)} — a saving of ${fmt(combinedSaving)}. Executive-specific considerations at ${fmt(amount)}: timing of variable bonuses relative to the Annual Wage CPF ceiling of ${fmt(102000)} can affect CPF contributions on bonus; parent relief at ${fmt(9000)} per qualifying dependent is available if elderly parents live with you; and for those with equity compensation, managing vesting schedules across calendar years can smooth bracket exposure. The ${fmt((amount - OW_CEILING_MONTHLY) * 12)} annual income above the CPF ceiling has no automatic tax shelter — SRS and voluntary CPF top-ups become essential to protect this exposed income.`;
  }
  if (amount <= 25000) {
    return `Earning ${fmt(amount)} monthly puts your marginal dollar in the ${pct(marginalRate, 0)} bracket. The tax efficiency playbook: maximize SRS at ${fmt(srsMax)} for ${fmt(srsSaving)} annual tax reduction (invest within SRS via Endowus, Saxo, or PhillipCapital for long-term compounding). Execute CPF SA top-up of ${fmt(cpfTopUpMax)} — saving ${fmt(cpfTopUpSaving)} while the 4% SA interest outperforms risk-free alternatives. Deploy ${fmt(donationSample)} in strategic charitable giving to IPCs, generating ${fmt(donationRelief)} in 250%-multiplied deductions worth ${fmt(donationTaxSaved)} in saved tax. Net result: annual liability drops from ${fmt(currentTax)} toward ${fmt(optimisedTax)}, recapturing ${fmt(combinedSaving)} for reinvestment. At the ${fmt(amount)} level, also consider: contributing to your spouse's CPF SA (additional ${fmt(8000)} deduction if eligible), claiming course fee relief for executive education (MBA, professional certifications) up to ${fmt(5500)}, and structuring philanthropic commitments through a Donor Advised Fund for multi-year deduction smoothing. With ${fmt((amount - OW_CEILING_MONTHLY) * 12)} sitting above the CPF ceiling annually, the tax gap between your statutory and effective rates can only be narrowed through deliberate use of every available relief channel.`;
  }
  // 30000
  return `At ${fmt(amount)} per month with a ${pct(marginalRate, 0)} marginal rate, every tax optimization dollar is highly leveraged. The foundations: SRS at ${fmt(srsMax)} saves ${fmt(srsSaving)}; SA top-up at ${fmt(cpfTopUpMax)} saves ${fmt(cpfTopUpSaving)}; strategic IPC donations of ${fmt(donationSample)} (generating ${fmt(donationRelief)} deduction at 250%) saves ${fmt(donationTaxSaved)}. Annual tax moves from ${fmt(currentTax)} toward ${fmt(optimisedTax)} — a ${fmt(combinedSaving)} recapture. Advanced strategies at this compensation tier: if your package includes equity vesting, consider accelerating or deferring vesting events across Year of Assessment boundaries to manage the ${pct(marginalRate, 0)} bracket threshold; explore whether your employer can structure a portion of compensation as employer CPF voluntary contribution (VC), which provides tax relief without hitting the SRS cap; investigate setting up a Singapore Variable Capital Company (VCC) for pooled investment management if investable assets exceed ${fmt(2000000)}. Life insurance structured as an investment-linked policy (ILP) through an irrevocable trust can also provide estate planning benefits while the premiums generate no additional tax burden. Your ${fmt((amount - OW_CEILING_MONTHLY) * 12)} annual above-ceiling income represents the primary exposure — without intervention, it faces the full ${pct(marginalRate, 0)} marginal rate on every incremental dollar.`;
}

// ─── buildFaqs ──────────────────────────────────────────────────────────────────
export function buildFaqs(amount: number, result: SalaryResult): { question: string; answer: string }[] {
  const annualGross = amount * 12;
  const dailyRate = result.monthlyTakeHome / WORKING_DAYS_PER_MONTH;
  const hourlyRate = dailyRate / WORKING_HOURS_PER_DAY;
  const cpfTotal = result.cpf.totalContribution;

  const raisedAmount = amount * 1.05;
  const raisedResult = calculateSalary({ monthlyGross: raisedAmount, age: 30, residencyType: 'citizen', annualBonus: 0 });
  const raiseNetDiff = raisedResult.monthlyTakeHome - result.monthlyTakeHome;

  const awsResult = calculateSalary({ monthlyGross: amount, age: 30, residencyType: 'citizen', annualBonus: amount });

  // PR comparison
  const prResult = calculateSalary({ monthlyGross: amount, age: 30, residencyType: 'pr_2nd_year', annualBonus: 0 });

  // Age 58 comparison
  const olderResult = calculateSalary({ monthlyGross: amount, age: 58, residencyType: 'citizen', annualBonus: 0 });

  return [
    {
      question: `What is the exact monthly take-home on a ${fmt(amount)} salary in Singapore?`,
      answer: `A Singapore Citizen aged 55 and below earning ${fmt(amount)} gross per month takes home ${fmt(result.monthlyTakeHome)} after deductions. The breakdown: ${fmt(result.monthlyEmployeeCPF)} goes to CPF (employee contribution at ${result.cpfRate ? result.cpfRate.employee : 0}% of ${amount > OW_CEILING_MONTHLY ? 'the capped ' + fmt(OW_CEILING_MONTHLY) : 'gross'}), and ${fmt(result.monthlyTax)} covers monthly income tax. The annual net income is ${fmt(result.annualNetIncome)} from ${fmt(annualGross)} gross.`,
    },
    {
      question: `How is CPF allocated on a ${fmt(amount)} salary across OA, SA, and MA?`,
      answer: `On ${fmt(amount)} monthly, total CPF is ${fmt(cpfTotal)} (employee ${fmt(result.cpf.employeeContribution)} plus employer ${fmt(result.cpf.employerContribution)}). This splits into: Ordinary Account ${fmt(result.cpf.oa)} per month (for housing, education, investment), Special Account ${fmt(result.cpf.sa)} (retirement savings at 4% interest), and MediSave ${fmt(result.cpf.ma)} (healthcare at 4% interest). Annual total CPF accumulation: ${fmt(cpfTotal * 12)}.`,
    },
    {
      question: `What is the daily and hourly rate for ${fmt(amount)} per month?`,
      answer: `Gross daily rate: ${fmtDec(amount / WORKING_DAYS_PER_MONTH)} (${WORKING_DAYS_PER_MONTH} working days). Gross hourly: ${fmtDec(amount / (WORKING_DAYS_PER_MONTH * WORKING_HOURS_PER_DAY))} (${WORKING_HOURS_PER_DAY}-hour days). After CPF and tax, net daily: ${fmtDec(dailyRate)}. Net hourly: ${fmtDec(hourlyRate)}. The difference between gross and net hourly (${fmtDec(amount / (WORKING_DAYS_PER_MONTH * WORKING_HOURS_PER_DAY) - hourlyRate)}) represents your combined deduction rate applied to each hour worked.`,
    },
    {
      question: `How much more take-home does a 5% raise from ${fmt(amount)} give me?`,
      answer: `A 5% raise moves gross from ${fmt(amount)} to ${fmt(Math.round(raisedAmount))}. Net monthly increases by ${fmt(Math.round(raiseNetDiff))} to ${fmt(Math.round(raisedResult.monthlyTakeHome))}. Annual net gain: ${fmt(Math.round(raiseNetDiff * 12))}. The effective raise in take-home is ${pct((raiseNetDiff / result.monthlyTakeHome) * 100)} — slightly ${raiseNetDiff / result.monthlyTakeHome * 100 < 5 ? 'below' : 'above'} 5% due to ${amount < OW_CEILING_MONTHLY ? 'additional CPF on the raised portion and' : ''} progressive tax bracket effects.`,
    },
    {
      question: `What does ${fmt(amount)} salary with a 1-month AWS bonus look like annually?`,
      answer: `Adding a 1-month Annual Wage Supplement (AWS) of ${fmt(amount)} brings annual gross to ${fmt(annualGross + amount)}. The AWS attracts CPF: ${fmt(awsResult.cpf.bonusEmployeeContribution)} employee and ${fmt(awsResult.cpf.bonusEmployerContribution)} employer share. Annual take-home with AWS: ${fmt(awsResult.annualNetIncome)} versus ${fmt(result.annualNetIncome)} without — a net boost of ${fmt(awsResult.annualNetIncome - result.annualNetIncome)} from the ${fmt(amount)} bonus.`,
    },
    {
      question: `How does a ${fmt(amount)} salary differ for a 2nd-year PR versus a Citizen?`,
      answer: `A 2nd-year PR earning ${fmt(amount)} takes home ${fmt(prResult.monthlyTakeHome)} per month — ${fmt(prResult.monthlyTakeHome - result.monthlyTakeHome)} ${prResult.monthlyTakeHome > result.monthlyTakeHome ? 'more' : 'less'} than a Citizen's ${fmt(result.monthlyTakeHome)}. The PR's employee CPF is ${fmt(prResult.monthlyEmployeeCPF)} (at 15% versus 20% for Citizens), and employer CPF is ${fmt(prResult.cpf.employerContribution)} (at 9% versus 17%). Total CPF accumulation for the PR is lower at ${fmt(prResult.cpf.totalContribution)} versus ${fmt(cpfTotal)} for Citizens.`,
    },
  ];
}

// ─── getRaiseSimulation ─────────────────────────────────────────────────────────
export function getRaiseSimulation(amount: number, result: SalaryResult): string {
  const raises = [5, 10, 15, 20, 30];

  let rows: string[] = [];
  for (const raisePercent of raises) {
    const newGross = Math.round(amount * (1 + raisePercent / 100));
    const newResult = calculateSalary({ monthlyGross: newGross, age: 30, residencyType: 'citizen', annualBonus: 0 });
    const netDiff = newResult.monthlyTakeHome - result.monthlyTakeHome;
    const effectiveRaise = (netDiff / result.monthlyTakeHome) * 100;
    rows.push(`${raisePercent}% raise to ${fmt(newGross)} gross yields ${fmt(Math.round(newResult.monthlyTakeHome))} take-home (+${fmt(Math.round(netDiff))}/month, +${fmt(Math.round(netDiff * 12))}/year, effective gain ${pct(effectiveRaise)}).`);
  }

  // 3-year projection
  let projGross = amount;
  let projections: string[] = [];
  for (let year = 1; year <= 3; year++) {
    projGross = Math.round(projGross * 1.05);
    const projResult = calculateSalary({ monthlyGross: projGross, age: 30, residencyType: 'citizen', annualBonus: 0 });
    const cumGain = projResult.monthlyTakeHome - result.monthlyTakeHome;
    projections.push(`Year ${year}: ${fmt(projGross)} gross producing ${fmt(Math.round(projResult.monthlyTakeHome))} take-home, a cumulative gain of ${fmt(Math.round(cumGain))} over your current net`);
  }

  // Different intro per salary band
  let intro: string;
  if (amount <= 4000) {
    intro = `Salary growth matters most at the ${fmt(amount)} level where each raise directly improves quality of life. Here is how different percentage increases would change your actual spending money:`;
  } else if (amount <= 6000) {
    intro = `Negotiating a raise from ${fmt(amount)} requires understanding the net impact after Singapore's tax and CPF system takes its share. The numbers below show what each raise percentage actually delivers to your bank account:`;
  } else if (amount <= 8000) {
    intro = `With your ${fmt(amount)} salary straddling the CPF wage ceiling, raises have an interesting dynamic — portions above ${fmt(OW_CEILING_MONTHLY)} avoid CPF entirely. Here is the projected cash impact of various increases:`;
  } else if (amount <= 12000) {
    intro = `At ${fmt(amount)}, your salary is well above the CPF ceiling, meaning every additional dollar of raise flows to cash minus only the marginal tax rate of your bracket. The conversion from gross raise to net gain is highly efficient:`;
  } else if (amount <= 15000) {
    intro = `Senior professionals at ${fmt(amount)} typically negotiate raises as part of a total compensation review including base, bonus, and equity. For the base component alone, here is the net impact at current tax and CPF rates:`;
  } else if (amount <= 20000) {
    intro = `At the ${fmt(amount)} executive level, salary increases face the full marginal tax rate but no additional CPF. The net conversion rate is approximately ${pct(100 - (result.annualTax / (amount * 12) * 100 + 2), 0)} of each gross dollar. Detailed projections:`;
  } else if (amount <= 25000) {
    intro = `Compensation reviews at the ${fmt(amount)} tier often focus on total package (base, bonus, LTIP). For base salary adjustments specifically, the post-tax impact of various increments from your current level:`;
  } else {
    intro = `At ${fmt(amount)} monthly, raises of even modest percentages translate to substantial absolute gains in take-home given the high base. The tax-efficiency of each additional dollar remains strong in Singapore. Modelled outcomes:`;
  }

  return `${intro} ${rows.join(' ')} Assuming consistent 5% annual increments from ${fmt(amount)}: ${projections.join('. ')}.`;
}

// ─── getBudgetBreakdown ─────────────────────────────────────────────────────────
export function getBudgetBreakdown(netMonthly: number, amount: number): string {
  const housing = Math.round(netMonthly * 0.30);
  const food = Math.round(netMonthly * 0.15);
  const transport = Math.min(Math.round(netMonthly * 0.08), 1500);
  const utilities = Math.round(Math.min(netMonthly * 0.04, 400));
  const insurance = Math.round(Math.min(netMonthly * 0.05, 800));
  const savings = Math.round(netMonthly * 0.20);
  const discretionary = Math.round(netMonthly - housing - food - transport - utilities - insurance - savings);

  // Unique housing/food/transport descriptions per bracket
  let housingDesc: string, foodDesc: string, transportDesc: string, lifestyleNote: string;

  if (netMonthly < 2500) {
    housingDesc = `a rented room in an HDB flat in estates such as Woodlands, Sembawang, or Pasir Ris — areas offering lower rents of ${fmt(housing)} while maintaining MRT connectivity`;
    foodDesc = `daily hawker centre meals averaging four to five dollars each, supplemented by home-cooked dinners using groceries from NTUC FairPrice or Sheng Siong`;
    transportDesc = `an adult monthly travel pass at around one hundred and twenty-eight dollars covering unlimited MRT and bus rides`;
    lifestyleNote = `At this budget, entertainment centres on free community activities, public libraries, and neighbourhood parks. Building an emergency fund of ${fmt(netMonthly * 3)} (three months of expenses) should be the first financial priority.`;
  } else if (netMonthly < 4000) {
    housingDesc = `sharing a two-bedroom HDB flat with one flatmate, or renting a common room in a condo near an MRT interchange like Bishan, Clementi, or Tampines — budgeting ${fmt(housing)} for rent`;
    foodDesc = `a blend of hawker lunches at five to six dollars, occasional restaurant dinners at twenty to thirty dollars, and weekend grocery cooking`;
    transportDesc = `public transit as the primary mode with a budget of ${fmt(transport)} covering an EZ-Link card and occasional Grab rides for late-night commutes`;
    lifestyleNote = `This budget supports a social life including occasional movies at Golden Village, drinks at neighbourhood bars, and one domestic getaway per quarter. Aim to save ${fmt(savings)} monthly toward goals like a BTO flat down payment or investment portfolio.`;
  } else if (netMonthly < 6000) {
    housingDesc = `renting an entire three-room HDB flat (around ${fmt(housing)}) in city-fringe locations like Queenstown, Kallang, or Geylang — offering space and reasonable commutes`;
    foodDesc = `regular restaurant meals three to four times weekly, mixed with hawker favourites, coffee at specialty cafes, and the occasional izakaya or dim sum weekend brunch`;
    transportDesc = `a combination of MRT commuting and Grab bookings totalling ${fmt(transport)}, with the flexibility to take ride-hailing for meetings or evening plans`;
    lifestyleNote = `Your discretionary budget of ${fmt(discretionary)} supports gym memberships at Fitness First or Anytime Fitness (${fmt(100)} to ${fmt(200)}/month), streaming subscriptions, dining with friends, and one overseas holiday every three to four months within the region.`;
  } else if (netMonthly < 9000) {
    housingDesc = `a studio or one-bedroom condominium in neighbourhoods like Tiong Bahru, Tanjong Pagar, or Katong — allocating ${fmt(housing)} for rent inclusive of facilities like pool and gym`;
    foodDesc = `dining out frequently including mid-range restaurants averaging thirty to fifty dollars per meal, specialty coffee daily, and premium grocery stores like Cold Storage or MarketPlace`;
    transportDesc = `daily Grab rides or car-sharing memberships totalling ${fmt(transport)}, avoiding the major expense of car ownership while maintaining convenience`;
    lifestyleNote = `The remaining ${fmt(discretionary)} for discretionary use covers annual memberships, regular travel (three to four regional trips per year), electronics upgrades, and meaningful progress on investment goals — potentially directing ${fmt(savings)} monthly into a diversified ETF portfolio.`;
  } else if (netMonthly < 14000) {
    housingDesc = `a spacious one or two-bedroom condominium in desirable districts like River Valley, Holland Village, or East Coast — budgeting ${fmt(housing)} for a well-appointed unit with sea or city views`;
    foodDesc = `a premium food lifestyle: regular omakase dinners, weekend brunches at hotels like Mandarin Oriental or Fullerton, daily specialty coffee, and grocery deliveries from Redmart or Amazon Fresh`;
    transportDesc = `either a leased vehicle (inclusive of COE, insurance, and maintenance at ${fmt(transport)}) or premium ride-hailing on demand with Grab Premium or corporate accounts`;
    lifestyleNote = `With ${fmt(discretionary)} in discretionary funds, your lifestyle includes country club or gym memberships (like Pure Fitness at ${fmt(300)}/month), quarterly international travel in premium economy or business class, and the capacity to invest ${fmt(savings)} monthly in a wealth management portfolio targeting long-term capital growth.`;
  } else if (netMonthly < 18000) {
    housingDesc = `a luxury two-bedroom condominium in prime District 9 or 10 (Orchard Road, Robertson Quay, or River Valley) — commanding ${fmt(housing)} monthly for premium finishes, rooftop pools, and concierge services`;
    foodDesc = `an elevated dining lifestyle spanning omakase at Hashida Sushi (${fmt(250)} to ${fmt(400)} per visit), weekend champagne brunches at Raffles Hotel, weekday lunches at club lounges, and premium grocery home delivery from Ryan's Grocery or Little Farms`;
    transportDesc = `car ownership via a COE-inclusive lease arrangement or outright purchase, with total monthly costs of ${fmt(transport)} covering loan repayments, insurance, road tax, fuel, ERP charges, and seasonal parking at your condominium`;
    lifestyleNote = `With ${fmt(discretionary)} remaining for discretionary spending, this income supports memberships at clubs like the American Club or Tanglin Club (${fmt(300)} to ${fmt(500)}/month), quarterly international travel in business class, premium health screening packages at Raffles Medical, and deploying ${fmt(savings)} monthly into a diversified portfolio managed through platforms like Endowus, StashAway, or a private bank relationship.`;
  } else if (netMonthly < 22000) {
    housingDesc = `a premium three-bedroom condominium or penthouse unit in sought-after developments along Orchard Boulevard, Nassim Road, or Sentosa Cove — allocating ${fmt(housing)} for residences featuring private lifts, marble finishes, and panoramic city views`;
    foodDesc = `unrestricted access to Singapore's finest dining including Michelin-starred establishments like Odette (${fmt(400)}+ per person), Zen (${fmt(500)}+), members-only dining at Tower Club, plus a dedicated budget for wine collecting and premium spirits`;
    transportDesc = `ownership of a luxury vehicle (Mercedes, BMW, or Porsche) with total monthly costs of ${fmt(transport)} including COE depreciation at approximately two thousand dollars per month, comprehensive insurance, and reserved parking at premium locations`;
    lifestyleNote = `The remaining ${fmt(discretionary)} funds a lifestyle including Singapore Island Country Club or Sentosa Golf Club membership (initiation fees of ${fmt(200000)} to ${fmt(400000)}), first-class international travel multiple times annually, art collecting, and channelling ${fmt(savings)} per month through a private banking relationship at UBS, Credit Suisse, or DBS Private Banking for diversified global wealth accumulation.`;
  } else {
    housingDesc = `a Good Class Bungalow (GCB) district rental or ultra-luxury penthouse in developments like Wallich Residence or Marina One — at ${fmt(housing)} monthly for Singapore's most exclusive residential addresses offering complete privacy and prestige`;
    foodDesc = `a bespoke culinary lifestyle featuring private chef arrangements, exclusive access to Japanese omakase counters like Shoukouwa and Sushi Kimura, wine dinners with Grand Cru selections, and corporate entertainment at venues like CUT by Wolfgang Puck or Burnt Ends`;
    transportDesc = `a luxury or supercar stable (total holding cost ${fmt(transport)}/month across depreciation, insurance, and maintenance) or dedicated chauffeur service through a personal driver arrangement, eliminating all transport friction`;
    lifestyleNote = `With ${fmt(discretionary)} in discretionary capital, this tier enables philanthropy through established family foundations, angel investments in Series A and B ventures (typical tickets of ${fmt(50000)} to ${fmt(200000)}), legacy planning via family offices, and directing ${fmt(savings)} monthly into institutional-grade investment vehicles spanning global equities, real estate, and alternative assets managed by multi-family office structures.`;
  }

  // Vary the connective structure per income band
  if (amount <= 4000) {
    return `On a net income of ${fmt(netMonthly)} each month after CPF and tax deductions, here is how the money can be allocated in Singapore. The biggest expense is accommodation at ${fmt(housing)}: ${housingDesc}. Nourishment costs around ${fmt(food)} for ${foodDesc}. Getting around Singapore at ${fmt(transport)} covers ${transportDesc}. Monthly bills for power, water, and phone service total approximately ${fmt(utilities)}, with protection coverage (health and term life) at ${fmt(insurance)}. Setting aside ${fmt(savings)} each month (${pct(savings / netMonthly * 100, 0)} of net pay) builds ${fmt(savings * 12)} annually in accessible savings outside CPF. ${lifestyleNote}`;
  }
  if (amount <= 7000) {
    return `With ${fmt(netMonthly)} hitting your account monthly in Singapore, distributing expenses wisely looks like this. Shelter consumes ${fmt(housing)} for ${housingDesc}. Eating well at ${fmt(food)} per month means ${foodDesc}. Mobility at ${fmt(transport)} affords ${transportDesc}. Household utilities plus telecommunications run ${fmt(utilities)}, and health and life coverage costs ${fmt(insurance)} monthly. A disciplined savings target of ${fmt(savings)} per month (${pct(savings / netMonthly * 100, 0)} of disposable pay) generates ${fmt(savings * 12)} in annual liquid capital separate from CPF balances. ${lifestyleNote}`;
  }
  if (amount <= 12000) {
    return `Singapore living on ${fmt(netMonthly)} monthly take-home distributes across these categories. Accommodation: ${fmt(housing)} for ${housingDesc}. Dining and groceries: ${fmt(food)} covering ${foodDesc}. Transportation: ${fmt(transport)} supporting ${transportDesc}. Utility bills and connectivity: approximately ${fmt(utilities)}. Insurance premiums: ${fmt(insurance)} for comprehensive health and income protection. Wealth building: targeting ${fmt(savings)} monthly (${pct(savings / netMonthly * 100, 0)} of after-tax income) accumulates ${fmt(savings * 12)} per year in investable liquid capital beyond CPF accounts. ${lifestyleNote}`;
  }
  if (amount <= 20000) {
    return `Managing ${fmt(netMonthly)} in monthly after-deduction income in Singapore enables a structured allocation approach. Premium housing at ${fmt(housing)} secures ${housingDesc}. The culinary budget of ${fmt(food)} sustains ${foodDesc}. Transportation expenditure of ${fmt(transport)} provides ${transportDesc}. Running costs for utilities and digital services total ${fmt(utilities)}, while comprehensive insurance at ${fmt(insurance)} covers critical illness, hospitalisation, and income protection. Directing ${fmt(savings)} monthly toward wealth accumulation (${pct(savings / netMonthly * 100, 0)} of liquid income) builds ${fmt(savings * 12)} annually in investment-ready capital beyond mandatory CPF savings. ${lifestyleNote}`;
  }
  return `Deploying ${fmt(netMonthly)} in monthly net compensation across Singapore's premium cost structure. Residence: ${fmt(housing)} securing ${housingDesc}. Gastronomy: ${fmt(food)} enabling ${foodDesc}. Mobility: ${fmt(transport)} for ${transportDesc}. Infrastructure (utilities, connectivity): ${fmt(utilities)}. Risk management (insurance): ${fmt(insurance)} for comprehensive coverage including private medical, critical illness, and key-person policies. Capital allocation: ${fmt(savings)} monthly (${pct(savings / netMonthly * 100, 0)} of net) yields ${fmt(savings * 12)} per year in deployable investment capital above and beyond CPF accumulation. ${lifestyleNote}`;
}

// ─── getUniqueComparisons ───────────────────────────────────────────────────────
export function getUniqueComparisons(amount: number, result: SalaryResult): string {
  const salaryLevels = [3000, 4000, 5000, 6000, 7000, 8000, 10000, 12000, 15000, 20000, 25000, 30000];
  const idx = salaryLevels.indexOf(amount);

  const parts: string[] = [];

  // Median comparison — unique phrasing per band
  const medianResult = calculateSalary({ monthlyGross: SG_MEDIAN_GROSS, age: 30, residencyType: 'citizen', annualBonus: 0 });
  const diffFromMedian = result.monthlyTakeHome - medianResult.monthlyTakeHome;

  if (amount < SG_MEDIAN_GROSS) {
    parts.push(`To reach the Singapore median take-home of ${fmt(medianResult.monthlyTakeHome)} (from a ${fmt(SG_MEDIAN_GROSS)} gross), you would need an additional ${fmt(Math.abs(diffFromMedian))} per month in net income. That gap of ${fmt(Math.abs(diffFromMedian) * 12)} annually represents the distance between your current ${fmt(amount)} salary and median-level compensation.`);
  } else if (amount <= SG_MEDIAN_GROSS * 1.1) {
    parts.push(`Your take-home of ${fmt(result.monthlyTakeHome)} closely tracks the Singapore median (${fmt(medianResult.monthlyTakeHome)} from ${fmt(SG_MEDIAN_GROSS)} gross). You earn within ${fmt(Math.abs(diffFromMedian))} per month of the typical full-time resident worker.`);
  } else {
    parts.push(`Your monthly take-home of ${fmt(result.monthlyTakeHome)} exceeds the median worker's ${fmt(medianResult.monthlyTakeHome)} (on ${fmt(SG_MEDIAN_GROSS)} gross) by ${fmt(diffFromMedian)} per month — that is ${fmt(diffFromMedian * 12)} more in annual spending power compared to the median Singaporean professional.`);
  }

  // Step-up comparison (unique per page)
  if (idx > 0) {
    const lower = salaryLevels[idx - 1];
    const lowerResult = calculateSalary({ monthlyGross: lower, age: 30, residencyType: 'citizen', annualBonus: 0 });
    const diff = result.monthlyTakeHome - lowerResult.monthlyTakeHome;
    const grossDiff = amount - lower;
    const efficiency = (diff / grossDiff) * 100;
    parts.push(`The jump from ${fmt(lower)} to your ${fmt(amount)} salary represents a ${fmt(grossDiff)} gross increase. Of that extra ${fmt(grossDiff)}, you retain ${fmt(Math.round(diff))} as net income — a marginal retention rate of ${pct(efficiency)}. This means ${pct(100 - efficiency)} of the raise was absorbed by CPF and tax, leaving you with ${Math.round(efficiency)} cents of actual spending power per extra gross dollar.`);
  }

  // Step-up to next level
  if (idx < salaryLevels.length - 1 && idx >= 0) {
    const higher = salaryLevels[idx + 1];
    const higherResult = calculateSalary({ monthlyGross: higher, age: 30, residencyType: 'citizen', annualBonus: 0 });
    const diff = higherResult.monthlyTakeHome - result.monthlyTakeHome;
    const grossNeeded = higher - amount;
    parts.push(`Reaching the next salary level of ${fmt(higher)} requires a ${fmt(grossNeeded)} gross increase (${pct(grossNeeded / amount * 100, 0)} raise). This would add ${fmt(Math.round(diff))} to monthly take-home (from ${fmt(result.monthlyTakeHome)} to ${fmt(higherResult.monthlyTakeHome)}), translating to ${fmt(Math.round(diff * 12))} more per year in liquid income.`);
  }

  // Global comparison unique to this amount
  const effectiveRate = (result.annualTax / (amount * 12)) * 100;
  const londonEquiv = Math.round(amount * 12 * (1 - 0.30)); // ~30% effective in London at mid levels
  const sgNet = result.annualNetIncome;
  parts.push(`Global context: at ${fmt(amount)} per month, Singapore's effective tax rate of ${pct(effectiveRate)} means you keep ${fmt(sgNet)} annually. The same gross in London (applying approximately 30% combined tax and NI) would leave only ${fmt(londonEquiv)} — meaning Singapore saves you ${fmt(sgNet - londonEquiv)} per year. In Sydney (approximately 27% effective), you'd keep roughly ${fmt(Math.round(amount * 12 * 0.73))}, still ${fmt(sgNet - Math.round(amount * 12 * 0.73))} less than Singapore.`);

  return parts.join(' ');
}

// ─── getCPFDeepDive ─────────────────────────────────────────────────────────────
export function getCPFDeepDive(amount: number, result: SalaryResult): string {
  const cpf = result.cpf;
  const totalMonthly = cpf.totalContribution;

  // Projections with compound interest
  const oaRate = 0.025, saRate = 0.04, maRate = 0.04;
  let oa5 = 0, sa5 = 0, ma5 = 0, oa10 = 0, sa10 = 0, ma10 = 0;
  for (let y = 1; y <= 10; y++) {
    oa10 = (oa10 + cpf.oa * 12) * (1 + oaRate);
    sa10 = (sa10 + cpf.sa * 12) * (1 + saRate);
    ma10 = (ma10 + cpf.ma * 12) * (1 + maRate);
    if (y === 5) { oa5 = oa10; sa5 = sa10; ma5 = ma10; }
  }
  const total5 = Math.round(oa5 + sa5 + ma5);
  const total10 = Math.round(oa10 + sa10 + ma10);
  const oaAnnual = cpf.oa * 12;
  const saAnnual = cpf.sa * 12;
  const maAnnual = cpf.ma * 12;

  // HDB context for OA usage
  const hdbLoanMax = Math.min(oaAnnual * 4, 500000); // rough approximation
  const bto4roomPrice = 350000; // typical BTO 4-room
  const monthsToDownPayment = Math.ceil(bto4roomPrice * 0.1 / cpf.oa); // 10% down from OA

  // Unique paragraph structure per salary band
  if (amount <= 4000) {
    return `On your ${fmt(amount)} monthly salary, the CPF system channels ${fmt(totalMonthly)} each month into three distinct accounts. Your Ordinary Account (OA) receives ${fmt(cpf.oa)} monthly, accumulating ${fmt(oaAnnual)} per year at 2.5% interest — this is your housing fund, and at this contribution rate, you would build a ${fmt(bto4roomPrice * 0.10)} BTO down payment (10% of a typical four-room flat priced at ${fmt(bto4roomPrice)}) in approximately ${monthsToDownPayment} months. The Special Account (SA) gets ${fmt(cpf.sa)} monthly (${fmt(saAnnual)} per year) at 4% guaranteed interest, locked for retirement through CPF LIFE. MediSave receives ${fmt(cpf.ma)} monthly (${fmt(maAnnual)} per year) at 4% interest, covering hospitalisation and MediShield Life premiums. After 5 years at this salary with compounding: approximately ${fmt(total5)} total CPF. After 10 years: approximately ${fmt(total10)}. The combined employee-employer CPF of ${fmt(totalMonthly)} per month represents ${pct(totalMonthly / amount * 100)} of your gross salary flowing to long-term savings.`;
  }
  if (amount <= 7000) {
    return `The CPF breakdown on your ${fmt(amount)} salary allocates ${fmt(totalMonthly)} monthly across three purpose-built accounts. The Ordinary Account receives ${fmt(cpf.oa)} per month — ${fmt(oaAnnual)} annually at 2.5% interest. This OA accumulation is key for housing: at ${fmt(cpf.oa)} monthly, you build sufficient funds for a BTO flat down payment within ${monthsToDownPayment} months, and the ongoing contributions help service an HDB loan. The Special Account receives ${fmt(cpf.sa)} monthly (${fmt(saAnnual)} per year at 4% interest), building your CPF LIFE retirement fund. MediSave gets ${fmt(cpf.ma)} monthly (${fmt(maAnnual)} per year at 4%), funding future healthcare needs. ${amount > OW_CEILING_MONTHLY ? `Note: CPF is calculated on the wage ceiling of ${fmt(OW_CEILING_MONTHLY)}, not your full ${fmt(amount)}. The ${fmt(amount - OW_CEILING_MONTHLY)} above ceiling goes to cash.` : `Your entire ${fmt(amount)} falls within the CPF ceiling, maximising contributions.`} Projected CPF after 5 years: ${fmt(total5)} (OA: ${fmt(Math.round(oa5))}, SA: ${fmt(Math.round(sa5))}, MA: ${fmt(Math.round(ma5))}). After 10 years: ${fmt(total10)}.`;
  }
  if (amount <= 10000) {
    return `Since your ${fmt(amount)} salary exceeds the CPF wage ceiling of ${fmt(OW_CEILING_MONTHLY)}, contributions are capped: ${fmt(cpf.employeeContribution)} employee and ${fmt(cpf.employerContribution)} employer, totalling ${fmt(totalMonthly)} per month. Account allocation: OA receives ${fmt(cpf.oa)} monthly (${fmt(oaAnnual)} per year at 2.5% interest), SA receives ${fmt(cpf.sa)} (${fmt(saAnnual)} per year at 4%), and MA receives ${fmt(cpf.ma)} (${fmt(maAnnual)} per year at 4%). The OA balance supports HDB loan eligibility — lenders factor in your OA accumulation rate when determining affordability. At ${fmt(cpf.oa)} monthly OA contribution, you accumulate a BTO down payment equivalent in approximately ${monthsToDownPayment} months. Five-year CPF projection with interest: ${fmt(total5)} (OA ${fmt(Math.round(oa5))}, SA ${fmt(Math.round(sa5))}, MA ${fmt(Math.round(ma5))}). Ten-year projection: ${fmt(total10)}. Importantly, since CPF is capped at the same amount for all salaries above ${fmt(OW_CEILING_MONTHLY)}, earners at your level may need supplementary retirement vehicles (SRS, personal investments) to maintain lifestyle in retirement.`;
  }
  if (amount <= 12000) {
    const retirementGap = Math.round(result.monthlyTakeHome * 0.6 - total10 / 240);
    return `At ${fmt(amount)} monthly, your CPF situation is defined by the ceiling effect: CPF maxes out at ${fmt(totalMonthly)} per month (${fmt(cpf.employeeContribution)} employee + ${fmt(cpf.employerContribution)} employer) since the wage ceiling of ${fmt(OW_CEILING_MONTHLY)} caps contribution calculations. The three-way split: Ordinary Account gets ${fmt(cpf.oa)} monthly for housing and investment purposes (accumulating ${fmt(oaAnnual)} per year at 2.5% compounding interest). Special Account receives ${fmt(cpf.sa)} monthly reserved for retirement (${fmt(saAnnual)} per year growing at 4%). MediSave collects ${fmt(cpf.ma)} monthly for healthcare security (${fmt(maAnnual)} per year at 4%). Five-year projection at your current contributions: ${fmt(total5)} total across all accounts. Decade projection: ${fmt(total10)}. For housing decisions: your OA accumulation of ${fmt(oaAnnual)} per year supports an HDB loan service capacity of approximately ${fmt(Math.round(oaAnnual / 12 * 0.3))} per month toward mortgage installments. The retirement planning gap is notable — to replace 60% of take-home (${fmt(Math.round(result.monthlyTakeHome * 0.6))}/month) in retirement, CPF LIFE alone would cover approximately ${fmt(Math.round(total10 / 240))} monthly, leaving a ${fmt(retirementGap)} monthly shortfall requiring private investment income.`;
  }
  if (amount <= 15000) {
    const uncoveredIncome = (amount - OW_CEILING_MONTHLY) * 12;
    const cpfAsPercentOfGross = (totalMonthly / amount) * 100;
    return `Your ${fmt(amount)} salary dwarfs the CPF ceiling of ${fmt(OW_CEILING_MONTHLY)}, meaning only ${pct(cpfAsPercentOfGross)} of your gross actually attracts CPF (versus 37% for someone at or below the ceiling). Monthly flows: ${fmt(cpf.oa)} into your Ordinary Account, ${fmt(cpf.sa)} into Special Account, ${fmt(cpf.ma)} into MediSave — totalling ${fmt(totalMonthly)} from combined employee-employer contributions. Annually, ${fmt(oaAnnual)} builds in OA (2.5% interest, usable for property), ${fmt(saAnnual)} grows in SA (4% interest, retirement-locked), and ${fmt(maAnnual)} accumulates in MA (4% interest, healthcare). After five years of compounding: ${fmt(total5)}. After ten years: ${fmt(total10)}. The critical gap: ${fmt(uncoveredIncome)} of your annual income receives zero CPF protection. For a private property purchase, your OA alone at ${fmt(cpf.oa)}/month builds ${fmt(Math.round(oa5))} in five years — a meaningful but possibly insufficient contribution toward a ${fmt(1500000)} to ${fmt(2000000)} private condo purchase in today's market. Supplementary saving of ${fmt(Math.round(amount * 0.15))} monthly into a liquid investment portfolio is advisable to bridge the CPF ceiling limitation.`;
  }
  if (amount <= 20000) {
    const monthlyAboveCeiling = amount - OW_CEILING_MONTHLY;
    const annualAboveCeiling = monthlyAboveCeiling * 12;
    const retirementTarget = Math.round(result.monthlyTakeHome * 0.7);
    const cpfLifeEstimate = Math.round(total10 / 200);
    return `At ${fmt(amount)} per month, CPF represents a diminishing fraction of your total compensation: ${fmt(totalMonthly)} monthly (just ${pct(totalMonthly / amount * 100)} of gross) versus the ${fmt(monthlyAboveCeiling)} that bypasses CPF entirely. The ceiling-capped allocations: OA at ${fmt(cpf.oa)}/month (accumulating ${fmt(oaAnnual)} per year at 2.5% compounding), SA at ${fmt(cpf.sa)}/month (${fmt(saAnnual)}/year at 4% guaranteed), MA at ${fmt(cpf.ma)}/month (${fmt(maAnnual)}/year at 4%). Ten-year balance projection with interest: approximately ${fmt(total10)} total CPF — comprising OA ${fmt(Math.round(oa10))}, SA ${fmt(Math.round(sa10))}, MA ${fmt(Math.round(ma10))}. Retirement arithmetic: targeting ${pct(70, 0)} income replacement (${fmt(retirementTarget)}/month), CPF LIFE might deliver approximately ${fmt(cpfLifeEstimate)} monthly based on your accumulation. The shortfall of ${fmt(retirementTarget - cpfLifeEstimate)}/month requires a private portfolio generating ${fmt((retirementTarget - cpfLifeEstimate) * 12)} annually — achievable with a corpus of approximately ${fmt((retirementTarget - cpfLifeEstimate) * 12 * 25)} at a 4% withdrawal rate. Your ${fmt(annualAboveCeiling)} in annual above-ceiling income, if saved at 50%, builds this corpus in approximately ${Math.round(((retirementTarget - cpfLifeEstimate) * 12 * 25) / (annualAboveCeiling * 0.5))} years.`;
  }
  if (amount <= 25000) {
    const wealthBuildingRate = Math.round((amount - OW_CEILING_MONTHLY) * 0.4);
    const decadeWealth = wealthBuildingRate * 12 * 10;
    return `For a ${fmt(amount)} earner, CPF functions as a modest baseline rather than a comprehensive retirement solution. The system collects ${fmt(totalMonthly)} monthly — employee's ${fmt(cpf.employeeContribution)} plus employer's ${fmt(cpf.employerContribution)} — capped at the ${fmt(OW_CEILING_MONTHLY)} ceiling while ${fmt(amount - OW_CEILING_MONTHLY)} per month passes untouched to your cash compensation. Account-level detail: the Ordinary Account receives ${fmt(cpf.oa)} monthly (building ${fmt(Math.round(oa10))} over a decade with 2.5% compounding). The Special Account accumulates ${fmt(cpf.sa)} per month (reaching ${fmt(Math.round(sa10))} in ten years at 4%). MediSave gathers ${fmt(cpf.ma)} monthly (${fmt(Math.round(ma10))} at the decade mark at 4%). Combined ten-year CPF: ${fmt(total10)}. Wealth building perspective: if you channel ${pct(40, 0)} of your above-ceiling income (${fmt(wealthBuildingRate)}/month) into invested savings, that alone creates ${fmt(decadeWealth)} over ten years before investment returns — dwarfing CPF accumulation by a factor of ${(decadeWealth / total10).toFixed(1)}x. This underscores why private wealth management is central to financial planning at the ${fmt(amount)} income level, with CPF serving primarily as a tax-advantaged healthcare and housing supplement.`;
  }
  // 30000
  const cpfAsPercentOfTotal = (totalMonthly / amount) * 100;
  const privateTargetMonthly = Math.round(amount * 0.35);
  const fireNumber = Math.round(result.monthlyTakeHome * 12 * 25);
  return `At the ${fmt(amount)} monthly level, CPF is structurally marginal: the ${fmt(totalMonthly)} monthly contribution (${pct(cpfAsPercentOfTotal)} of gross) barely moves the needle on your overall financial position. Ceiling-capped flows split as: ${fmt(cpf.oa)} to OA, ${fmt(cpf.sa)} to SA, ${fmt(cpf.ma)} to MA — identical contributions to someone earning just ${fmt(OW_CEILING_MONTHLY)}. Ten-year CPF accumulation including compound interest: ${fmt(total10)} (OA: ${fmt(Math.round(oa10))}, SA: ${fmt(Math.round(sa10))}, MA: ${fmt(Math.round(ma10))}). The disproportion is stark: your annual above-ceiling income of ${fmt((amount - OW_CEILING_MONTHLY) * 12)} exceeds a decade of CPF accumulation in just ${((total10) / ((amount - OW_CEILING_MONTHLY) * 12)).toFixed(1)} years. At this compensation level, CPF's primary value is the MA healthcare reserve and the SA's guaranteed 4% return as a bond-equivalent allocation within your broader portfolio. Financial independence arithmetic: maintaining your current after-tax lifestyle of ${fmt(result.monthlyTakeHome)}/month requires a portfolio of approximately ${fmt(fireNumber)} (using the 4% safe withdrawal rule). Saving ${fmt(privateTargetMonthly)}/month (35% of gross) at 7% annual returns achieves this in approximately ${Math.round(Math.log(fireNumber / (privateTargetMonthly * 12) + 1) / Math.log(1.07))} years.`;
}

// ─── getRaiseSimulation (already rewritten) uses unique intros per band ─────────

// ─── getSingaporeContext ─────────────────────────────────────────────────────────
export function getSingaporeContext(amount: number, result: SalaryResult): string {
  const contexts: Record<number, string> = {
    3000: `For workers earning ${fmt(amount)} in Singapore, government support programmes play a significant role in supplementing income. The Workfare Income Supplement (WIS) provides cash payouts and CPF top-ups for eligible workers aged 30 and above earning up to S$2,500 monthly — though at ${fmt(amount)} you may slightly exceed this threshold. The GST Voucher scheme provides annual rebates to help offset living costs, with eligible lower-income households receiving cash, MediSave top-ups, and utilities rebates totalling S$700 to S$1,000 per year. The Community Development Council (CDC) vouchers distribute S$300 to S$500 annually to all Singaporean households. Additionally, SkillsFuture credits of S$500 (with periodic top-ups) enable free skills upgrading without impacting your budget. At this income level, applying for a Build-To-Order (BTO) HDB flat is viable — couples with combined income below S$14,000 qualify, and the Enhanced CPF Housing Grant can provide up to S$80,000 for eligible first-timer families, substantially reducing the effective cost of home ownership.`,
    4000: `At ${fmt(amount)} monthly, Singapore's ecosystem of grants and schemes begins shifting from pure subsidies toward wealth-building support. The BTO housing pathway is strongly viable: couples earning ${fmt(amount)} each (combined S$8,000) qualify for all HDB schemes, and the CPF Housing Grant of up to S$80,000 (Enhanced Grant for first-timers in non-mature estates) makes a four-room BTO flat achievable with minimal cash outlay. Your CPF OA accumulation of ${fmt(result.cpf.oa)} per month directly services the monthly HDB loan installment. Beyond housing, the SkillsFuture Mid-Career Enhanced Subsidy provides up to 90% course fee support for workers aged 40 and above looking to pivot or upskill. The Singapore Budget 2025 introduced the SkillsFuture Level-Up Programme with an additional S$4,000 credit for workers aged 40+. For young graduates at this level, the Fresh Graduate Employment Credit provides employers with a salary offset, making hiring more attractive and supporting job retention during the critical first year of employment.`,
    5000: `Earning ${fmt(amount)} per month places you at Singapore's economic centre of gravity — near the median where most government policies are calibrated. HDB housing is fully accessible: a four-room BTO in a non-mature estate (Tengah, Woodlands North, Bukit Batok) costs approximately S$300,000 to S$400,000, serviceable with your combined CPF OA contributions if coupled. For singles, the BTO scheme now permits single citizens aged 35+ to buy a two-room flexi flat directly. The Housing Development Board allows up to 30% of monthly OA contributions toward mortgage payments — at your OA rate of ${fmt(result.cpf.oa)}/month, this can comfortably service a S$300,000 loan over 25 years. From an employment standpoint, Singapore's Tripartite Alliance for Dispute Management (TADM) protects workers at all levels, and the Employment Act covers most employees earning up to S$4,500 monthly for overtime and rest day provisions. Importantly, at ${fmt(amount)} you exceed this cap, meaning overtime provisions may not apply unless your contract specifies otherwise. The National Wages Council guidelines recommend annual wage increases of 5.5% to 7.5% for lower-wage workers and 3% to 5% for median earners.`,
    6000: `At ${fmt(amount)} monthly, you occupy the sweet spot in Singapore's policy landscape for CPF maximisation and housing affordability. Your salary sits just below the CPF Ordinary Wage ceiling of S$6,800, meaning virtually every dollar attracts the full 37% combined contribution — a powerful savings mechanism unique to Singapore's social security design. For property planning, a dual-income couple each earning ${fmt(amount)} (combined S$12,000) can comfortably service a five-room BTO flat or resale HDB loan. The CPF OA contribution of ${fmt(result.cpf.oa)} monthly from one partner alone covers a typical HDB loan installment of S$1,200 to S$1,500. Singapore's private property market also becomes accessible through Executive Condominiums (ECs), which are hybrid private-public housing available to couples earning under S$16,000 monthly combined. An EC priced at S$1.2 million to S$1.5 million requires approximately 25% down payment — achievable within 5 to 7 years of disciplined saving at your income level. The Monetary Authority of Singapore (MAS) enforces a Total Debt Servicing Ratio (TDSR) of 55% of gross income, capping your maximum loan obligation at ${fmt(Math.round(amount * 0.55))} per month.`,
    7000: `The ${fmt(amount)} salary point represents a structural inflection in Singapore's CPF system. By crossing the Ordinary Wage ceiling of S$6,800, you experience the ceiling effect for the first time — your CPF contributions cap out, and the ${fmt(amount - OW_CEILING_MONTHLY)} excess flows directly to cash. This design was established to prevent excessive mandatory savings for higher earners while maintaining a baseline retirement and housing safety net. From a housing policy perspective, at ${fmt(amount)} (annual S$84,000) you remain eligible for BTO flats (household income cap S$14,000/month for four-room and larger) and Executive Condominiums (household cap S$16,000). The MAS Total Debt Servicing Ratio at your income level caps total loan obligations at ${fmt(Math.round(amount * 0.55))}/month. Singapore's Employment Pass framework sets the minimum qualifying salary at S$5,000 for most sectors (S$5,500 in financial services) — meaning your salary level also represents the entry point for foreign professionals working in Singapore, making this a globally competitive compensation band for talent attraction. The Complementarity Assessment Framework (COMPASS) now further requires EP holders to meet salary benchmarks relative to local peers.`,
    8000: `At ${fmt(amount)} monthly, you enter the income bracket where Singapore's property market becomes a significant wealth-building opportunity. A dual-income household at this level (S$16,000 combined) can access both HDB resale flats and Executive Condominiums while meeting the Mortgage Servicing Ratio (MSR) caps for HDB loans or the TDSR for bank loans. For private property purchases, the Additional Buyer's Stamp Duty (ABSD) framework applies 0% for your first residential property (for Singapore Citizens). A private condominium priced at S$1.5 million with 25% down requires approximately S$375,000 in equity — achievable through combined CPF OA savings and cash over 7 to 10 years. The Progressive Property Tax system means owner-occupied properties are taxed at just 0% on the first S$8,000 of annual value, scaling to 16% above S$130,000. Singapore's investment landscape is also accessible: your income exceeds the S$80,000 annual threshold for eligibility to some structured investment products, though full accredited investor status (S$300,000 annual income or S$2M net assets) remains a future milestone. The Skills Future Enterprise Credit (SFEC) provides employers with a S$10,000 credit for transformation and training — benefiting professionals like you through upskilling opportunities.`,
    10000: `A ${fmt(amount)} monthly salary in Singapore unlocks significant economic advantages within the city-state's policy framework. At S$120,000 annual gross, you sit comfortably above the Employment Pass minimum qualifying salary (S$5,000 for most sectors), meaning Singapore actively competes for talent at your level through immigration policies like the ONE Pass (for top talent earning S$30,000+) and Tech.Pass for technology specialists. From a housing strategy perspective, your income supports private property acquisition without BTO eligibility constraints. A one-bedroom condominium in the Rest of Central Region priced at S$1.0 million to S$1.5 million requires 25% down (S$250,000 to S$375,000), with 5% minimum in cash and the balance payable from CPF OA. The TDSR framework caps your monthly loan obligations at ${fmt(Math.round(amount * 0.55))}, easily supporting a 25-year mortgage of S$750,000 to S$1.0 million at current interest rates of 3.5% to 4.0%. Singapore's zero capital gains tax policy is particularly relevant at this income level — any property appreciation or investment gains you realise are entirely tax-free, unlike jurisdictions such as Australia (with CGT up to 47%) or the UK (up to 28% on property gains). This makes Singapore exceptionally attractive for long-term wealth accumulation through property and equity investments.`,
    12000: `Singapore's policy landscape at the ${fmt(amount)} income level combines tax efficiency with sophisticated wealth-building infrastructure. Your annual gross of S$144,000 places you in the 15% marginal bracket — remarkably low for a global financial centre. The Supplementary Retirement Scheme (SRS), designed specifically for professionals above the CPF ceiling, allows S$15,300 annual contributions with immediate tax deductibility and tax-free growth until withdrawal at age 62. The political stability and rule of law that attract multinational corporations to Singapore also benefit you as an employee — strong employment protections, predictable tax policy, and minimal bureaucratic friction create an environment where career capital compounds reliably. From a property investment angle, your income supports a leveraged property portfolio: the first property incurs 0% Additional Buyer's Stamp Duty (for Citizens), and the TDSR at ${fmt(Math.round(amount * 0.55))}/month supports a mortgage of approximately S$1.5 million at current rates. Singapore's 99-year leasehold and freehold market structures offer different risk-return profiles, with freehold properties in Districts 9-11 historically appreciating at 3-5% annually. For retirement planning, Singapore's Life Annuities (CPF LIFE) provide a guaranteed baseline income, while the absence of estate duty (abolished in 2008) makes intergenerational wealth transfer efficient.`,
    15000: `At ${fmt(amount)} monthly (S$180,000 annually), Singapore's positioning as Asia's premier wealth hub becomes directly relevant to your financial strategy. The Variable Capital Company (VCC) framework, launched in 2020, enables tax-efficient fund structures for individuals building substantial investment portfolios. Singapore's network of Avoidance of Double Taxation Agreements (DTAs) with over 90 countries protects cross-border income from double taxation — particularly relevant if you hold investments or properties overseas. Your income level qualifies for private banking relationships at institutions such as DBS Private Banking (minimum AUM S$350,000), UBS (S$2 million), and Credit Suisse (S$2 million), which provide access to structured products, IPO allocations, and preferential lending rates. From a career perspective, Singapore's status as the Asian headquarters for numerous Fortune 500 companies means executive mobility between firms is fluid. The Tripartite Guidelines on Fair Employment Practices (TGFEP) prevent age and nationality discrimination, protecting professionals across career transitions. Family planning at this income: international school fees in Singapore range from S$25,000 to S$55,000 per child annually — representing 14% to 31% of your gross income per child, a significant consideration for expatriate or globally-mobile professionals.`,
    20000: `Executive compensation at ${fmt(amount)} monthly positions you within Singapore's economic elite and the infrastructure supporting this tier is well-developed. The Global Investor Programme (GIP) offers permanent residence to individuals making substantial investments in Singapore businesses — relevant for foreign executives considering long-term residence. For Singaporean executives, your income exceeds the S$200,000 annual threshold that qualifies for preferential treatment in various wealth management products and premium banking tiers. The IRAS Notice of Assessment for executives at your level often involves complex computations including equity compensation, restricted stock units (RSUs), and employee stock option plans (ESOPs) — all of which have specific Singapore tax treatment rules (gains taxed on exercise date at progressive rates). Property at this income level shifts toward the luxury segment: Good Class Bungalow (GCB) areas represent Singapore's most exclusive residential addresses, though purchase is restricted to Singapore Citizens only. Condominiums in the Core Central Region (Districts 1, 2, 6, 9, 10, 11) priced at S$3 million to S$5 million are serviceable with dual executive income. The stamp duty structure means Buyer's Stamp Duty scales to 6% on the portion above S$1.5 million, adding approximately S$60,000 to S$150,000 for a premium property purchase.`,
    25000: `At ${fmt(amount)} monthly (S$300,000 annually), you operate at the intersection of Singapore's high-net-worth individual (HNWI) ecosystem and executive employment. This income level meets the threshold for Accredited Investor (AI) status if your net personal assets exceed S$2 million — unlocking access to hedge funds, private equity funds, and pre-IPO securities not available to retail investors. Singapore's Family Office framework, particularly the Section 13O and 13U tax incentive schemes, becomes relevant for executives building dynastic wealth: these schemes exempt investment returns from tax if structured through a Singapore-based fund management company. For Estate planning, Singapore's zero estate duty (abolished 2008) and absence of inheritance tax make it one of the most efficient jurisdictions globally for intergenerational wealth transfer. Your annual income of S$300,000 alone builds approximately S$150,000 to S$200,000 per year in investable surplus (assuming 50-70% savings rate on above-ceiling income), reaching the S$5 million family office minimum in 25 to 33 years without investment returns. The Overseas Networks and Expertise (ONE) Pass is available at your income level for those earning S$30,000+ monthly, offering a 5-year personalised employment pass without employer-specific restrictions.`,
    30000: `Singapore's infrastructure for ultra-high earners at ${fmt(amount)} monthly (S$360,000 annually) is purpose-built to attract and retain global executive talent. The city-state's total tax proposition — top marginal rate of 24%, no capital gains tax, no dividend tax, no estate duty — creates an effective wealth accumulation rate unmatched by competing centres like London (45% top rate + 28% CGT), New York (37% + 23.8% + state/city), or Hong Kong (17% standard rate). For executives at this level, Singapore's S$13O Family Office scheme exempts fund income from tax where the fund is managed by a Singapore-based fund management company with minimum AUM of S$10 million — a threshold achievable within 4 to 6 years of disciplined wealth building at your income. The Financial Sector Technology and Innovation (FSTI) scheme and other MAS initiatives create a robust ecosystem for senior leaders in banking, fintech, and asset management. Living at this income tier means access to Singapore's most exclusive residential properties: Good Class Bungalows in Nassim Road, Cluny Road, or Dalvey Road areas command S$30 million to S$100 million+, while ultra-luxury condominiums (Wallich Residence, 8 Saint Thomas) offer penthouse living at S$15 million to S$30 million. Executive benefits at this level typically include company car allowances (saving S$2,000-S$4,000 monthly), comprehensive family medical coverage (worth S$15,000-S$30,000 annually), and club membership sponsorship — benefits that effectively increase total compensation by 15-25% beyond base salary.`,
  };

  return contexts[amount] || '';
}

// ─── getFinancialMilestones ──────────────────────────────────────────────────────
export function getFinancialMilestones(amount: number, result: SalaryResult): string {
  const monthlyNet = result.monthlyTakeHome;
  const annualNet = result.annualNetIncome;
  const monthlySavings = Math.round(monthlyNet * 0.20); // assume 20% savings rate
  const annualSavings = monthlySavings * 12;

  // Emergency fund (6 months expenses)
  const monthlyExpenses = monthlyNet - monthlySavings;
  const emergencyTarget = monthlyExpenses * 6;
  const monthsToEmergency = Math.ceil(emergencyTarget / monthlySavings);

  // BTO down payment (varies by flat type)
  const btoTargets: Record<number, { type: string; price: number }> = {
    3000: { type: '3-room BTO', price: 200000 },
    4000: { type: '4-room BTO', price: 350000 },
    5000: { type: '4-room BTO', price: 350000 },
    6000: { type: '5-room BTO', price: 450000 },
    7000: { type: '5-room BTO', price: 450000 },
    8000: { type: '5-room resale flat', price: 550000 },
    10000: { type: 'resale executive flat or EC', price: 700000 },
    12000: { type: 'entry-level private condo', price: 1200000 },
    15000: { type: 'mid-range private condo in city fringe', price: 1800000 },
    20000: { type: 'premium condominium in prime district', price: 2500000 },
    25000: { type: 'luxury condo or penthouse', price: 3500000 },
    30000: { type: 'GCB or ultra-luxury apartment', price: 5000000 },
  };
  const housing = btoTargets[amount] || { type: 'property', price: 1000000 };
  const downPayment = Math.round(housing.price * 0.25); // 25% down for private, lower for HDB
  const monthsToDownPayment = Math.ceil(downPayment / monthlySavings);

  // Investment milestone: $100k portfolio
  const portfolioTarget = amount <= 5000 ? 50000 : amount <= 10000 ? 100000 : amount <= 20000 ? 500000 : 1000000;
  const monthsToPortfolio = Math.ceil(portfolioTarget / monthlySavings);
  const yearsToPortfolio = (monthsToPortfolio / 12).toFixed(1);

  // CPF milestones
  const cpfMonthly = result.cpf.totalContribution;
  const cpfAnnual = cpfMonthly * 12;
  const monthsToCpf100k = Math.ceil(100000 / cpfMonthly);

  // Completely unique paragraph per salary band
  const milestones: Record<number, string> = {
    3000: `On a ${fmt(amount)} salary with ${fmt(monthlySavings)} monthly savings (20% of take-home), your financial journey starts with building a six-month emergency fund of ${fmt(emergencyTarget)} — achievable in ${monthsToEmergency} months of disciplined saving. The next milestone is accumulating CPF savings toward your first HDB flat: with combined CPF of ${fmt(cpfMonthly)} monthly, you reach ${fmt(50000)} in OA in approximately ${Math.ceil(50000 / result.cpf.oa)} months, enough for a ${housing.type} down payment contribution. To build a ${fmt(portfolioTarget)} investment portfolio outside CPF takes approximately ${yearsToPortfolio} years at your savings rate. Key priority at this income: qualify for government support schemes like the Workfare Income Supplement (WIS) if applicable, and use SkillsFuture credits for income-boosting certifications.`,
    4000: `With ${fmt(monthlySavings)} in monthly savings capacity from your ${fmt(amount)} salary, the first critical milestone is an emergency fund of ${fmt(emergencyTarget)} — requiring ${monthsToEmergency} months to build. Housing is likely a ${housing.type} priced around ${fmt(housing.price)}, with the 25% down payment of ${fmt(downPayment)} achievable in ${(monthsToDownPayment / 12).toFixed(1)} years combining cash savings and CPF OA accumulation (at ${fmt(result.cpf.oa)}/month). A ${fmt(portfolioTarget)} investment portfolio outside of CPF takes approximately ${yearsToPortfolio} years. Your total CPF reaches ${fmt(100000)} in about ${Math.ceil(100000 / cpfMonthly)} months — a meaningful sum that earns ${fmt(Math.round(100000 * 0.03))} to ${fmt(Math.round(100000 * 0.04))} annually in CPF interest alone. Focus at this stage: automate savings into a robo-advisor (Syfe, StashAway, or Endowus) starting from as little as ${fmt(100)} per month.`,
    5000: `Your ${fmt(amount)} salary generates ${fmt(monthlySavings)} in monthly savings — enough to pursue multiple financial goals simultaneously. Emergency fund of ${fmt(emergencyTarget)}: ${monthsToEmergency} months. A ${housing.type} down payment of approximately ${fmt(downPayment)}: achievable in ${(monthsToDownPayment / 12).toFixed(1)} years of combined CPF and cash savings. Building a ${fmt(portfolioTarget)} investment portfolio takes approximately ${yearsToPortfolio} years at current savings rates (faster with market returns). Your CPF crosses ${fmt(100000)} combined in about ${Math.ceil(100000 / cpfMonthly)} months. At the median income mark, the key insight is that consistent 20% savings plus CPF creates meaningful compound growth — starting a ${fmt(500)} monthly SRS or investment contribution now produces approximately ${fmt(Math.round(500 * 12 * 10 * 1.35))} over 10 years assuming 7% returns.`,
    6000: `Earning ${fmt(amount)} with ${fmt(monthlySavings)} in monthly savings opens a clear path to property ownership and wealth building. Your six-month emergency buffer of ${fmt(emergencyTarget)} takes ${monthsToEmergency} months. The target ${housing.type} at ${fmt(housing.price)} requires a ${fmt(downPayment)} down payment — achievable through ${(monthsToDownPayment / 12).toFixed(1)} years of combined savings and CPF OA accumulation. Your total CPF hits ${fmt(100000)} in approximately ${Math.ceil(100000 / cpfMonthly)} months, after which compound interest begins contributing meaningfully (${fmt(Math.round(100000 * 0.035))} per year in blended CPF interest). A key milestone: building ${fmt(portfolioTarget)} in investable assets outside CPF requires ${yearsToPortfolio} years at ${fmt(monthlySavings)} monthly. The sweet spot at ${fmt(amount)}: maximum CPF accumulation (full contributions below ceiling) combined with emerging capacity for discretionary investing.`,
    7000: `At ${fmt(amount)} monthly, your savings capacity of ${fmt(monthlySavings)} per month places multiple financial milestones within five-year reach. Emergency fund (${fmt(emergencyTarget)}): ${monthsToEmergency} months. The ceiling crossing at ${fmt(OW_CEILING_MONTHLY)} means ${fmt(amount - OW_CEILING_MONTHLY)} extra cash monthly versus a ceiling-level earner — use this for accelerated investing. Target property: a ${housing.type} at ${fmt(housing.price)} with ${fmt(downPayment)} down payment requires ${(monthsToDownPayment / 12).toFixed(1)} years of saving. CPF reaches ${fmt(100000)} combined in approximately ${Math.ceil(100000 / cpfMonthly)} months. Portfolio milestone of ${fmt(portfolioTarget)} in liquid investments: ${yearsToPortfolio} years from savings alone, potentially faster if you direct the ${fmt(amount - OW_CEILING_MONTHLY)} monthly above-ceiling windfall entirely to investments (reaching the target in ${(portfolioTarget / ((amount - OW_CEILING_MONTHLY) + monthlySavings) / 12).toFixed(1)} years).`,
    8000: `Your ${fmt(amount)} salary provides ${fmt(monthlySavings)} in monthly investment capacity. With ${fmt(amount - OW_CEILING_MONTHLY)} sitting above the CPF ceiling monthly, your liquid cash flow is stronger than the headline savings rate suggests. Emergency reserve of ${fmt(emergencyTarget)}: ${monthsToEmergency} months to build. Property: a ${housing.type} priced around ${fmt(housing.price)} needs ${fmt(downPayment)} down — achievable in ${(monthsToDownPayment / 12).toFixed(1)} years combining bank savings and CPF OA. Portfolio goals: ${fmt(portfolioTarget)} in liquid investments requires ${yearsToPortfolio} years at base savings, but accelerating with the above-ceiling portion cuts this to approximately ${Math.round(monthsToPortfolio * 0.6)} months. Your CPF accumulation of ${fmt(cpfAnnual)} per year means ${fmt(100000)} in CPF within ${Math.ceil(100000 / cpfMonthly)} months. At this income level, consider deploying the CPF Investment Scheme (CPFIS) to invest OA funds in index ETFs rather than accepting the 2.5% OA rate — potential long-term outperformance of 3-5% annually.`,
    10000: `With ${fmt(monthlySavings)} monthly from your ${fmt(amount)} salary, you can simultaneously target wealth accumulation and premium property. Emergency buffer of ${fmt(emergencyTarget)}: just ${monthsToEmergency} months at your savings rate. The aspiration property — a ${housing.type} at approximately ${fmt(housing.price)} — requires ${fmt(downPayment)} in down payment, achievable in ${(monthsToDownPayment / 12).toFixed(1)} years. Building a ${fmt(portfolioTarget)} liquid investment portfolio is a ${yearsToPortfolio}-year project at base savings rate. CPF hits ${fmt(100000)} total in ${Math.ceil(100000 / cpfMonthly)} months, and ${fmt(200000)} in approximately ${Math.ceil(200000 / cpfMonthly)} months. Critical wealth accelerators at ${fmt(amount)}: the ${fmt((amount - OW_CEILING_MONTHLY) * 12)} annual income above CPF ceiling is your primary wealth-building fuel — channelling 50% of this into a globally diversified equity portfolio (total ${fmt(Math.round((amount - OW_CEILING_MONTHLY) * 6))}/year) compounds to approximately ${fmt(Math.round((amount - OW_CEILING_MONTHLY) * 6 * 10 * 1.5))} in a decade at 7% average returns.`,
    12000: `Your ${fmt(amount)} salary with ${fmt(monthlySavings)} in monthly savings capacity positions you for significant wealth creation over a decade. Property goal: a ${housing.type} at ${fmt(housing.price)} needs ${fmt(downPayment)} down — achievable in ${(monthsToDownPayment / 12).toFixed(1)} years while maintaining other financial goals. Building ${fmt(portfolioTarget)} in liquid invested assets: ${yearsToPortfolio} years at base rate, or substantially faster by directing bonus income and above-ceiling cash flow. Your annual above-ceiling cash of ${fmt((amount - OW_CEILING_MONTHLY) * 12)} provides a powerful investment engine — at 50% allocation, that is ${fmt(Math.round((amount - OW_CEILING_MONTHLY) * 6))} annually into growth assets. Ten-year wealth projection assuming 7% average returns on invested savings: approximately ${fmt(Math.round(monthlySavings * 12 * 10 * 1.5 + (amount - OW_CEILING_MONTHLY) * 6 * 10 * 1.5))} in liquid assets alongside approximately ${fmt(Math.round(cpfAnnual * 10 * 1.15))} in CPF. Emergency fund of ${fmt(emergencyTarget)} is a quick ${monthsToEmergency}-month exercise at your income.`,
    15000: `At ${fmt(amount)} monthly with ${fmt(monthlySavings)} in savings, your financial trajectory includes property at the ${housing.type} level (around ${fmt(housing.price)}, with ${fmt(downPayment)} down payment in ${(monthsToDownPayment / 12).toFixed(1)} years). Portfolio milestone of ${fmt(portfolioTarget)}: reachable in ${yearsToPortfolio} years through base savings alone. Your above-ceiling income of ${fmt((amount - OW_CEILING_MONTHLY) * 12)} per year is the primary wealth catalyst — investing 60% of this (${fmt(Math.round((amount - OW_CEILING_MONTHLY) * 12 * 0.6))}/year) at 7% compounding creates approximately ${fmt(Math.round((amount - OW_CEILING_MONTHLY) * 12 * 0.6 * 13.8))} over a decade. Combined with base savings and CPF, your ten-year projected net worth could reach ${fmt(Math.round(monthlySavings * 12 * 10 * 1.5 + (amount - OW_CEILING_MONTHLY) * 7 * 10 * 1.5 + cpfAnnual * 10 * 1.15))}. At this level, accredited investor status (net personal assets exceeding ${fmt(2000000)} or income exceeding ${fmt(300000)} per annum) unlocks access to hedge funds, private equity, and pre-IPO opportunities unavailable to retail investors.`,
    20000: `Earning ${fmt(amount)} monthly positions you to achieve financial independence within a defined timeframe. With ${fmt(monthlySavings)} in monthly savings from take-home alone — plus bonus income typically ranging from 2 to 6 months at this level — your wealth accumulation is rapid. Property aspiration: a ${housing.type} at ${fmt(housing.price)} requires ${fmt(downPayment)} down, achievable in under ${(monthsToDownPayment / 12).toFixed(1)} years. The ${fmt(portfolioTarget)} liquid portfolio milestone: ${yearsToPortfolio} years at base savings rate. Above-ceiling income of ${fmt((amount - OW_CEILING_MONTHLY) * 12)} annually is substantial — at 50% savings on this portion alone, you add ${fmt(Math.round((amount - OW_CEILING_MONTHLY) * 6))} per year to investments. Ten-year compounded projection (7% returns) on total investable flow: approximately ${fmt(Math.round((monthlySavings * 12 + (amount - OW_CEILING_MONTHLY) * 6) * 13.8))}. Financial independence target (25x annual expenses): approximately ${fmt(Math.round(monthlyExpenses * 12 * 25))}, potentially achievable in ${Math.round(Math.log((monthlyExpenses * 12 * 25) / ((monthlySavings + (amount - OW_CEILING_MONTHLY) * 0.5) * 12) + 1) / Math.log(1.07))} years with disciplined execution.`,
    25000: `At ${fmt(amount)} per month, financial independence is not aspirational but achievable within a planning horizon. Monthly savings of ${fmt(monthlySavings)} from take-home, plus above-ceiling cash flow of ${fmt(amount - OW_CEILING_MONTHLY)} monthly, creates a total investment capacity approaching ${fmt(monthlySavings + Math.round((amount - OW_CEILING_MONTHLY) * 0.5))} per month. Property: a ${housing.type} valued at ${fmt(housing.price)} requires ${fmt(downPayment)} — well within reach given your liquidity generation. The ${fmt(portfolioTarget)} portfolio milestone arrives in approximately ${yearsToPortfolio} years at base rate. FIRE (Financial Independence Retire Early) calculation: at current expenses of ${fmt(monthlyExpenses)}/month (${fmt(monthlyExpenses * 12)}/year), the 25x multiple target is ${fmt(Math.round(monthlyExpenses * 12 * 25))}. Your annual investable surplus (savings + 50% above-ceiling) of ${fmt(Math.round((monthlySavings + (amount - OW_CEILING_MONTHLY) * 0.5) * 12))} compounds at 7% to reach this target in approximately ${Math.round(Math.log((monthlyExpenses * 12 * 25) / ((monthlySavings + (amount - OW_CEILING_MONTHLY) * 0.5) * 12) + 1) / Math.log(1.07))} years.`,
    30000: `Your ${fmt(amount)} monthly compensation generates extraordinary wealth-building capacity. Between take-home savings of ${fmt(monthlySavings)} and the ${fmt(amount - OW_CEILING_MONTHLY)} monthly above-ceiling surplus, total annual investment capacity exceeds ${fmt(Math.round((monthlySavings + (amount - OW_CEILING_MONTHLY) * 0.5) * 12))}. A ${housing.type} at ${fmt(housing.price)} is well within reach as a cash purchase within ${(housing.price / annualSavings).toFixed(1)} years of saving. Financial independence (25x annual expenses of ${fmt(monthlyExpenses * 12)}): target portfolio of ${fmt(Math.round(monthlyExpenses * 12 * 25))}. At your savings and investment rate with 7% compounding, this milestone arrives in approximately ${Math.round(Math.log((monthlyExpenses * 12 * 25) / ((monthlySavings + (amount - OW_CEILING_MONTHLY) * 0.5) * 12) + 1) / Math.log(1.07))} years — potentially before age 50 if started in your thirties. Legacy wealth target: building a ${fmt(10000000)} estate (typical for family office threshold in Singapore) would require approximately ${Math.round(Math.log(10000000 / ((monthlySavings + (amount - OW_CEILING_MONTHLY) * 0.5) * 12) + 1) / Math.log(1.07))} years of compounding at current rates.`,
  };

  return milestones[amount] || '';
}

// ─── Master content assembler ───────────────────────────────────────────────────
export interface SalaryPageContent {
  bandContext: string;
  careerDescription: string;
  taxTips: string;
  faqs: { question: string; answer: string }[];
  raiseSimulation: string;
  budgetBreakdown: string;
  comparisons: string;
  cpfDeepDive: string;
  financialMilestones: string;
  singaporeContext: string;
}

export function generateSalaryPageContent(amount: number): SalaryPageContent {
  const result = calculateSalary({
    monthlyGross: amount,
    age: 30,
    residencyType: 'citizen',
    annualBonus: 0,
  });

  return {
    bandContext: getBandContext(amount, result),
    careerDescription: getCareerDescription(amount),
    taxTips: getTaxTips(amount, result),
    faqs: buildFaqs(amount, result),
    raiseSimulation: getRaiseSimulation(amount, result),
    budgetBreakdown: getBudgetBreakdown(result.monthlyTakeHome, amount),
    comparisons: getUniqueComparisons(amount, result),
    cpfDeepDive: getCPFDeepDive(amount, result),
    financialMilestones: getFinancialMilestones(amount, result),
    singaporeContext: getSingaporeContext(amount, result),
  };
}
